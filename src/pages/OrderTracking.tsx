import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  Phone,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  product_id?: string;
  products?: {
    name: string;
  };
}

export default function OrderTracking() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Check for demo user
  const getDemoUser = () => {
    const demoUserData = localStorage.getItem('demo_user');
    if (demoUserData) {
      return JSON.parse(demoUserData);
    }
    return null;
  };

  useEffect(() => {
    const demoUser = getDemoUser();
    if (user || demoUser) {
      fetchOrders();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // Get profile id from user or demo user
      const demoUser = getDemoUser();
      let profileId = null;

      if (demoUser) {
        // Use demo user profile
        profileId = demoUser.profile.id;
      } else if (user) {
        // Get profile id from authenticated user
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        profileId = profile?.id;
      }

      if (!profileId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            name
          )
        `)
        .eq('customer_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('order-tracking')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
  
  // Order status counts
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pending', color: 'bg-gray-500', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-500', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Track Your Orders</h1>
          <p className="text-muted-foreground">
            Monitor your order status and delivery progress
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg p-6 shadow-card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by order ID or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('all')}
            className="flex items-center space-x-2"
          >
            <span>All Orders</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.all}
            </Badge>
          </Button>
          
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {statusCounts[status as keyof typeof statusCounts]}
                </Badge>
              </Button>
            );
          })}
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge className={statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-500'}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Total:</span> ₹{order.total_price}
                    </p>
                    {order.products && (
                      <p className="text-sm text-muted-foreground">
                        Product: {order.products.name}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : "You haven't placed any orders yet."}
            </p>
            {!searchTerm && selectedStatus === 'all' ? (
              <Button onClick={() => window.location.href = '/shops'}>
                Start Shopping
              </Button>
            ) : (
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
              }}>
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}