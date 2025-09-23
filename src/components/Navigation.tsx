import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Moon
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { currentRole, setCurrentRole, getCartItemCount, isCartOpen, setCartOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const cartCount = getCartItemCount();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const roleConfig = {
    customer: {
      icon: User,
      label: 'Customer',
      color: 'bg-primary',
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
      color: 'bg-secondary',
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

  const currentConfig = roleConfig[currentRole];
  const CurrentRoleIcon = currentConfig.icon;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
              L
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              LocalCart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentConfig.links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="hidden md:flex items-center space-x-2">
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as any)}
                className="px-3 py-1 rounded-md border bg-background text-sm"
              >
                <option value="customer">Customer</option>
                <option value="shopkeeper">Shop Owner</option>
                <option value="delivery">Delivery Partner</option>
              </select>
              <div className={`p-2 rounded-full ${currentConfig.color} text-white`}>
                <CurrentRoleIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Cart (Customer only) */}
            {currentRole === 'customer' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCartOpen(!isCartOpen)}
                className="relative hover:scale-105 transition-transform"
              >
                <ShoppingCart className={`w-5 h-5 ${cartCount > 0 ? 'animate-cart-wiggle' : ''}`} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground min-w-[20px] h-5 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-border"
            >
              <div className="pt-4 space-y-3">
                {currentConfig.links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === link.path
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Role Switcher */}
                <div className="pt-2 border-t border-border">
                  <label className="block text-sm font-medium mb-2">Switch Role:</label>
                  <select
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="customer">Customer</option>
                    <option value="shopkeeper">Shop Owner</option>
                    <option value="delivery">Delivery Partner</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}