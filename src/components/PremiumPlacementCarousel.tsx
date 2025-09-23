import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shop } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface PremiumPlacementCarouselProps {
  shops: Shop[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export default function PremiumPlacementCarousel({
  shops,
  autoPlay = true,
  interval = 4000,
  className
}: PremiumPlacementCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || shops.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shops.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, shops.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % shops.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + shops.length) % shops.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    })
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  if (shops.length === 0) return null;

  return (
    <motion.div
      className={cn("relative", className)}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured Stores</h2>
          <p className="text-muted-foreground">Premium partners in your area</p>
        </div>
        
        <Badge className="bg-gradient-primary text-white border-0">
          <Star className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      </div>

      {/* Carousel Container */}
      <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-card border border-border/50">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentIndex}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className="absolute inset-0 p-6"
          >
            <div className="flex items-center h-full">
              {/* Shop Logo */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-4xl mr-6 flex-shrink-0">
                {shops[currentIndex].logo}
              </div>

              {/* Shop Details */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {shops[currentIndex].name}
                </h3>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{shops[currentIndex].rating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {shops[currentIndex].deliveryTime}
                    </span>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {shops[currentIndex].distance}km away
                  </Badge>
                </div>

                {/* Offers */}
                {shops[currentIndex].offers && (
                  <Badge className="bg-gradient-secondary text-white border-0">
                    🎉 {shops[currentIndex].offers}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {shops.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
              onClick={nextSlide}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Indicators */}
        {shops.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {shops.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/70"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      </div>
    </motion.div>
  );
}