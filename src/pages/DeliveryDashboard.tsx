import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign,
  Navigation,
  Phone,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { mockOrders } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function DeliveryDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Mock delivery orders
  const deliveryOrders = [
    {
      ...mockOrders[0],
      pickupLocation: 'Fresh Mart Grocery, Sector 12',
      dropLocation: '123 Main St, Sector 15',
      distance: 2.5,
      earnings: 35,
      estimatedTime: '15 min'
    }
  ];

  const stats = {
    todayEarnings: 420,
    completedDeliveries: 8,
    avgRating: 4.7,
    totalDistance: 45.2
  };

  const earnings = [
    { day: 'Mon', amount: 380 },
    { day: 'Tue', amount: 420 },
    { day: 'Wed', amount: 350 },
    { day: 'Thu', amount: 480 },
    { day: 'Fri', amount: 520 },
    { day: 'Sat', amount: 610 },
    { day: 'Sun', amount: 420 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Delivery Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your deliveries and track earnings
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Badge className="bg-green-100 text-green-800">
                Online & Available
              </Badge>
            </div>
          </div>
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
                  <p className="text-sm font-medium text-muted-foreground">Today's Earnings</p>
                  <p className="text-2xl font-bold">₹{stats.todayEarnings}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+15% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deliveries</p>
                  <p className="text-2xl font-bold">{stats.completedDeliveries}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-muted-foreground">Completed today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">{stats.avgRating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-muted-foreground">From 127 ratings</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Distance</p>
                  <p className="text-2xl font-bold">{stats.totalDistance} km</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-muted-foreground">Traveled today</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assigned Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>Assigned Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Order #{order.id}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{order.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{order.earnings}</p>
                          <p className="text-sm text-muted-foreground">{order.distance} km</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-sm">Pickup</p>
                            <p className="text-sm text-muted-foreground">{order.pickupLocation}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-sm">Drop-off</p>
                            <p className="text-sm text-muted-foreground">{order.dropLocation}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-gradient-primary hover:bg-primary-hover text-primary-foreground">
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {deliveryOrders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Truck className="w-12 h-12 mx-auto mb-4" />
                      <p>No orders assigned yet.</p>
                      <p className="text-sm">New orders will appear here automatically.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Earnings & Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Weekly Earnings */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Weekly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{day.day}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-primary rounded-full"
                            style={{ width: `${(day.amount / 700) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">₹{day.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Weekly Total</span>
                    <span className="font-bold text-lg">₹{earnings.reduce((sum, day) => sum + day.amount, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Update Location
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Set Availability
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Earnings Report
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Rate Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Route Optimization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span>Route Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6 text-center">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Smart Route Planning</h3>
                <p className="text-muted-foreground mb-4">
                  AI-powered route optimization will be available soon to help you deliver faster and earn more.
                </p>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}