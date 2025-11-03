import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, User, Mail, Lock, Phone, MapPin, Loader2, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';

type AuthMode = 'login' | 'signup';
type UserRole = 'customer' | 'vendor';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().min(5, 'Address is required'),
});

const vendorSchema = z.object({
  shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  shopAddress: z.string().min(5, 'Shop address is required'),
});

export default function AuthNew() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [gpayQrFile, setGpayQrFile] = useState<File | null>(null);
  const [gpayQrPreview, setGpayQrPreview] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    shopName: '',
    ownerName: '',
    phone: '',
    address: '',
    shopAddress: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && userRole) {
      // Redirect based on role
      switch (userRole) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'shopkeeper':
          navigate('/vendor/dashboard');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'delivery':
          navigate('/delivery-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, userRole, navigate]);

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      toast.success('Account verified successfully! Please log in to continue.');
      navigate('/auth', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleGpayQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setGpayQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGpayQrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadGpayQr = async (userId: string): Promise<string | null> => {
    if (!gpayQrFile) return null;

    try {
      const fileExt = gpayQrFile.name.split('.').pop();
      const fileName = `${userId}/gpay-qr.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vendor-gpay')
        .upload(fileName, gpayQrFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vendor-gpay')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading GPay QR:', error);
      toast.error('Failed to upload GPay QR code');
      return null;
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
            ownerName: formData.ownerName,
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

    if (role === 'vendor' && !gpayQrFile) {
      toast.error('Please upload your Google Pay QR code');
      return;
    }

    setLoading(true);

    try {
      const metadata = {
        name: role === 'customer' ? formData.name : formData.ownerName,
        phone: formData.phone,
        address: role === 'customer' ? formData.address : formData.shopAddress,
        role: role === 'vendor' ? 'shopkeeper' : role,
        ...(role === 'vendor' && {
          shop_name: formData.shopName,
          owner_name: formData.ownerName,
        }),
      };

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: metadata,
        },
      });

      if (error) throw error;

      if (data.user && role === 'vendor') {
        // Get the profile we just created
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        if (newProfile) {
          // Upload GPay QR and create shop
          const gpayQrUrl = await uploadGpayQr(data.user.id);

          const { error: vendorError } = await supabase
            .from('vendors')
            .insert({
              user_id: newProfile.id,
              shop_name: formData.shopName,
              owner_name: formData.ownerName,
              email: formData.email,
              address: formData.shopAddress,
              phone: formData.phone,
              gpay_qr_url: gpayQrUrl,
            });

          if (vendorError) {
            console.error('Error creating vendor:', vendorError);
            toast.warning('Account created but shop setup incomplete. Please complete your profile.');
          }
        }
      }

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
        // Get profile and role from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (profileData) {
          switch (profileData.role) {
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
          navigate('/auth/callback');
        }
        toast.success('Login successful!');
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-primary/20">
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
                    <>
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
                      <div>
                        <Label htmlFor="ownerName">Owner Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="ownerName"
                            placeholder="John Doe"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                        {errors.ownerName && <p className="text-sm text-destructive mt-1">{errors.ownerName}</p>}
                      </div>
                    </>
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
                  </div>

                  {role === 'vendor' && (
                    <div>
                      <Label htmlFor="gpayQr">Google Pay QR Code *</Label>
                      <div className="mt-2">
                        <label
                          htmlFor="gpayQr"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          {gpayQrPreview ? (
                            <img
                              src={gpayQrPreview}
                              alt="GPay QR Preview"
                              className="h-28 object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Upload QR Code (Max 5MB)</p>
                            </div>
                          )}
                          <input
                            id="gpayQr"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleGpayQrChange}
                          />
                        </label>
                      </div>
                    </div>
                  )}
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
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
