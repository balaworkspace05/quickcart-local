import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems, updateCartQuantity } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  // Find current quantity in cart
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };
  
  const updateCart = (newQuantity: number) => {
    if (newQuantity <= 0) {
      updateCartQuantity(product.id, 0);
    } else {
      updateCartQuantity(product.id, newQuantity);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full bg-gradient-card border-0 shadow-card hover:shadow-floating transition-all duration-300">
        <CardContent className="p-4 flex flex-col h-full">
          {/* Product Image & Discount Badge */}
          <div className="relative mb-3">
            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center text-4xl">
              {product.image}
            </div>
            {discountPercentage > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute -top-2 -left-2 bg-warning text-warning-foreground">
                Low Stock
              </Badge>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.unit}</p>
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>
            
            {/* Stock Status */}
            {product.stock === 0 ? (
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                {product.stock} in stock
              </Badge>
            )}
          </div>
          
          {/* Add to Cart Section */}
          <div className="mt-4 space-y-2">
            {cartQuantity > 0 ? (
              /* Already in cart - show quantity controls */
              <div className="flex items-center justify-between bg-accent rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateCart(cartQuantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="font-semibold text-accent-foreground">{cartQuantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateCart(cartQuantity + 1)}
                  className="h-8 w-8 p-0"
                  disabled={cartQuantity >= product.stock}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              /* Not in cart - show add controls */
              <>
                {product.stock > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-muted rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-3 text-sm font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
                      size="sm"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                )}
                
                {product.stock === 0 && (
                  <Button disabled className="w-full" size="sm">
                    Out of Stock
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}