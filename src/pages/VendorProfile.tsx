import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Mail, Phone, MapPin, Calendar, Edit2, Save, QrCode, Upload, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';
import VendorLayout from '@/components/VendorLayout';

export default function VendorProfile() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [gpayQrFile, setGpayQrFile] = useState<File | null>(null);
  const [gpayQrPreview, setGpayQrPreview] = useState<string>('');
  const { uploadImage, uploading } = useImageUpload('shop-images');

  useEffect(() => {
    if (!user || userRole !== 'shopkeeper') {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, userRole, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
      });

      // Fetch shop data
      const { data: shopData, error: shopError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (shopError && shopError.code !== 'PGRST116') throw shopError;
      setShop(shopData);
      
      // Get GPay QR from profile, not shop
      if (data?.gpay_qr_url) {
        setGpayQrPreview(data.gpay_qr_url);
      }
    } catch (error: any) {
      toast.error('Failed to load profile');
    }
  };

  const handleGpayQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
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

  const handleSave = async () => {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Upload GPay QR if changed - save to profile
      if (gpayQrFile) {
        const uploadedUrl = await uploadImage(gpayQrFile);
        if (!uploadedUrl) {
          toast.error('Failed to upload GPay QR');
          return;
        }

        const { error: qrError } = await supabase
          .from('profiles')
          .update({ gpay_qr_url: uploadedUrl })
          .eq('id', user?.id);

        if (qrError) throw qrError;
      }

      toast.success('✅ Profile updated successfully');
      setIsEditing(false);
      setGpayQrFile(null);
      fetchProfile();
    } catch (error: any) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <VendorLayout shopName={shop?.name} shopLogo={shop?.logo_url}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendor Profile</h1>
            <p className="text-muted-foreground">Manage your shop information and payment details</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/vendor/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Shop Information</h2>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              variant={isEditing ? 'default' : 'outline'}
              disabled={uploading}
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
              {isEditing ? (uploading ? 'Uploading...' : 'Save Changes') : 'Edit Profile'}
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
              <Store className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label>Shop Name</Label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-lg font-medium">{profile?.name || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
              <Mail className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label>Email</Label>
                <p className="text-lg font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
              <Phone className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-lg font-medium">{profile?.phone || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label>Shop Address</Label>
                {isEditing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                ) : (
                  <p className="text-lg font-medium">{profile?.address || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Google Pay QR Section */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Google Pay QR Code</Label>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your Google Pay QR code. This will be shown to customers during checkout.
              </p>
              
              {gpayQrPreview && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={gpayQrPreview}
                    alt="GPay QR Preview"
                    className="w-48 h-48 rounded-lg border-2 border-primary/20 object-cover"
                  />
                </div>
              )}

              {isEditing && (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleGpayQrChange}
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
              )}

              {!gpayQrPreview && !isEditing && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No GPay QR uploaded yet. Click "Edit Profile" to add one.
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label>Member Since</Label>
                <p className="text-lg font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Store className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <Label>Account Type</Label>
                <p className="text-lg font-medium capitalize">Vendor</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </VendorLayout>
  );
}
