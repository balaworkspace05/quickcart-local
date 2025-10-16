import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  User,
  Bell,
  LogOut,
  Store,
} from 'lucide-react';

interface VendorLayoutProps {
  children: ReactNode;
  shopName?: string;
  shopLogo?: string | null;
  notificationCount?: number;
}

export default function VendorLayout({ 
  children, 
  shopName = 'Your Shop',
  shopLogo,
  notificationCount = 0 
}: VendorLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/vendor/inventory', label: 'Inventory', icon: Package },
    { path: '/vendor/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/vendor/feedback', label: 'Feedback', icon: MessageSquare },
    { path: '/vendor/work', label: 'Insights', icon: TrendingUp },
    { path: '/vendor/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {shopLogo ? (
                <img src={shopLogo} alt={shopName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                  {shopName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{shopName}</h1>
                <p className="text-sm text-muted-foreground">Vendor Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-card/30 backdrop-blur-sm"
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
