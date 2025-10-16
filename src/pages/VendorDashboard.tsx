import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  TrendingUp,
  ShoppingBag,
  Star,
  Plus,
  Edit,
  Trash2,
  Bell,
  LogOut,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Shop {
  id: string;
  name: string;
  logo_url: string | null;
  rating: number;
  category: string;
  location: string;
  is_open: boolean;
}

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

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  delivery_address: string;
  profiles?: { name: string };
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: { name: string };
}

export default function VendorDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalRevenue: 0,
    avgRating: 0,
    activeProducts: 0,
  });
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category: '',
    unit: 'piece',
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadVendorData();
    }
  }, [user]);

  const loadVendorData = async () => {
    try {
      setLoading(true);

      // Load shop data
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user?.id)
        .single();

      if (shopError) throw shopError;
      setShop(shopData);

      if (shopData) {
        // Load products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Load orders for this shop
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from('order_items')
          .select('*, products(name), orders(*, profiles(name))')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false });

        if (orderItemsError) throw orderItemsError;
        setOrderItems(orderItemsData || []);

        // Extract unique orders
        const uniqueOrders = orderItemsData
          ?.map((item: any) => item.orders)
          .filter((order: any, index: number, self: any[]) =>
            index === self.findIndex((o: any) => o?.id === order?.id)
          )
          .filter((order: any) => order !== null) || [];

        setOrders(uniqueOrders);

        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = uniqueOrders.filter((o: Order) => 
          o.created_at.startsWith(today)
        ).length;

        const deliveredOrders = uniqueOrders.filter((o: Order) => 
          o.status === 'delivered'
        );
        const totalRevenue = deliveredOrders.reduce((sum: number, o: Order) => 
          sum + Number(o.total_amount), 0
        );

        const activeProducts = productsData?.filter(p => p.is_available && p.stock > 0).length || 0;

        setStats({
          todayOrders,
          totalRevenue,
          avgRating: shopData.rating || 0,
          activeProducts,
        });

        // Load notifications
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setNotifications(notificationsData || []);
      }
    } catch (error: any) {
      console.error('Error loading vendor data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAddProduct = async () => {
    if (!shop) return;

    try {
      const { error } = await supabase.from('products').insert({
        shop_id: shop.id,
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
        stock: parseInt(productForm.stock),
        category: productForm.category,
        unit: productForm.unit,
        is_available: true,
      });

      if (error) throw error;

      toast.success('Product added successfully');
      setIsProductDialogOpen(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        original_price: '',
        stock: '',
        category: '',
        unit: 'piece',
      });
      loadVendorData();
    } catch (error: any) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
          stock: parseInt(productForm.stock),
          category: productForm.category,
          unit: productForm.unit,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast.success('Product updated successfully');
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      loadVendorData();
    } catch (error: any) {
      toast.error('Failed to update product');
      console.error(error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product deleted successfully');
      loadVendorData();
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
      loadVendorData();
    } catch (error: any) {
      toast.error('Failed to update product availability');
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
    });
    setIsProductDialogOpen(true);
  };

  const getWeeklySalesData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesByDay = days.map(day => ({
      name: day,
      sales: Math.floor(Math.random() * 5000) + 1000,
    }));
    return salesByDay;
  };

  const getCategorySalesData = () => {
    const categories = Array.from(new Set(products.map(p => p.category))).slice(0, 5);
    return categories.map(cat => ({
      name: cat,
      revenue: Math.floor(Math.random() * 10000) + 2000,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-16 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>No Shop Found</CardTitle>
            <CardDescription>
              You need to create a shop first to access the vendor dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt={shop.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                  {shop.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{shop.name}</h1>
                <p className="text-sm text-muted-foreground">{shop.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/vendor/profile')}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.todayOrders}</p>
                </div>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shop Rating</p>
                  <p className="text-3xl font-bold mt-2">{stats.avgRating.toFixed(1)}</p>
                </div>
                <div className="w-14 h-14 bg-warning/10 rounded-full flex items-center justify-center">
                  <Star className="w-7 h-7 text-warning fill-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                  <p className="text-3xl font-bold mt-2">{stats.activeProducts}</p>
                </div>
                <div className="w-14 h-14 bg-info/10 rounded-full flex items-center justify-center">
                  <Package className="w-7 h-7 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.slice(0, 5).length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                            <div>
                              <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.profiles?.name || 'Customer'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₹{Number(order.total_amount).toFixed(2)}</p>
                              <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No orders yet</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span>Low Stock Products</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {products.filter(p => p.stock <= 10 && p.is_available).length > 0 ? (
                      <div className="space-y-4">
                        {products
                          .filter(p => p.stock <= 10 && p.is_available)
                          .slice(0, 5)
                          .map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-destructive">{product.stock} left</p>
                                <Progress value={(product.stock / 50) * 100} className="w-20 h-2 mt-2" />
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">All products are well stocked!</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {notifications.length > 0 && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>Messages from Admin</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 bg-accent rounded-lg">
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Inventory</CardTitle>
                    <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-primary" onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: '',
                            description: '',
                            price: '',
                            original_price: '',
                            stock: '',
                            category: '',
                            unit: 'piece',
                          });
                        }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                          <DialogDescription>
                            {editingProduct ? 'Update product details' : 'Fill in the product details below'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={productForm.description}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price">Price (₹)</Label>
                              <Input
                                id="price"
                                type="number"
                                value={productForm.price}
                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="original_price">Original Price</Label>
                              <Input
                                id="original_price"
                                type="number"
                                value={productForm.original_price}
                                onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="stock">Stock</Label>
                              <Input
                                id="stock"
                                type="number"
                                value={productForm.stock}
                                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="unit">Unit</Label>
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
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={productForm.category}
                              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            />
                          </div>
                          <Button
                            className="w-full bg-gradient-primary"
                            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                          >
                            {editingProduct ? 'Update Product' : 'Add Product'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.description?.slice(0, 40)}</p>
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-bold">₹{product.price}</p>
                                {product.original_price && (
                                  <p className="text-sm text-muted-foreground line-through">
                                    ₹{product.original_price}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className={product.stock <= 10 ? 'text-destructive font-bold' : ''}>
                                  {product.stock}
                                </span>
                                {product.stock <= 10 && <AlertTriangle className="w-4 h-4 text-warning" />}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={product.is_available ? 'default' : 'secondary'}
                                size="sm"
                                onClick={() => handleToggleAvailability(product)}
                              >
                                {product.is_available ? 'Available' : 'Unavailable'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No products yet. Add your first product!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono">#{order.id.slice(0, 8)}</TableCell>
                            <TableCell>{order.profiles?.name || 'Customer'}</TableCell>
                            <TableCell className="font-bold">₹{Number(order.total_amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === 'delivered'
                                    ? 'default'
                                    : order.status === 'pending'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Weekly Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getWeeklySalesData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getCategorySalesData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
