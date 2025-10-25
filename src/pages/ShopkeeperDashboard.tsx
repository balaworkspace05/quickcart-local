import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  TrendingUp, 
  Users, 
  Clock,
  Plus,
  Edit,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import OrderCard from '@/components/OrderCard';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ShopkeeperDashboard() {
  const { updateOrderStatus, orders } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Mock data for analytics
  const salesData = [
    { name: 'Mon', sales: 1200 },
    { name: 'Tue', sales: 1900 },
    { name: 'Wed', sales: 1500 },
    { name: 'Thu', sales: 2100 },
    { name: 'Fri', sales: 2400 },
    { name: 'Sat', sales: 2800 },
    { name: 'Sun', sales: 2200 },
  ];

  const topProducts = [
    { name: 'Fresh Bananas', sold: 45, revenue: 1800 },
    { name: 'Whole Wheat Bread', sold: 32, revenue: 1120 },
    { name: 'Organic Milk', sold: 28, revenue: 1400 },
    { name: 'Local Honey', sold: 15, revenue: 900 },
  ];

  // Filter orders for this shop (using store orders - in real app would filter by shop ID from Supabase)
  const shopOrders = orders.filter(order => order.shops && order.shops.length > 0);
  const pendingOrders = shopOrders.filter(order => ['confirmed', 'packed'].includes(order.status));
  
  const stats = {
    todayOrders: 12,
    todayRevenue: 3240,
    avgRating: 4.5,
    totalCustomers: 156
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Fresh Mart Grocery Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your shop, track orders, and analyze performance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Orders</p>
                  <p className="text-2xl font-bold">{stats.todayOrders}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+12% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.todayRevenue}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+8% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{stats.avgRating}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-warning" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-muted-foreground">Based on 45 reviews</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-info" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+5 new this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Pending Orders ({pendingOrders.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingOrders.length > 0 ? (
                    <div className="space-y-4">
                      {pendingOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          showControls
                          onStatusUpdate={updateOrderStatus}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p>All caught up! No pending orders.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Inventory Management</CardTitle>
                    <Button className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      No products available. Go to Inventory to add products.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Weekly Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sold" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Feedback */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Recent Customer Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { customer: 'Priya S.', rating: 5, comment: 'Fresh vegetables and quick delivery!', time: '2 hours ago' },
                      { customer: 'Rajesh K.', rating: 4, comment: 'Good quality products, will order again.', time: '5 hours ago' },
                      { customer: 'Anjali P.', rating: 5, comment: 'Excellent service and support for local business!', time: '1 day ago' },
                    ].map((feedback, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-accent rounded-lg">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {feedback.customer.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{feedback.customer}</p>
                            <span className="text-sm text-muted-foreground">{feedback.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            {[...Array(feedback.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current text-warning" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}