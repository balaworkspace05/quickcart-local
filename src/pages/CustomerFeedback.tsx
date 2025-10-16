import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  feedback: string;
  created_at: string;
  product_id: string;
}

export default function CustomerFeedback() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!user || userRole !== 'customer') {
      navigate('/auth');
      return;
    }
    fetchReviews();
  }, [user, userRole, navigate]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
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

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user?.id,
          product_id: '00000000-0000-0000-0000-000000000000', // General feedback
          rating,
          feedback,
        });

      if (error) throw error;

      toast.success('Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
      fetchReviews();
    } catch (error: any) {
      toast.error('Failed to submit feedback');
    }
  };

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
          <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Share Your Experience
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Feedback</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                className="min-h-[120px]"
              />
            </div>

            <Button onClick={handleSubmitFeedback} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
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
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : reviews.length === 0 ? (
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-primary/20">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No feedback submitted yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-foreground">{review.feedback}</p>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
