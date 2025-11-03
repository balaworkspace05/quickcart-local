import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, MessageSquare, Store } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Review {
  id: string;
  rating: number;
  feedback: string;
  created_at: string;
  product_id: string;
  products?: {
    name: string;
    shops?: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  created_at: string;
  order_items: {
    products: {
      id: string;
      name: string;
      shops: {
        id: string;
        name: string;
      };
    };
  }[];
}

export default function CustomerFeedback() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  useEffect(() => {
    if (!user || userRole !== 'customer') {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, userRole, navigate]);

  const fetchData = async () => {
    await Promise.all([fetchReviews(), fetchDeliveredOrders()]);
  };

  const fetchDeliveredOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          order_items (
            products (
              id,
              name,
              shops (
                id,
                name
              )
            )
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'delivered')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveredOrders(data || []);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products (
            name,
            shops (
              name
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || rating === 0) {
      toast.error('Please provide both rating and feedback');
      return;
    }

    if (!selectedProductId || !selectedOrderId) {
      toast.error('Please select an order and product');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user?.id,
          product_id: selectedProductId,
          order_id: selectedOrderId,
          rating,
          feedback,
        });

      if (error) throw error;

      toast.success('Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
      setSelectedOrderId('');
      setSelectedProductId('');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to submit feedback');
    }
  };

  const selectedOrder = deliveredOrders.find(o => o.id === selectedOrderId);
  const availableProducts = selectedOrder?.order_items?.map(item => item.products) || [];

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-8"
        >
          Your Feedback
        </motion.h1>

        {/* Submit New Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-8 glass-card border-primary/20 shadow-floating">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Share Your Experience
            </h2>

            {deliveredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Complete an order to leave feedback</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Order</label>
                  <Select value={selectedOrderId} onValueChange={(value) => {
                    setSelectedOrderId(value);
                    setSelectedProductId('');
                  }}>
                    <SelectTrigger className="glass-card border-primary/20">
                      <SelectValue placeholder="Choose a delivered order" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveredOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          Order from {new Date(order.created_at).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOrderId && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select Product</label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger className="glass-card border-primary/20">
                        <SelectValue placeholder="Choose a product to review" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.shops.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        className="transition-all"
                      >
                        <Star
                          className={`w-8 h-8 transition-all ${
                            star <= rating ? 'fill-warning text-warning drop-shadow-glow' : 'text-muted-foreground'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Feedback</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us about your experience with this product..."
                    className="min-h-[120px] glass-card border-primary/20"
                  />
                </div>

                <Button 
                  onClick={handleSubmitFeedback} 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                  disabled={!selectedProductId || !selectedOrderId}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </>
            )}
          </Card>
        </motion.div>

        {/* Previous Feedbacks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Your Previous Feedback</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 glass-card">
                  <Skeleton className="w-32 h-6 mb-3" />
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-3/4 h-4" />
                </Card>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <Card className="p-12 text-center glass-card border-primary/20">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg text-muted-foreground">No feedback submitted yet</p>
              <p className="text-sm text-muted-foreground mt-2">Complete an order and share your experience!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 glass-card border-primary/20 hover:border-primary/40 hover:shadow-glow transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 transition-all ${
                                star <= review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        {review.products && (
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            <span>{review.products.name} • {review.products.shops?.name}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed">{review.feedback}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
