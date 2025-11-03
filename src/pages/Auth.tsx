import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, User, Mail, Lock, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

type AuthMode = 'login' | 'signup';
type UserRole = 'customer' | 'vendor';

const ADMIN_USERNAME = 'Localcart-own';
const ADMIN_PASSWORD = '12345695';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().min(5, 'Address is required'),
});

const vendorSchema = z.object({
  shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  shopAddress: z.string().min(5, 'Shop address is required'),
});

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    shopName: '',
    phone: '',
    address: '',
    shopAddress: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      toast.success('Account verified successfully! Please log in to continue.');
      navigate('/auth', { replace: true });
    }
  }, [searchParams, navigate]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast.success(`Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          sessionStorage.setItem('location', JSON.stringify({ lat: latitude, lng: longitude }));
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const validateForm = () => {
    try {
      if (mode === 'signup') {
        if (role === 'customer') {
          customerSchema.parse({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            address: formData.address,
          });
        } else {
          vendorSchema.parse({
            shopName: formData.shopName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            shopAddress: formData.shopAddress,
          });
        }
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const location = sessionStorage.getItem('location');
      const locationData = location ? JSON.parse(location) : null;

      const metadata = {
        name: role === 'customer' ? formData.name : formData.shopName,
        phone: formData.phone,
        address: role === 'customer' ? formData.address : formData.shopAddress,
        role: role === 'vendor' ? 'shopkeeper' : role,
        ...(locationData && {
          location_lat: locationData.lat,
          location_lng: locationData.lng,
        }),
      };

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
          data: metadata,
        },
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // SECURITY NOTE: Check for admin role in database after authentication
      // Static credentials should be stored securely and verified server-side

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email before logging in.');
        } else {
          toast.error(error.message);
        }
        throw error;
      }

      if (data.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roleData) {
          toast.success('Login successful!');
          switch (roleData.role) {
            case 'customer':
              navigate('/customer/dashboard');
              break;
            case 'shopkeeper':
              navigate('/vendor/dashboard');
              break;
            case 'delivery':
              navigate('/delivery-dashboard');
              break;
            case 'admin':
              navigate('/admin');
              break;
            default:
              navigate('/customer/dashboard');
          }
        } else {
          toast.error('No role assigned. Please contact support.');
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      // Error already handled
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-md w-full"
        >
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-primary/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-center mb-4">Check Your Email</h2>
            <p className="text-center text-muted-foreground mb-6">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Click the link in the email to verify your account and complete registration.
            </p>
            
            <Button
              onClick={() => {
                setEmailSent(false);
                setMode('login');
              }}
              variant="outline"
              className="w-full mt-6"
            >
              Back to Login
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-primary/20">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-8 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-md transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                key="role-selector"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Label className="mb-3 block">I am a:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole('customer')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === 'customer'
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Customer</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole('vendor')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === 'vendor'
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Store className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Vendor</div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key={`signup-${role}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {role === 'customer' ? (
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                      {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="shopName">Shop Name</Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="shopName"
                          placeholder="My Shop"
                          value={formData.shopName}
                          onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                      {errors.shopName && <p className="text-sm text-destructive mt-1">{errors.shopName}</p>}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="address">{role === 'customer' ? 'Address' : 'Shop Address'}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="Enter address"
                        value={role === 'customer' ? formData.address : formData.shopAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [role === 'customer' ? 'address' : 'shopAddress']: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                    {(errors.address || errors.shopAddress) && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.address || errors.shopAddress}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={getCurrentLocation}
                      className="mt-2 text-xs"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Use Current Location
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                />
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Admin? Use username: <strong>Localcart-own</strong>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
