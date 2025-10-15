import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, ShoppingCart, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type UserRole = 'customer' | 'shopkeeper' | 'delivery';

const roleConfig = {
  customer: {
    icon: ShoppingCart,
    title: 'Customer',
    description: 'Shop from local stores',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  shopkeeper: {
    icon: Store,
    title: 'Shopkeeper',
    description: 'Manage your shop',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  delivery: {
    icon: Truck,
    title: 'Delivery Partner',
    description: 'Deliver orders',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [needsRole, setNeedsRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        // Check if user has a role
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking role:', error);
          navigate('/auth');
          return;
        }

        if (!roleData) {
          // User needs to select a role
          setUserId(session.user.id);
          setNeedsRole(true);
        } else {
          // User already has a role, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    checkAuthAndRole();
  }, [navigate]);

  const handleRoleSelection = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: selectedRole });

      if (error) throw error;

      toast.success('Role selected successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error setting role:', error);
      toast.error(error.message || 'Failed to set role');
    } finally {
      setLoading(false);
    }
  };

  if (!needsRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-floating border-0">
          <CardHeader>
            <CardTitle className="text-center">Choose Your Role</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              How would you like to use LocalCart?
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {Object.entries(roleConfig).map(([role, config]) => {
                const Icon = config.icon;
                const isSelected = selectedRole === role;
                
                return (
                  <motion.button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role as UserRole)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-4 rounded-xl border-2 transition-all flex items-center gap-4
                      ${isSelected 
                        ? 'border-primary bg-primary/5 shadow-card' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${config.bgColor}`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">{config.title}</p>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <Button
              onClick={handleRoleSelection}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
