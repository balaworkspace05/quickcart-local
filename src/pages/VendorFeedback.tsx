import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VendorLayout from '@/components/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Review {
  id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
  user_id: string;
  product_id: string;
  products?: { name: string };
  profiles?: { name: string };
}

interface FeedbackReply {
  id: string;
  feedback_id: string;
  message: string;
  created_at: string;
}

interface Shop {
  id: string;
  name: string;
  logo_url: string | null;
}

export default function VendorFeedback() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Record<string, FeedbackReply>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [avgRating, setAvgRating] = useState(0);
  const [sentiment, setSentiment] = useState({ positive: 0, neutral: 0, negative: 0 });

  useEffect(() => {
    if (user) {
      loadData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const setupRealtimeSubscriptions = () => {
    // Subscribe to new reviews
    const reviewsChannel = supabase
      .channel('vendor-reviews')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reviews'
      }, () => {
        loadData();
      })
      .subscribe();

    // Subscribe to feedback replies
    const repliesChannel = supabase
      .channel('vendor-replies')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feedback_reply',
        filter: `vendor_id=eq.${user?.id}`
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(repliesChannel);
    };
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: shopData, error: shopError } = await (supabase as any)
        .from('shops')
        .select('id, name, logo_url')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (shopError) throw shopError;
      setShop(shopData);

      if (shopData) {
        const { data: productIds } = await supabase
          .from('products')
          .select('id')
          .eq('shop_id', shopData.id);

        if (productIds && productIds.length > 0) {
          const ids = productIds.map(p => p.id);
          
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('*, products(name)')
            .in('product_id', ids)
            .order('created_at', { ascending: false });

          if (reviewsError) throw reviewsError;

          // Fetch user profiles separately
          if (reviewsData) {
            const userIds = reviewsData.map(r => r.user_id);
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, name')
              .in('id', userIds);

            const profilesMap = profilesData?.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, { name: string }>) || {};

            const reviewsWithProfiles = reviewsData.map(review => ({
              ...review,
              profiles: profilesMap[review.user_id],
            }));

            setReviews(reviewsWithProfiles);
          }

          // Calculate average rating
          if (reviewsData && reviewsData.length > 0) {
            const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
            setAvgRating(avg);

            // Calculate sentiment
            const positive = reviewsData.filter(r => r.rating >= 4).length;
            const neutral = reviewsData.filter(r => r.rating === 3).length;
            const negative = reviewsData.filter(r => r.rating < 3).length;
            setSentiment({ positive, neutral, negative });
          }

          // Load replies
          const { data: repliesData } = await supabase
            .from('feedback_reply')
            .select('*')
            .eq('vendor_id', user?.id);

          if (repliesData) {
            const repliesMap = repliesData.reduce((acc, reply) => {
              acc[reply.feedback_id] = reply;
              return acc;
            }, {} as Record<string, FeedbackReply>);
            setReplies(repliesMap);
          }
        }
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText[reviewId]?.trim()) return;

    try {
      const { error } = await supabase.from('feedback_reply').insert({
        feedback_id: reviewId,
        vendor_id: user?.id,
        message: replyText[reviewId],
      });

      if (error) throw error;
      toast.success('Reply posted successfully');
      setReplyText({ ...replyText, [reviewId]: '' });
      loadData();
    } catch (error: any) {
      toast.error('Failed to post reply');
      console.error(error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getSentimentIcon = (rating: number) => {
    if (rating >= 4) return <ThumbsUp className="w-5 h-5 text-green-500" />;
    if (rating === 3) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <ThumbsDown className="w-5 h-5 text-red-500" />;
  };

  if (loading) {
    return (
      <VendorLayout shopName={shop?.name}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96" />
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout shopName={shop?.name} shopLogo={shop?.logo_url}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Feedback</h1>
          <p className="text-muted-foreground">View and respond to customer reviews</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
              <div className="flex items-center mt-2">{renderStars(Math.round(avgRating))}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Positive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-6 h-6 text-green-500" />
                <div className="text-3xl font-bold">{sentiment.positive}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Neutral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Meh className="w-6 h-6 text-yellow-500" />
                <div className="text-3xl font-bold">{sentiment.neutral}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Negative</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ThumbsDown className="w-6 h-6 text-red-500" />
                <div className="text-3xl font-bold">{sentiment.negative}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{review.profiles?.name || 'Anonymous'}</div>
                      <Badge variant="outline">{review.products?.name}</Badge>
                      {getSentimentIcon(review.rating)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {review.feedback && (
                  <p className="text-muted-foreground mb-4">{review.feedback}</p>
                )}

                {replies[review.id] ? (
                  <div className="bg-accent p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium text-sm">Your Reply</span>
                    </div>
                    <p className="text-sm">{replies[review.id].message}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Write a reply to this review..."
                      value={replyText[review.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                      className="min-h-[80px]"
                    />
                    <Button onClick={() => handleReply(review.id)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Post Reply
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {reviews.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No feedback yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
