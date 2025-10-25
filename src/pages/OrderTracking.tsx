import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import OrderCard from '@/components/OrderCard';
import { motion } from 'framer-motion';

export default function OrderTracking() {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Use only store orders
  const allOrders = orders;
  
  // Filter orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
  
  // Order status counts
  const statusCounts = {
    all: allOrders.length,
    confirmed: allOrders.filter(o => o.status === 'confirmed').length,
    packed: allOrders.filter(o => o.status === 'packed').length,
    'out-for-delivery': allOrders.filter(o => o.status === 'out-for-delivery').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
  };

  const statusConfig = {
    confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle },
    packed: { label: 'Packed', color: 'bg-yellow-500', icon: Package },
    'out-for-delivery': { label: 'Out for Delivery', color: 'bg-orange-500', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle }
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
          <h1 className="text-3xl font-bold mb-2">Track Your Orders</h1>
          <p className="text-muted-foreground">
            Monitor your order status and delivery progress
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg p-6 shadow-card mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by order ID or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('all')}
            className="flex items-center space-x-2"
          >
            <span>All Orders</span>
            <Badge variant="secondary" className="ml-1">
              {statusCounts.all}
            </Badge>
          </Button>
          
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {statusCounts[status as keyof typeof statusCounts]}
                </Badge>
              </Button>
            );
          })}
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : "You haven't placed any orders yet."}
            </p>
            {!searchTerm && selectedStatus === 'all' ? (
              <Button onClick={() => window.location.href = '/shops'}>
                Start Shopping
              </Button>
            ) : (
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
              }}>
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}

        {/* Live Tracking Demo */}
        {filteredOrders.some(o => o.status === 'out-for-delivery') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="bg-gradient-card border-0 shadow-floating">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold">Live Tracking Available</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Rajesh (Delivery Partner)</p>
                        <p className="text-sm text-muted-foreground">Order #ORD001</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Current Location</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      Sector 14, Near Metro Station - 2 min away
                    </p>
                    
                    <div className="mt-3 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Arriving in 3-5 minutes
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}