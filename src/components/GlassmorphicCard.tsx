import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';

interface GlassmorphicCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
  glow?: boolean;
  tilt?: boolean;
  hover?: boolean;
}

const GlassmorphicCard = forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({ children, className, intensity = 'medium', glow = false, tilt = false, hover = true, ...props }, ref) => {
    const intensityClasses = {
      light: 'glass-card backdrop-blur-sm',
      medium: 'glass-card backdrop-blur-md',
      strong: 'glass-card backdrop-blur-lg',
    };

    const cardVariants = {
      initial: { 
        opacity: 0, 
        y: 20, 
        scale: 0.95 
      },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: "spring" as const,
          stiffness: 400,
          damping: 30,
        }
      },
      hover: hover ? {
        y: -5,
        scale: 1.02,
        transition: {
          type: "spring" as const,
          stiffness: 400,
          damping: 30,
        }
      } : {},
      tap: {
        scale: 0.98,
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          intensityClasses[intensity],
          "relative rounded-2xl border border-white/20",
          "shadow-floating transition-all duration-300",
          tilt && "card-tilt",
          glow && "glow-primary",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Glow effect */}
        {glow && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20 blur-xl -z-10 animate-pulse-glow" />
        )}
      </motion.div>
    );
  }
);

GlassmorphicCard.displayName = "GlassmorphicCard";

export default GlassmorphicCard;