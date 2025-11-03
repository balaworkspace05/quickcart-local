import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Clock, CheckCircle, Star, Gift, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '@/hooks/useOrders';

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
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      setProfile(profileData);

      if (!profileData) return;

      // Fetch orders
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Orders error:', error);
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
            filter: `customer_id=eq.${profileData.id}`
          },
          () => {
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
      case 'out-for-delivery':
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
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Recent Orders
            </h2>
            <Button variant="outline" onClick={() => navigate('/orders')}>
              View All
            </Button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
              <Button onClick={() => navigate('/market')}>Browse Products</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-primary/10 hover:border-primary/30 transition-all bg-background/50"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.total_price}</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:scale-105 transition-all cursor-pointer" onClick={() => navigate('/market')}>
            <Package className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Browse Products</h3>
            <p className="text-muted-foreground">Discover fresh products from local vendors</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/20 hover:scale-105 transition-all cursor-pointer" onClick={() => navigate('/feedback')}>
            <MessageSquare className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Share Feedback</h3>
            <p className="text-muted-foreground">Help us improve your shopping experience</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
