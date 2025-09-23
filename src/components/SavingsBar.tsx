import { motion } from 'framer-motion';
import { TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsBarProps {
  currentAmount: number;
  targetAmount: number;
  freeDeliveryThreshold: number;
  className?: string;
}

export default function SavingsBar({ 
  currentAmount, 
  targetAmount, 
  freeDeliveryThreshold,
  className 
}: SavingsBarProps) {
  const progress = Math.min((currentAmount / freeDeliveryThreshold) * 100, 100);
  const remaining = Math.max(freeDeliveryThreshold - currentAmount, 0);
  const isEligible = currentAmount >= freeDeliveryThreshold;

  const barVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progress}%`,
      transition: {
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: 0.5
      }
    }
  };

  const celebrationVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 0.6,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-gradient-card rounded-xl p-4 border border-primary/20",
        isEligible && "border-success/30 bg-success/5",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
          >
            {isEligible ? (
              <motion.div variants={celebrationVariants} animate="animate">
                <Target className="w-5 h-5 text-success" />
              </motion.div>
            ) : (
              <TrendingUp className="w-5 h-5 text-primary" />
            )}
          </motion.div>
          
          <span className="font-semibold text-sm">
            {isEligible ? (
              <span className="text-success">🎉 Free Delivery Unlocked!</span>
            ) : (
              `Add ₹${remaining} more for FREE delivery`
            )}
          </span>
        </div>
        
        <span className="text-sm font-medium text-muted-foreground">
          ₹{currentAmount}/₹{freeDeliveryThreshold}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-muted rounded-full h-3">
          <motion.div
            className={cn(
              "h-3 rounded-full bg-gradient-to-r transition-colors duration-500",
              isEligible 
                ? "from-success to-success/80" 
                : "from-primary to-primary/80"
            )}
            variants={barVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        
        {/* Progress indicator */}
        <motion.div
          className={cn(
            "absolute top-0 w-3 h-3 rounded-full border-2 border-white transition-colors duration-500",
            isEligible ? "bg-success" : "bg-primary"
          )}
          style={{ left: `calc(${Math.min(progress, 95)}% - 6px)` }}
          animate={{
            scale: [1, 1.2, 1],
            transition: { duration: 2, repeat: Infinity }
          }}
        />
      </div>

      {/* Savings message */}
      {currentAmount > 0 && !isEligible && (
        <motion.p
          className="text-xs text-muted-foreground mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          💡 You'll save ₹25 on delivery fees!
        </motion.p>
      )}
    </motion.div>
  );
}