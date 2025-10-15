import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Store, 
  Truck, 
  User, 
  Menu, 
  X,
  Sun,
  Moon,
  Monitor,
  LogOut
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const { currentRole, setCurrentRole, getCartItemCount, isCartOpen, setCartOpen } = useStore();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = getCartItemCount();

  // Sync currentRole with userRole from auth
  useEffect(() => {
    if (userRole) {
      setCurrentRole(userRole);
    }
  }, [userRole, setCurrentRole]);

  const roleConfig = {
    customer: {
      icon: User,
      label: 'Customer',
      color: 'bg-gradient-primary',
      links: [
        { path: '/', label: 'Home' },
        { path: '/shops', label: 'Shops' },
        { path: '/orders', label: 'Orders' },
        { path: '/feedback', label: 'Feedback' }
      ]
    },
    shopkeeper: {
      icon: Store,
      label: 'Shop Owner',
      color: 'bg-gradient-secondary',
      links: [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/inventory', label: 'Inventory' },
        { path: '/analytics', label: 'Analytics' }
      ]
    },
    delivery: {
      icon: Truck,
      label: 'Delivery Partner',
      color: 'bg-info',
      links: [
        { path: '/delivery-dashboard', label: 'Dashboard' },
        { path: '/routes', label: 'Routes' },
        { path: '/earnings', label: 'Earnings' }
      ]
    }
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const currentConfig = roleConfig[currentRole];
  const CurrentRoleIcon = currentConfig.icon;
  const ThemeIcon = themeIcons[theme];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    }
  };

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { type: "spring" as const, stiffness: 400, damping: 20 }
    },
    tap: { scale: 0.95 }
  };

  const linkVariants = {
    initial: { y: 0 },
    hover: { 
      y: -2,
      transition: { type: "spring" as const, stiffness: 400, damping: 20 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.nav 
      className="sticky top-0 z-50 glass-card border-b border-white/20"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="relative"
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg glow-primary">
                L
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-50 blur-md -z-10" />
            </motion.div>
            <motion.span 
              className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              LocalCart
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentConfig.links.map((link) => (
              <motion.div key={link.path} variants={linkVariants} whileHover="hover">
                <Link
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-primary font-semibold'
                      : 'hover:text-primary'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeLink"
                      className="absolute inset-0 bg-gradient-primary/10 rounded-lg border border-primary/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Role Indicator (for authenticated users) */}
            {user && userRole && (
              <div className="hidden md:flex items-center space-x-3 glass-card px-3 py-2 rounded-xl">
                <span className="text-sm font-medium">{currentConfig.label}</span>
                <motion.div 
                  className={`p-2 rounded-lg ${currentConfig.color} text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <CurrentRoleIcon className="w-4 h-4" />
                </motion.div>
              </div>
            )}

            {/* Theme Toggle */}
            <motion.button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="hidden md:flex items-center justify-center w-10 h-10 glass-card rounded-lg hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeIcon className="w-4 h-4" />
            </motion.button>

            {/* Cart (Customer only) */}
            {user && currentRole === 'customer' && (
              <motion.button
                onClick={() => setCartOpen(!isCartOpen)}
                className="relative p-3 glass-card rounded-lg hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={cartCount > 0 ? { 
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.4)" 
                } : {}}
              >
                <motion.div
                  animate={cartCount > 0 ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Badge className="bg-gradient-secondary text-secondary-foreground min-w-[20px] h-5 flex items-center justify-center shadow-lg animate-pulse-glow">
                        {cartCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* User Menu or Sign In */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className="p-3 glass-card rounded-lg hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-5 h-5" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userRole && (
                    <DropdownMenuItem disabled className="text-xs">
                      Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/loyalty')}>
                    Rewards
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="hidden md:flex"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 glass-card rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden mt-6 pb-6 border-t border-white/20 overflow-hidden"
            >
              <div className="pt-6 space-y-4">
                {currentConfig.links.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg glass-card transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'text-primary font-semibold glow-primary'
                          : 'hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Auth Section */}
                {user ? (
                  <motion.div 
                    className="pt-4 border-t border-white/20 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {userRole && (
                      <div className="glass-card p-3 rounded-lg text-sm">
                        <span className="text-muted-foreground">Role:</span>{' '}
                        <span className="font-medium">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="pt-4 border-t border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/auth');
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}