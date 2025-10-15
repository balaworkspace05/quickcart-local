import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check, Info, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import revenueData from '@/data/revenue.json';

interface BNPLOptionProps {
  totalAmount: number;
  onSelectPayment: (method: 'now' | 'later') => void;
}

export default function BNPLOption({ totalAmount, onSelectPayment }: BNPLOptionProps) {
  const [selectedMethod, setSelectedMethod] = useState<'now' | 'later' | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { creditOptions } = revenueData;

  const isEligible = creditOptions.eligible && totalAmount >= creditOptions.minOrderForCredit;

  const handleSelect = (method: 'now' | 'later') => {
    setSelectedMethod(method);
    if (method === 'later') {
      setShowSuccessModal(true);
    }
    onSelectPayment(method);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Pay Now Option */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedMethod === 'now'
                ? 'border-2 border-primary shadow-lg'
                : 'border hover:border-primary/50'
            }`}
            onClick={() => handleSelect('now')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Pay Now</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete payment immediately
                    </p>
                  </div>
                </div>
                {selectedMethod === 'now' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pay Later Option */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
              selectedMethod === 'later'
                ? 'border-2 border-secondary shadow-lg'
                : 'border hover:border-secondary/50'
            } ${!isEligible ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => isEligible && handleSelect('later')}
          >
            {/* Animated Background */}
            {isEligible && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}

            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground">Pay Later</h4>
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                        ✨ Recommended
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay within {creditOptions.paymentDueDays} days - No interest!
                    </p>
                  </div>
                </div>
                {selectedMethod === 'later' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Eligibility Status */}
              {isEligible ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <div className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-medium text-foreground">
                        You're eligible for ₹{creditOptions.availableCredit.toLocaleString()} LocalCart Credit
                      </p>
                      <p className="text-muted-foreground mt-1">
                        0% interest • No hidden charges • Flexible payment
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 border border-muted">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Minimum order value of ₹{creditOptions.minOrderForCredit} required for Pay Later
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <DialogTitle className="text-center">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p className="text-base">
                Your order has been confirmed using LocalCart Credit.
              </p>
              <div className="p-4 rounded-lg bg-muted/50 text-left">
                <p className="text-sm font-medium text-foreground mb-2">Payment Details:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Amount: ₹{totalAmount.toFixed(2)}</li>
                  <li>• Due Date: {creditOptions.paymentDueDays} days from now</li>
                  <li>• Interest: 0% (if paid on time)</li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">
                We'll send you a reminder 2 days before the due date.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full">
            Got it!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
