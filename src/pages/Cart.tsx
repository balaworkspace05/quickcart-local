import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';
import { mockShops } from '@/data/mockData';
import ReferralBanner from '@/components/ReferralBanner';
import SavingsBar from '@/components/SavingsBar';
import ScratchCard from '@/components/ScratchCard';
import AdBanner from '@/components/AdBanner';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import { useState } from 'react';

export default function Cart() {
  const { 
    cartItems, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart 
  } = useStore();
  
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Group items by shop
  const itemsByShop = cartItems.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = [];
    }
    acc[item.shopId].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const cartTotal = getCartTotal();
  const deliveryFee = cartTotal >= 199 ? 0 : 25;
  const discountAmount = Math.round((cartTotal * couponDiscount) / 100);
  const finalTotal = cartTotal + deliveryFee - discountAmount;

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const handleScratchReveal = (discount: number) => {
    setScratchRevealed(true);
    setCouponDiscount(discount);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Discover amazing products from local shops
          </p>
          <Button size="lg" className="bg-gradient-primary" asChild>
            <a href="/shops">
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Referral Banner */}
      <ReferralBanner 
        referralCode="SAVE100" 
        earnedAmount={250}
        className="mb-6"
      />

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="w-6 h-6" />
                  <span>Your Cart ({cartItems.length} items)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Savings Bar */}
                <SavingsBar
                  currentAmount={cartTotal}
                  targetAmount={500}
                  freeDeliveryThreshold={199}
                />

                {/* Items by Shop */}
                {Object.entries(itemsByShop).map(([shopId, items]) => {
                  const shop = mockShops.find(s => s.id === shopId);
                  
                  return (
                    <motion.div
                      key={shopId}
                      variants={itemVariants}
                      className="space-y-4"
                    >
                      {/* Shop Header */}
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl">{shop?.logo}</div>
                        <div>
                          <h3 className="font-semibold">{shop?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {shop?.deliveryTime}
                          </p>
                        </div>
                      </div>

                      {/* Shop Items */}
                      <div className="space-y-3">
                        {items.map((item) => (
                          <motion.div
                            key={item.product.id}
                            layout
                            className="flex items-center space-x-4 p-3 bg-gradient-card rounded-lg border"
                          >
                            {/* Product Image */}
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                              {item.product.image}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm">
                                {item.product.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ₹{item.product.price} {item.product.unit}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => updateCartQuantity(
                                  item.product.id, 
                                  item.quantity - 1
                                )}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => updateCartQuantity(
                                  item.product.id, 
                                  item.quantity + 1
                                )}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Price & Remove */}
                            <div className="text-right">
                              <p className="font-semibold">
                                ₹{item.product.price * item.quantity}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive h-6 px-1"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <Separator />
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Scratch Card */}
          {!scratchRevealed && (
            <motion.div variants={itemVariants}>
              <GlassmorphicCard className="p-6 text-center">
                <h3 className="font-semibold mb-4">🎉 Lucky Coupon!</h3>
                <ScratchCard
                  discount={15}
                  onReveal={handleScratchReveal}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Scratch to reveal your discount
                </p>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* Order Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Coupon Discount ({couponDiscount}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-success line-through' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>

                <Button 
                  className="w-full bg-gradient-primary text-lg py-6"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ad Banner */}
          <motion.div variants={itemVariants}>
            <AdBanner
              title="LocalCart Prime"
              description="Get free delivery on all orders + exclusive rewards"
              ctaText="Upgrade Now"
              ctaUrl="/prime"
              variant="card"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}