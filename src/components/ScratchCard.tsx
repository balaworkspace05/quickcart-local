import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScratchCardProps {
  discount: number;
  isUsed?: boolean;
  onReveal?: (discount: number) => void;
  className?: string;
}

export default function ScratchCard({ 
  discount, 
  isUsed = false, 
  onReveal,
  className 
}: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(isUsed);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScratch = () => {
    if (!isScratched && !isUsed) {
      setIsScratched(true);
      onReveal?.(discount);
    }
  };

  const cardVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    },
    scratched: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const revealVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15
      }
    }
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "relative w-48 h-32 mx-auto cursor-pointer select-none",
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate={isScratched ? "scratched" : "animate"}
      onClick={handleScratch}
    >
      {/* Background reward */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white">
        <AnimatePresence>
          {isScratched && (
            <motion.div
              className="text-center"
              variants={revealVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={sparkleVariants} animate="animate" className="mb-2">
                <Sparkles className="w-8 h-8 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold">{discount}% OFF</h3>
              <p className="text-sm opacity-90">Congratulations!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scratch overlay */}
      <AnimatePresence>
        {!isScratched && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center text-white cursor-pointer"
            exit={{ 
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.5 }
            }}
          >
            <div className="text-center">
              <Gift className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold">Scratch to reveal</p>
              <p className="text-xs opacity-80">your discount!</p>
            </div>
            
            {/* Scratch texture overlay */}
            <div className="absolute inset-0 bg-gray-500/20 rounded-xl" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40 40-40H20L0 20M40 40V20l-20 20'/%3E%3C/g%3E%3C/svg%3E")`,
                 }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shimmer effect */}
      {!isScratched && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        </div>
      )}

      {/* Glow effect when revealed */}
      <AnimatePresence>
        {isScratched && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 0.5],
              scale: [0.8, 1.2, 1]
            }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}