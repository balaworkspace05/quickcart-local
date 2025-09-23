import { motion } from 'framer-motion';
import { Crown, Star, Zap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoyaltyBadgeProps {
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  nextLevelPoints: number;
  className?: string;
  animated?: boolean;
}

const badgeConfig = {
  bronze: {
    icon: Star,
    gradient: 'from-amber-600 to-amber-400',
    glow: 'shadow-amber-500/30',
    text: 'Bronze Member'
  },
  silver: {
    icon: Zap,
    gradient: 'from-gray-500 to-gray-300',
    glow: 'shadow-gray-500/30',
    text: 'Silver Member'
  },
  gold: {
    icon: Crown,
    gradient: 'from-yellow-500 to-yellow-300',
    glow: 'shadow-yellow-500/30',
    text: 'Gold Member'
  },
  platinum: {
    icon: Trophy,
    gradient: 'from-purple-600 to-purple-400',
    glow: 'shadow-purple-500/30',
    text: 'Platinum Elite'
  }
};

export default function LoyaltyBadge({ 
  level, 
  points, 
  nextLevelPoints, 
  className,
  animated = true 
}: LoyaltyBadgeProps) {
  const config = badgeConfig[level];
  const Icon = config.icon;
  const progress = (points / nextLevelPoints) * 100;

  const badgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      transition: { duration: 0.2 }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(255, 255, 255, 0.1)',
        '0 0 40px rgba(255, 255, 255, 0.3)',
        '0 0 20px rgba(255, 255, 255, 0.1)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "relative p-4 rounded-2xl glass-card",
        config.glow,
        className
      )}
      variants={animated ? badgeVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated ? "hover" : undefined}
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-50"
        variants={glowVariants}
        animate="animate"
      />

      <div className="relative z-10 flex items-center space-x-3">
        {/* Badge Icon */}
        <div className={cn(
          "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center",
          config.gradient
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Badge Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{config.text}</h3>
          <p className="text-sm text-muted-foreground">{points} points</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 relative">
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className={cn(
              "h-2 rounded-full bg-gradient-to-r",
              config.gradient
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {nextLevelPoints - points} points to next level
        </p>
      </div>
    </motion.div>
  );
}