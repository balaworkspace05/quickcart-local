import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import revenueData from '@/data/revenue.json';

export default function FeaturedShopsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { featuredShops } = revenueData;
  const navigate = useNavigate();

  const next = () => setCurrentIndex((prev) => (prev + 1) % featuredShops.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + featuredShops.length) % featuredShops.length);

  const currentShop = featuredShops[currentIndex];

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentShop.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
            {/* Sponsored Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center space-x-2 mb-4 w-fit"
            >
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold flex items-center space-x-1">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Sponsored</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              {currentShop.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 mb-8"
            >
              {currentShop.description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={() => navigate(currentShop.ctaUrl)}
                className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6"
              >
                {currentShop.ctaText}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 right-8 flex space-x-2 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {featuredShops.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
