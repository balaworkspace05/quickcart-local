import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
        {/* Collapsible Sidebar with Hover Expand */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            width: isSidebarExpanded ? '16rem' : '5rem'
          }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
          className="sticky top-16 h-[calc(100vh-4rem)] border-r bg-card/50 backdrop-blur-xl shadow-lg overflow-hidden group"
        >
          <nav className="p-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'hover:bg-accent/50 hover:shadow-md'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                  <AnimatePresence>
                    {isSidebarExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-primary rounded-xl -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Expand/Collapse Indicator */}
          <div className="absolute bottom-4 right-4 text-muted-foreground">
            <AnimatePresence mode="wait">
              {isSidebarExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 0.5, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 0.5, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
