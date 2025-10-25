import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import revenueData from '@/data/revenue.json';
import ConfettiButton from '@/components/ConfettiButton';

interface RecommendationsProps {
  productCategory?: string;
}

export default function Recommendations({ productCategory = 'bread' }: RecommendationsProps) {
  const { addToCart } = useStore();
  const { recommendedProducts } = revenueData;

  // Filter recommendations based on category
  const recommendations = recommendedProducts.filter(
    (product) => product.relatedTo.includes(productCategory.toLowerCase())
  );

  if (recommendations.length === 0) {
    return null;
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image,
      category: product.category,
      shop_id: 'shop-1',
      stock: 100,
      unit: 'piece',
      description: product.name,
      original_price: null,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="w-full py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">You might also like</h3>
            <p className="text-sm text-muted-foreground">
              Powered by LocalCart Smart Engine
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {recommendations.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  {/* Image */}
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ₹{product.price}
                      </span>
                      <ConfettiButton
                        onClick={() => handleAddToCart(product)}
                        variant="default"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </ConfettiButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
