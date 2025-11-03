import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Store, Package, TrendingUp, Trash2, Eye, Send, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import AnimatedCounter from '@/components/AnimatedCounter';

interface User {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  email?: string;
}

interface Vendor {
  id: string;
  shop_name: string;
  user_id: string;
  owner_name: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<User[]>([]);
  const [vendorShops, setVendorShops] = useState<Vendor[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [noteMessage, setNoteMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // SECURITY: Proper role-based access control
    if (!user || userRole !== 'admin') {
      navigate('/auth');
      return;
    }
    
    fetchAllData();
  }, [user, userRole, navigate]);

  const fetchAllData = async () => {
    try {
      // Fetch all users with their roles from profiles
      const { data: profilesData } = await supabase.from('profiles').select('*');
      
      if (!profilesData) {
        throw new Error('Failed to fetch data');
      }
      
      // Separate customers and vendors based on profile role
      const customers = profilesData.filter(p => p.role === 'customer');
      const vendors = profilesData.filter(p => p.role === 'vendor' || p.role === 'shopkeeper');
      
      // Enrich profiles with email (email is already in profiles table)
      const enrichedProfiles: User[] = profilesData.map(profile => ({
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        created_at: profile.created_at,
        email: 'Email not available' // Email from auth context would need separate fetch
      }));
      
      setCustomers(enrichedProfiles.filter(p => customers.map(c => c.id).includes(p.id)));
      setVendors(enrichedProfiles.filter(p => vendors.map(v => v.id).includes(p.id)));

      // Fetch vendor shops
      const { data: vendorsData } = await supabase.from('vendors').select('*');
      if (vendorsData) {
        setVendorShops(vendorsData);
      }

      // Fetch orders
      const { data: ordersData } = await supabase.from('orders').select('*');
      setOrders(ordersData || []);

    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      
      toast.success('User deleted successfully');
      fetchAllData();
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  const handleSendNote = async () => {
    if (!selectedUser || !noteMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          receiver_id: selectedUser,
          message: noteMessage,
          sender_role: 'Admin',
        });

      if (error) throw error;

      toast.success('Note sent successfully');
      setNoteMessage('');
      setSelectedUser(null);
    } catch (error: any) {
      toast.error('Failed to send note');
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

  const stats = [
    { icon: Users, label: 'Total Users', value: customers.length + vendors.length, color: 'text-primary' },
    { icon: Store, label: 'Total Shops', value: vendorShops.length, color: 'text-secondary' },
    { icon: Package, label: 'Total Orders', value: orders.length, color: 'text-accent' },
    { icon: TrendingUp, label: 'Revenue', value: `₹${totalRevenue.toFixed(2)}`, color: 'text-primary' },
  ];

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = vendors.filter(v => 
    v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-8"
        >
          Admin Dashboard
        </motion.h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-3xl font-bold">
                    {typeof stat.value === 'number' ? (
                      <AnimatedCounter to={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </span>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Customers ({filteredCustomers.length})</h2>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/user/${customer.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedUser(customer.id)}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Note to {customer.name}</DialogTitle>
                          </DialogHeader>
                          <Textarea
                            placeholder="Enter your message..."
                            value={noteMessage}
                            onChange={(e) => setNoteMessage(e.target.value)}
                            className="min-h-[120px]"
                          />
                          <Button onClick={handleSendNote} className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Send Note
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(customer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>

        {/* Vendors Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Vendors ({filteredVendors.length})</h2>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone || 'N/A'}</TableCell>
                    <TableCell>{new Date(vendor.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/user/${vendor.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedUser(vendor.id)}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Note to {vendor.name}</DialogTitle>
                          </DialogHeader>
                          <Textarea
                            placeholder="Enter your message..."
                            value={noteMessage}
                            onChange={(e) => setNoteMessage(e.target.value)}
                            className="min-h-[120px]"
                          />
                          <Button onClick={handleSendNote} className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Send Note
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(vendor.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
