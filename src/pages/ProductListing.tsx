import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Star, Clock, MapPin, ShoppingCart, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import Recommendations from '@/components/revenue/Recommendations';
import { useShop } from '@/hooks/useShops';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';

export default function ProductListing() {
  const { shopId } = useParams();
  const { getCartItemCount, isCartOpen, setCartOpen, getCartTotal } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: shop, isLoading: shopLoading } = useShop(shopId || '');
  const { data: products, isLoading: productsLoading } = useProducts(shopId);
  
  // Real-time subscription for products
  useEffect(() => {
    if (!shopId) return;
    
    const channel = supabase
      .channel('product-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `shop_id=eq.${shopId}`
      }, () => {
        // Refetch products on any change
        window.location.reload();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [shopId]);
  
  const shopProducts = products || [];
  
  if (shopLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shop not found</h1>
          <Link to="/shops">
            <Button>Browse Shops</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(shopProducts.map(p => p.category.toLowerCase())))];
  
  // Filter products
  const filteredProducts = shopProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const cartCount = getCartItemCount();
  const cartTotal = getCartTotal();

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Header */}
      <div className="bg-gradient-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Link to="/shops">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shops
                </Button>
              </Link>
            </div>
            
            {cartCount > 0 && (
              <Button
                onClick={() => setCartOpen(!isCartOpen)}
                className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {cartCount} items • ₹{cartTotal}
              </Button>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start space-x-6 mt-4"
          >
            {/* Shop Logo */}
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl overflow-hidden">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                '🏪'
              )}
            </div>
            
            {/* Shop Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold">{shop.name}</h1>
                <Badge variant={shop.is_open ? "default" : "secondary"}>
                  {shop.is_open ? 'Open' : 'Closed'}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-warning" />
                  <span>{shop.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.distance} away</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{shop.delivery_time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg p-6 shadow-card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {filteredProducts.length} products available
              </h2>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="capitalize">
                  {selectedCategory}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search to find what you're looking for.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* Recommendations Section */}
        {filteredProducts.length > 0 && (
          <Recommendations productCategory={selectedCategory !== 'all' ? selectedCategory : 'bread'} />
        )}

        {/* Shop Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-card rounded-lg p-6 shadow-card"
        >
          <h3 className="font-semibold mb-4">About {shop.name}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Store Details</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>📍 {shop.distance} from your location</li>
                <li>⭐ {shop.rating?.toFixed(1) || '0.0'} rating from customers</li>
                <li>🕒 Delivery in {shop.delivery_time}</li>
                <li>🏪 {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)} store</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Why Shop Here?</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>✅ Fresh, quality products</li>
                <li>✅ Support local business</li>
                <li>✅ Fast delivery guaranteed</li>
                <li>✅ Authentic products only</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-40 lg:hidden"
        >
          <Button
            onClick={() => setCartOpen(true)}
            className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-floating rounded-full h-14 w-14"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground min-w-[20px] h-5 flex items-center justify-center">
                {cartCount}
              </Badge>
            </div>
          </Button>
        </motion.div>
      )}
    </div>
  );
}