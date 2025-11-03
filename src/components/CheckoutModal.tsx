import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/hooks/useProducts';
import { Shop } from '@/hooks/useShops';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Minus, Plus, QrCode, Store, MapPin, Package } from 'lucide-react';

// Component to fetch and display GPay QR from vendor's profile
function GPayQRSection({ shopOwnerId }: { shopOwnerId: string }) {
  const [gpayQrUrl, setGpayQrUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchGPayQR = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('gpay_qr_url')
        .eq('id', shopOwnerId)
        .maybeSingle();

      if (!error && data?.gpay_qr_url) {
        setGpayQrUrl(data.gpay_qr_url);
      }
    };
    fetchGPayQR();
  }, [shopOwnerId]);

  if (!gpayQrUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-primary" />
        <h4 className="font-semibold">Scan & Pay using Google Pay</h4>
      </div>
      <div className="flex justify-center">
        <img
          src={gpayQrUrl}
          alt="Google Pay QR"
          className="w-48 h-48 rounded-lg shadow-lg"
        />
      </div>
      <p className="text-sm text-muted-foreground text-center mt-4">
        Scan this QR code with your Google Pay app to complete payment
      </p>
    </motion.div>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  shop: Shop | null;
}

export default function CheckoutModal({ isOpen, onClose, product, shop }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  if (!product || !shop) return null;

  const originalPrice = product.price * quantity;
  const totalPrice = originalPrice - discount;
  const maxQuantity = product.stock;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
      // Recalculate discount if coupon applied
      if (couponApplied && couponCode) {
        handleApplyCoupon();
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const { data, error } = await (supabase.rpc as any)('apply_coupon_discount', {
        coupon_code_param: couponCode.toUpperCase(),
        order_amount: originalPrice,
      });

      if (error) throw error;

      const result = data[0];
      if (result.valid) {
        setDiscount(result.discount_amount);
        setCouponApplied(true);
        toast.success(`Coupon applied! You saved ₹${result.discount_amount}`);
      } else {
        toast.error(result.message);
        setDiscount(0);
        setCouponApplied(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply coupon');
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to place order');
        return;
      }

      // Create order with coupon tracking
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          original_amount: originalPrice,
          discount_amount: discount,
          coupon_code: couponApplied ? couponCode.toUpperCase() : null,
          delivery_address: deliveryAddress.trim(),
          delivery_instructions: deliveryInstructions.trim() || null,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: product.id,
          shop_id: shop.id,
          quantity,
          price: product.price
        });

      if (itemError) throw itemError;

      // Update product stock
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: product.stock - quantity })
        .eq('id', product.id);

      if (stockError) throw stockError;

      toast.success('🎉 Order placed successfully!');
      onClose();
      setQuantity(1);
      setDeliveryAddress('');
      setDeliveryInstructions('');
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                {product.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.original_price}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Shop Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <Store className="w-5 h-5 text-secondary" />
              <h4 className="font-semibold">{shop.name}</h4>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{shop.location}</span>
            </div>
          </motion.div>

          {/* Quantity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label>Quantity</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                ({maxQuantity} available)
              </span>
            </div>
          </motion.div>

          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label>Delivery Address *</Label>
            <Textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your complete delivery address"
              rows={3}
              required
            />
          </motion.div>

          {/* Delivery Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label>Delivery Instructions (Optional)</Label>
            <Textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="Any special instructions for delivery"
              rows={2}
            />
          </motion.div>

          {/* Coupon Code */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="space-y-2"
          >
            <Label>Coupon Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="LOCAL-CART01"
                disabled={couponApplied}
                className="uppercase"
              />
              <Button
                type="button"
                variant={couponApplied ? "secondary" : "outline"}
                onClick={handleApplyCoupon}
                disabled={couponApplied || !couponCode.trim()}
              >
                {couponApplied ? 'Applied ✓' : 'Apply'}
              </Button>
            </div>
            {couponApplied && (
              <p className="text-sm text-green-600 font-medium">
                🎉 Coupon applied! You saved ₹{discount.toFixed(2)}
              </p>
            )}
          </motion.div>

          {/* Google Pay QR - Now fetched from vendor profile */}
          <GPayQRSection shopOwnerId={shop.owner_id} />

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
          >
            {discount > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="line-through">₹{originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">₹{totalPrice.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4"
          >
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isSubmitting || !deliveryAddress.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
