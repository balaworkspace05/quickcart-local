import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  separator?: string;
  trigger?: 'inView' | 'immediate';
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
  separator = ',',
  trigger = 'inView'
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const controls = useAnimation();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  
  const formatNumber = (num: number) => {
    const rounded = Number(num.toFixed(decimals));
    return rounded.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).replace(/,/g, separator);
  };

  useEffect(() => {
    if ((trigger === 'inView' && inView) || trigger === 'immediate') {
      const startTime = Date.now();
      const startValue = from;
      const endValue = to;
      const totalChange = endValue - startValue;

      const animate = () => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000; // Convert to seconds
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (totalChange * easeOut);
        
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      requestAnimationFrame(animate);

      // Trigger scale animation
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3, ease: "easeInOut" }
      });
    }
  }, [inView, trigger, from, to, duration, controls]);

  return (
    <motion.span
      ref={ref}
      animate={controls}
      className={`inline-block tabular-nums ${className}`}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
}