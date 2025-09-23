import { motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl: string;
  sponsored?: boolean;
  dismissible?: boolean;
  variant?: 'banner' | 'card' | 'sidebar';
  className?: string;
}

export default function AdBanner({
  title,
  description,
  imageUrl,
  ctaText,
  ctaUrl,
  sponsored = true,
  dismissible = true,
  variant = 'banner',
  className
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const bannerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      x: variant === 'sidebar' ? 300 : 0,
      y: variant === 'banner' ? -50 : 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: variant === 'card' ? 1.02 : 1,
      transition: { duration: 0.2 }
    }
  };

  const shimmerVariants = {
    animate: {
      x: [-100, 300],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  if (!isVisible) return null;

  const baseClasses = cn(
    "relative overflow-hidden rounded-xl bg-gradient-card border border-border/50",
    variant === 'banner' && "p-4",
    variant === 'card' && "p-6 max-w-sm",
    variant === 'sidebar' && "p-4 max-w-xs",
    className
  );

  return (
    <motion.div
      className={baseClasses}
      variants={bannerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
    >
      {/* Sponsored label */}
      {sponsored && (
        <div className="absolute top-2 left-2 z-10">
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
            Sponsored
          </span>
        </div>
      )}

      {/* Dismiss button */}
      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-6 w-6 p-0 hover:bg-muted"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Content */}
      <div className={cn(
        "flex gap-4",
        variant === 'banner' && "items-center",
        variant === 'card' && "flex-col",
        variant === 'sidebar' && "flex-col space-y-3"
      )}>
        {/* Image */}
        {imageUrl && (
          <div className={cn(
            "relative overflow-hidden rounded-lg bg-muted",
            variant === 'banner' && "w-16 h-16 flex-shrink-0",
            variant === 'card' && "w-full h-32",
            variant === 'sidebar' && "w-full h-20"
          )}>
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
              🛍️
            </div>
          </div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-foreground mb-1",
            variant === 'banner' && "text-sm",
            variant === 'card' && "text-lg",
            variant === 'sidebar' && "text-sm"
          )}>
            {title}
          </h3>
          
          <p className={cn(
            "text-muted-foreground mb-3",
            variant === 'banner' && "text-xs",
            variant === 'card' && "text-sm",
            variant === 'sidebar' && "text-xs"
          )}>
            {description}
          </p>

          {/* CTA */}
          <Button
            size={variant === 'banner' ? 'sm' : 'default'}
            className="w-full bg-gradient-primary hover:opacity-90"
            asChild
          >
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              {ctaText}
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Animated shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        variants={shimmerVariants}
        animate="animate"
      />

      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
    </motion.div>
  );
}