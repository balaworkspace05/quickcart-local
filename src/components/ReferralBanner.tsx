import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReferralBannerProps {
  referralCode: string;
  earnedAmount?: number;
  className?: string;
}

export default function ReferralBanner({ 
  referralCode, 
  earnedAmount = 0,
  className 
}: ReferralBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const bannerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      y: -100, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const giftVariants = {
    animate: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "sticky top-0 z-40 bg-gradient-to-r from-primary to-secondary text-white py-3 px-4",
            className
          )}
          variants={bannerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div variants={giftVariants} animate="animate">
                <Gift className="w-6 h-6" />
              </motion.div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <p className="font-semibold">
                  Refer friends, earn ₹100 each! 
                  {earnedAmount > 0 && (
                    <span className="ml-2 text-primary-foreground/80">
                      You've earned ₹{earnedAmount}
                    </span>
                  )}
                </p>
                
                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                  <code className="bg-white/20 px-2 py-1 rounded text-sm font-mono">
                    {referralCode}
                  </code>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-white hover:bg-white/20 h-8 px-2"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Animated background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 -skew-x-12 animate-shimmer" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}