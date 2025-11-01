import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Clock, CheckCircle, Star, Gift, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function CustomerDashboard() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user || userRole !== 'customer') {
      navigate('/auth');
      return;
    }
    fetchDashboardData();
  }, [user, userRole, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile (use maybeSingle to handle no profile gracefully)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch orders - safe to return empty array if no orders exist
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Orders error:', error);
        // Don't throw on "no rows" - just set empty
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }
      setOrders(ordersData || []);

      // Set up realtime subscription for orders
      const channel = supabase
        .channel('customer-orders')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user?.id}`
          },
          () => {
            // Refetch orders when any change occurs
            fetchDashboardData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'out_for_delivery':
        return <Package className="w-5 h-5 text-primary" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  const stats = [
    { icon: Package, label: 'Active Orders', value: orders.filter(o => o.status !== 'delivered').length, color: 'text-primary' },
    { icon: CheckCircle, label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, color: 'text-success' },
    { icon: Star, label: 'Rewards Points', value: '120', color: 'text-accent' },
    { icon: Gift, label: 'Offers Available', value: '3', color: 'text-secondary' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Welcome back, {profile?.name || 'Customer'}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your orders today</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Orders */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button onClick={() => navigate('/shops')}>Start Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total_amount}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.status.replace('_', ' ')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 text-lg"
              onClick={() => navigate('/shops')}
            >
              <Package className="w-6 h-6 mr-2" />
              Browse Shops
            </Button>
            <Button
              variant="outline"
              className="h-20 text-lg"
              onClick={() => navigate('/orders')}
            >
              <Clock className="w-6 h-6 mr-2" />
              Track Orders
            </Button>
            <Button
              variant="outline"
              className="h-20 text-lg"
              onClick={() => navigate('/customer/feedback')}
            >
              <MessageSquare className="w-6 h-6 mr-2" />
              Give Feedback
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
