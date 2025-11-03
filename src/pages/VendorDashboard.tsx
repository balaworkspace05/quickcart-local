import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VendorLayout from '@/components/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  TrendingUp,
  ShoppingBag,
  Star,
  DollarSign,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Shop {
  id: string;
  name: string;
  logo_url: string | null;
  rating: number;
  category: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  category: string;
  in_stock: boolean;
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  profiles?: { name: string };
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalRevenue: 0,
    avgRating: 0,
    activeProducts: 0,
  });

  useEffect(() => {
    if (user) {
      loadData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const setupRealtimeSubscriptions = () => {
    if (!shop?.id) return;

    // Subscribe to product changes
    const productsChannel = supabase
      .channel('vendor-products')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `vendor_id=eq.${shop.id}`
      }, () => {
        loadData();
      })
      .subscribe();

    // Subscribe to order changes
    const ordersChannel = supabase
      .channel('vendor-orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `vendor_id=eq.${shop.id}`
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
    };
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get profile id from user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profile) return;

      const { data: shopData, error: shopError } = await supabase
        .from('vendors')
        .select('id, shop_name, logo_url')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (shopError) throw shopError;
      
      const transformedShop = shopData ? {
        id: shopData.id,
        name: shopData.shop_name,
        logo_url: shopData.logo_url,
        rating: 4.5,
        category: 'general'
      } : null;
      
      setShop(transformedShop);

      if (shopData) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('vendor_id', shopData.id);

        setProducts(productsData || []);

        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, profiles(name)')
          .eq('vendor_id', shopData.id);

        setOrders(ordersData || []);

        const today = new Date().toISOString().split('T')[0];
        const todayOrders = (ordersData || []).filter((o: any) => o.created_at.startsWith(today)).length;
        const deliveredOrders = (ordersData || []).filter((o: any) => o.status === 'delivered');
        const totalRevenue = deliveredOrders.reduce((sum: number, o: any) => sum + Number(o.total_price), 0);
        const activeProducts = productsData?.filter(p => p.in_stock && p.stock > 0).length || 0;

        setStats({
          todayOrders,
          totalRevenue,
          avgRating: 4.5,
          activeProducts,
        });

        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('receiver_id', profile.id)
          .limit(5);

        setNotifications(notificationsData || []);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getWeeklySalesData = () => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      name: day,
      sales: Math.floor(Math.random() * 5000) + 1000,
    }));
  };

  if (loading) {
    return (
      <VendorLayout shopName={shop?.name}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </VendorLayout>
    );
  }

  if (!shop) {
    return (
      <VendorLayout>
        <Card>
          <CardHeader>
            <CardTitle>No Shop Found</CardTitle>
            <p className="text-sm text-muted-foreground">
              You need to create a shop first to access the vendor dashboard.
            </p>
          </CardHeader>
        </Card>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout 
      shopName={shop.name} 
      shopLogo={shop.logo_url}
      notificationCount={notifications.filter(n => !n.read).length}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back to your vendor portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.todayOrders}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shop Rating</p>
                  <p className="text-3xl font-bold mt-2">{stats.avgRating.toFixed(1)}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                  <p className="text-3xl font-bold mt-2">{stats.activeProducts}</p>
                </div>
                <Package className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
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
                        <p className="text-sm text-muted-foreground">{order.profiles?.name || 'Customer'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{Number(order.total_price).toFixed(2)}</p>
                        <Badge>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Low Stock Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {products.filter(p => p.stock <= 10 && p.in_stock).length > 0 ? (
                <div className="space-y-4">
                  {products.filter(p => p.stock <= 10 && p.in_stock).slice(0, 5).map((product) => (
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
                <p className="text-center text-muted-foreground py-8">All products well stocked!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getWeeklySalesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}
