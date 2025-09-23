import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    scale: 1.04,
    y: -20,
  }
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  duration: 0.4
};

const overlayVariants = {
  initial: {
    scaleY: 1,
    transformOrigin: 'bottom',
  },
  animate: {
    scaleY: 0,
    transformOrigin: 'bottom',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: 0.1,
    }
  },
  exit: {
    scaleY: 1,
    transformOrigin: 'top',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }
  }
};

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Premium page transition overlay */}
      <AnimatePresence>
        <motion.div
          key={`overlay-${location.pathname}`}
          className="fixed inset-0 z-50 bg-gradient-hero pointer-events-none"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      </AnimatePresence>
    </div>
  );
}