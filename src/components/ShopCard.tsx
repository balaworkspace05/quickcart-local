import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Clock, MapPin, Star, Tag } from 'lucide-react';
import { Shop } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  const categoryColors = {
    grocery: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pharmacy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    bakery: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    electronics: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    clothing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-card border-0 shadow-card hover:shadow-floating transition-all duration-300 overflow-hidden">
        <CardContent className="p-4 pb-2">
          {/* Header with Logo and Status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl">
                {shop.logo}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{shop.name}</h3>
                <Badge className={`text-xs ${categoryColors[shop.category]}`}>
                  {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              <Badge variant={shop.isOpen ? "default" : "secondary"} className="text-xs">
                {shop.isOpen ? 'Open' : 'Closed'}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-current text-warning" />
                <span className="font-medium">{shop.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Delivery Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{shop.distance} km away</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{shop.deliveryTime}</span>
            </div>
          </div>
          
          {/* Offers */}
          {shop.offers && (
            <div className="bg-accent rounded-lg p-2 mb-3">
              <div className="flex items-center space-x-2 text-sm">
                <Tag className="w-4 h-4 text-secondary" />
                <span className="font-medium text-accent-foreground">{shop.offers}</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 px-4 pb-4">
          <Link to={`/shop/${shop.id}`} className="w-full">
            <Button 
              className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
              disabled={!shop.isOpen}
            >
              {shop.isOpen ? 'Browse Products' : 'Currently Closed'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}