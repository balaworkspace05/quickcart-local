import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Store } from 'lucide-react';
import { Shop } from '@/hooks/useShops';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
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
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl overflow-hidden">
                {shop.logo_url ? (
                  <img src={shop.logo_url} alt={shop.shop_name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{shop.shop_name}</h3>
                <p className="text-xs text-muted-foreground">{shop.owner_name}</p>
              </div>
            </div>
            
            <Badge variant="default" className="text-xs">
              Open
            </Badge>
          </div>
          
          {/* Shop Info */}
          <div className="space-y-2 mb-3">
            {shop.address && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{shop.address}</span>
              </div>
            )}
            {shop.phone && (
              <div className="text-sm text-muted-foreground">
                📞 {shop.phone}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 px-4 pb-4">
          <Link to={`/shop/${shop.id}`} className="w-full">
            <Button className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground">
              Browse Products
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
