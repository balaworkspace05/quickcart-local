import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useStore } from '@/store/useStore';
import ConfettiButton from '@/components/ConfettiButton';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems, updateCartQuantity } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  // Find current quantity in cart
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;
  
  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setQuantity(1);
    
    // Reset animation state after delay
    setTimeout(() => setIsAdding(false), 300);
  };
  
  const updateCart = (newQuantity: number) => {
    if (newQuantity <= 0) {
      updateCartQuantity(product.id, 0);
    } else {
      updateCartQuantity(product.id, newQuantity);
    }
  };

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <GlassmorphicCard 
        className="h-full p-4 card-tilt"
        intensity="medium"
        glow={cartQuantity > 0}
        hover
      >
        {/* Product Image & Badges */}
        <div className="relative mb-4">
          <motion.div 
            className="w-full h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl flex items-center justify-center text-4xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.span
                className="text-5xl filter drop-shadow-lg"
                animate={{ 
                  rotate: isAdding ? [0, -10, 10, -5, 5, 0] : 0,
                  scale: isAdding ? [1, 1.2, 1] : 1 
                }}
                transition={{ duration: 0.5 }}
              >
                📦
              </motion.span>
            )}
          </motion.div>
          
          <AnimatePresence>
            {discountPercentage > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                exit={{ scale: 0, rotate: -12 }}
                className="absolute -top-2 -right-2"
              >
                <Badge className="bg-gradient-secondary text-secondary-foreground shadow-lg animate-pulse-glow">
                  {discountPercentage}% OFF
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {product.stock <= 5 && product.stock > 0 && (
              <motion.div
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: -10 }}
                className="absolute -top-2 -left-2"
              >
                <Badge className="bg-warning text-warning-foreground shadow-lg">
                  Low Stock
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 space-y-3">
          <motion.h3 
            className="font-semibold text-sm leading-tight"
            whileHover={{ scale: 1.02 }}
          >
            {product.name}
          </motion.h3>
          <p className="text-xs text-muted-foreground">{product.unit}</p>
          
          {/* Price with Animation */}
          <div className="flex items-center gap-2">
            <motion.span 
              className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent"
              animate={{ scale: isAdding ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              ₹{product.price}
            </motion.span>
            {product.original_price && (
              <motion.span 
                className="text-sm text-muted-foreground line-through"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ₹{product.original_price}
              </motion.span>
            )}
          </div>
          
          {/* Stock Status */}
          <AnimatePresence mode="wait">
            {product.stock === 0 ? (
              <motion.div
                key="out-of-stock"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              </motion.div>
            ) : (
              <motion.div
                key="in-stock"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Badge variant="secondary" className="text-xs glass-card">
                  {product.stock} in stock
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Add to Cart Section */}
        <div className="mt-4 space-y-3">
          <AnimatePresence mode="wait">
            {cartQuantity > 0 ? (
              /* Already in cart - show quantity controls */
              <motion.div
                key="in-cart"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between glass-card p-3 rounded-xl glow-primary"
              >
                <motion.button
                  onClick={() => updateCart(cartQuantity - 1)}
                  className="w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-3 h-3" />
                </motion.button>
                
                <motion.span 
                  className="font-bold text-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                  key={cartQuantity}
                >
                  {cartQuantity}
                </motion.span>
                
                <motion.button
                  onClick={() => updateCart(cartQuantity + 1)}
                  disabled={cartQuantity >= product.stock}
                  className="w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  whileHover={{ scale: cartQuantity < product.stock ? 1.1 : 1 }}
                  whileTap={{ scale: cartQuantity < product.stock ? 0.9 : 1 }}
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ) : (
              /* Not in cart - show add controls */
              <motion.div
                key="not-in-cart"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {product.stock > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between glass-card p-2 rounded-lg">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-3 h-3" />
                      </motion.button>
                      
                      <motion.span 
                        className="px-4 text-sm font-medium"
                        key={quantity}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.2 }}
                      >
                        {quantity}
                      </motion.span>
                      
                      <motion.button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-3 h-3" />
                      </motion.button>
                    </div>
                    
                    <ConfettiButton
                      onClick={handleAddToCart}
                      className="w-full bg-gradient-primary hover:shadow-lg transition-all btn-premium"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </ConfettiButton>
                  </div>
                )}
                
                {product.stock === 0 && (
                  <Button disabled className="w-full opacity-50">
                    Out of Stock
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}