import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CustomerProfile() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!user || userRole !== 'customer') {
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
    } catch (error: any) {
      toast.error('Failed to load profile');
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-8"
        >
          My Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                variant={isEditing ? 'default' : 'outline'}
              >
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                <User className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label>Full Name</Label>
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
                  <Label>Address</Label>
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

              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label>Member Since</Label>
                  <p className="text-lg font-medium">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Label>Account Type</Label>
                  <p className="text-lg font-medium capitalize">Customer</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
