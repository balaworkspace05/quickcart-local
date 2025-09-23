import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, Package, Truck, CheckCircle } from 'lucide-react';
import { Order } from '@/data/mockData';
import { motion } from 'framer-motion';

interface OrderCardProps {
  order: Order;
  showControls?: boolean;
  onStatusUpdate?: (orderId: string, status: Order['status']) => void;
}

export default function OrderCard({ order, showControls = false, onStatusUpdate }: OrderCardProps) {
  const statusConfig = {
    'confirmed': { 
      icon: CheckCircle, 
      color: 'bg-blue-500', 
      progress: 25, 
      label: 'Confirmed',
      description: 'Order received and confirmed'
    },
    'packed': { 
      icon: Package, 
      color: 'bg-yellow-500', 
      progress: 50, 
      label: 'Packed',
      description: 'Order packed and ready for pickup'
    },
    'out-for-delivery': { 
      icon: Truck, 
      color: 'bg-orange-500', 
      progress: 75, 
      label: 'Out for Delivery',
      description: 'Order is on the way to you'
    },
    'delivered': { 
      icon: CheckCircle, 
      color: 'bg-green-500', 
      progress: 100, 
      label: 'Delivered',
      description: 'Order successfully delivered'
    }
  };

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;
  const orderTime = new Date(order.orderTime).toLocaleString();
  const estimatedDelivery = new Date(order.estimatedDelivery).toLocaleString();

  const nextStatus = {
    'confirmed': 'packed',
    'packed': 'out-for-delivery',
    'out-for-delivery': 'delivered'
  }[order.status] as Order['status'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="bg-gradient-card border-0 shadow-card hover:shadow-floating transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                <Clock className="w-4 h-4" />
                <span>{orderTime}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary">₹{order.totalAmount}</div>
              <Badge className={`${currentStatus.color} text-white`}>
                {currentStatus.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={currentStatus.progress} className="h-2" />
            <div className="flex items-center space-x-2 text-sm">
              <StatusIcon className={`w-4 h-4 ${currentStatus.color.replace('bg-', 'text-')}`} />
              <span className="font-medium">{currentStatus.description}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Items ({order.items.length}):</h4>
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-sm text-muted-foreground">
                  +{order.items.length - 2} more items
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Delivering to:</span>
            </div>
            <p className="text-sm pl-6">{order.deliveryAddress}</p>
            
            {order.status !== 'delivered' && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground pl-6">
                <Clock className="w-4 h-4" />
                <span>Est. delivery: {estimatedDelivery}</span>
              </div>
            )}
          </div>

          {/* Shop Controls (for shopkeepers) */}
          {showControls && nextStatus && onStatusUpdate && (
            <div className="pt-2 border-t border-border">
              <Button
                onClick={() => onStatusUpdate(order.id, nextStatus)}
                className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
              >
                Mark as {statusConfig[nextStatus].label}
              </Button>
            </div>
          )}

          {/* Customer Actions */}
          {!showControls && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {order.status === 'delivered' && (
                <Button variant="outline" className="flex-1">
                  Rate Order
                </Button>
              )}
              <Button variant="outline" className="flex-1">
                Track Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
