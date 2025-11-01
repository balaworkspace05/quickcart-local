import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VendorLayout from '@/components/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle, Upload, Loader2, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageUpload } from '@/hooks/useImageUpload';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  unit: string | null;
}

interface Shop {
  id: string;
  name: string;
  logo_url: string | null;
}

export default function VendorInventory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category: '',
    unit: 'piece',
    image_url: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { uploadImage, uploading, uploadProgress } = useImageUpload('product-images');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch or create shop for vendor
      let { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('id, name, logo_url')
        .eq('owner_id', user?.id)
        .maybeSingle();

      if (shopError) {
        console.error('Error loading shop:', shopError);
        toast.error('Failed to load shop information');
        return;
      }
      
      // If no shop exists, create one automatically
      if (!shopData) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, address')
          .eq('id', user?.id)
          .maybeSingle();

        const { data: newShop, error: createError } = await supabase
          .from('shops')
          .insert({
            user_id: user?.id,
            name: profileData?.name ? `${profileData.name}'s Shop` : 'My Shop',
            location: profileData?.address || 'Location not set',
            category: 'General',
            is_open: true,
            rating: 0.0,
            delivery_time: '20-30 mins',
            distance: '1.5 km'
          } as any)
          .select('id, name, logo_url')
          .single();

        if (createError) {
          console.error('Error creating shop:', createError);
          toast.error('Failed to create shop. Please try again.');
          return;
        }

        shopData = newShop;
        toast.success('Shop created successfully!');
      }
      
      setShop(shopData);

      if (shopData) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!shop?.id) return;

    const channel = supabase
      .channel('product-inventory-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `shop_id=eq.${shop.id}`
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shop?.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!shop) {
      toast.error('Shop information not found');
      return;
    }

    // Enhanced Validation
    if (!productForm.name.trim()) {
      toast.error('❌ Product name is required');
      return;
    }
    if (!productForm.category.trim()) {
      toast.error('❌ Category is required');
      return;
    }
    if (!productForm.description.trim()) {
      toast.error('❌ Description is required');
      return;
    }
    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      toast.error('❌ Valid price is required');
      return;
    }
    if (!productForm.stock || parseInt(productForm.stock) < 0) {
      toast.error('❌ Valid stock quantity is required');
      return;
    }
    if (!selectedImage && !productForm.image_url) {
      toast.error('❌ Product image is required');
      return;
    }

    try {
      let image_url = productForm.image_url;

      // Upload new image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) {
          toast.error('Failed to upload image');
          return;
        }
        image_url = uploadedUrl;
      }

      const productData = {
        shop_id: shop.id,
        name: productForm.name.trim(),
        description: productForm.description.trim() || null,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
        stock: parseInt(productForm.stock),
        category: productForm.category.trim(),
        unit: productForm.unit,
        is_available: true,
        image_url,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('✅ Product updated successfully!');
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast.success('✅ Product added successfully! It will appear instantly in the marketplace.');
      }

      setIsDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error: any) {
      console.error('Product submission error:', error);
      toast.error(`❌ Failed to ${editingProduct ? 'update' : 'add'} product: ${error.message}`);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      toast.success('Product deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !product.is_available })
        .eq('id', product.id);

      if (error) throw error;
      toast.success(`Product ${product.is_available ? 'disabled' : 'enabled'}`);
      loadData();
    } catch (error: any) {
      toast.error('Failed to update product');
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      stock: product.stock.toString(),
      category: product.category,
      unit: product.unit || 'piece',
      image_url: product.image_url || '',
    });
    setImagePreview(product.image_url || '');
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      original_price: '',
      stock: '',
      category: '',
      unit: 'piece',
      image_url: '',
    });
    setEditingProduct(null);
    setSelectedImage(null);
    setImagePreview('');
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-destructive', progress: 0 };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-warning', progress: 30 };
    return { label: 'In Stock', color: 'bg-success', progress: 100 };
  };

  if (loading) {
    return (
      <VendorLayout shopName={shop?.name}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96" />
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout shopName={shop?.name} shopLogo={shop?.logo_url}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Inventory</h1>
            <p className="text-muted-foreground">Manage your products and stock levels</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Product Image</Label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview('');
                            setSelectedImage(null);
                            setProductForm({ ...productForm, image_url: '' });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {uploadProgress}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="e.g., Groceries, Electronics"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Product description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Original Price (₹)</Label>
                  <Input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={productForm.unit} onValueChange={(value) => setProductForm({ ...productForm, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="g">Gram</SelectItem>
                      <SelectItem value="l">Liter</SelectItem>
                      <SelectItem value="ml">Milliliter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    `${editingProduct ? 'Update' : 'Add'} Product`
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="font-medium">₹{product.price}</div>
                        {product.original_price && (
                          <div className="text-sm text-muted-foreground line-through">
                            ₹{product.original_price}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.stock}</span>
                            <Badge variant="outline" className={`${stockStatus.color} text-white`}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                          <Progress value={stockStatus.progress} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_available ? 'default' : 'secondary'}>
                          {product.is_available ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleAvailability(product)}
                          >
                            {product.is_available ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}
