import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Store, Package, TrendingUp, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || userRole !== 'admin') {
      navigate('/auth');
    }
  }, [user, userRole, navigate]);

  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', color: 'text-primary' },
    { icon: Store, label: 'Total Shops', value: '456', color: 'text-secondary' },
    { icon: Package, label: 'Total Orders', value: '7,890', color: 'text-accent' },
    { icon: TrendingUp, label: 'Revenue', value: '$45,678', color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          >
            Admin Dashboard
          </motion.h1>
          <Button onClick={signOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-primary/20"
        >
          <h2 className="text-2xl font-semibold mb-4">Admin Controls</h2>
          <p className="text-muted-foreground mb-6">
            Manage users, shops, orders, and view analytics from this central dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full">
              <Store className="w-4 h-4 mr-2" />
              Manage Shops
            </Button>
            <Button variant="outline" className="w-full">
              <Package className="w-4 h-4 mr-2" />
              Manage Orders
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
