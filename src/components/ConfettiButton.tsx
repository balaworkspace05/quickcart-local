import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ConfettiButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export default function ConfettiButton({ 
  onClick, 
  children, 
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false
}: ConfettiButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const colors = [
    'hsl(142, 69%, 58%)', // primary
    'hsl(24, 95%, 53%)',  // secondary
    'hsl(217, 91%, 60%)', // info
    'hsl(43, 96%, 56%)',  // warning
  ];

  const createParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        life: 1,
      });
    }
    
    return newParticles;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newParticles = createParticles(x, y);
      setParticles(newParticles);
      setIsAnimating(true);
      
      // Animate particles
      let animationId: number;
      let startTime: number;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        
        setParticles(prevParticles => 
          prevParticles.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.3, // gravity
            life: Math.max(0, particle.life - 0.03),
          })).filter(particle => particle.life > 0)
        );
        
        if (elapsed < 1000) {
          animationId = requestAnimationFrame(animate);
        } else {
          setParticles([]);
          setIsAnimating(false);
        }
      };
      
      animationId = requestAnimationFrame(animate);
      
      // Cleanup
      setTimeout(() => {
        cancelAnimationFrame(animationId);
        setParticles([]);
        setIsAnimating(false);
      }, 1000);
    }
    
    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          ref={buttonRef}
          onClick={handleClick}
          variant={variant}
          size={size}
          className={`relative overflow-hidden transition-all duration-200 ${className}`}
          disabled={disabled}
        >
          <motion.div
            animate={isAnimating ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center space-x-2"
          >
            {children || (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </motion.div>
        </Button>
      </motion.div>
      
      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              opacity: particle.life,
              transform: `scale(${particle.life})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}