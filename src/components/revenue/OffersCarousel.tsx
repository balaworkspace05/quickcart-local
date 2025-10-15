import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import revenueData from '@/data/revenue.json';

interface OffersCarouselProps {
  location?: string;
}

export default function OffersCarousel({ location = 'Koramangala' }: OffersCarouselProps) {
  const { offers } = revenueData;

  // Check if it's festive season (mock condition)
  const isFestiveSeason = new Date().getMonth() === 9; // October for Diwali

  const festiveColors = isFestiveSeason
    ? 'from-orange-500 to-pink-500'
    : 'from-primary to-secondary';

  return (
    <section className="w-full py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <motion.div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${festiveColors} flex items-center justify-center`}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-foreground">
              {isFestiveSeason ? '🎉 Festive Offers' : 'Hot Deals Near You'}
            </h3>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Near {location}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Offers Grid with Horizontal Scroll */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 w-80 snap-center"
            >
              <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
                {/* Glowing Border Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    offer.festive ? 'from-orange-500 to-pink-500' : festiveColors
                  } opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <CardContent className="p-0 relative">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    
                    {/* Discount Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="absolute top-4 right-4"
                    >
                      <Badge
                        className={`text-lg font-bold px-4 py-2 bg-gradient-to-r ${
                          offer.festive ? 'from-orange-500 to-pink-500' : festiveColors
                        } text-white border-0`}
                      >
                        {offer.discount}
                      </Badge>
                    </motion.div>

                    {/* Festive Badge */}
                    {offer.festive && (
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-4 left-4"
                      >
                        <Badge className="bg-white/90 text-orange-600 border-0">
                          🪔 Festive Special
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        {offer.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {offer.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Valid till {new Date(offer.validTill).toLocaleDateString()}</span>
                      </div>
                      <Badge variant="outline">{offer.category}</Badge>
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${
                        offer.festive ? 'from-orange-500 to-pink-500' : festiveColors
                      } text-white hover:opacity-90`}
                    >
                      Shop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center mt-4"
      >
        <p className="text-xs text-muted-foreground">← Scroll to see more offers →</p>
      </motion.div>
    </section>
  );
}
