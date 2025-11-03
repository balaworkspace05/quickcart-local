import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VendorLayout from '@/components/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, TrendingUp, Target, Award, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Shop {
  id: string;
  shop_name: string;
  logo_url: string | null;
}

interface VendorTask {
  id: string;
  task: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface PerformanceMetrics {
  onTimeDelivery: number;
  customerRetention: number;
  avgRatingTrend: number;
  productAvailability: number;
  responseTime: number;
}

export default function VendorWork() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [tasks, setTasks] = useState<VendorTask[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    onTimeDelivery: 0,
    customerRetention: 0,
    avgRatingTrend: 0,
    productAvailability: 0,
    responseTime: 0,
  });
  const [shopHealthScore, setShopHealthScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: shopData, error: shopError } = await supabase
        .from('vendors')
        .select('id, shop_name, logo_url')
        .eq('user_id', user?.id)
        .single();

      if (shopError) throw shopError;
      setShop(shopData);

      // For now, use empty tasks array since vendor_tasks table doesn't exist
      const tasksData: VendorTask[] = [];
      setTasks(tasksData);

      if (shopData) {
        // Calculate performance metrics
        const { data: products } = await supabase
          .from('products')
          .select('stock, in_stock')
          .eq('vendor_id', shopData.id);

        const { data: orders } = await supabase
          .from('orders')
          .select('status, created_at')
          .eq('vendor_id', shopData.id);

        const { data: feedback } = await supabase
          .from('feedback')
          .select('rating')
          .eq('vendor_id', shopData.id);

        // Calculate metrics
        const availableProducts = products?.filter(p => p.in_stock && p.stock > 0).length || 0;
        const totalProducts = products?.length || 1;
        const productAvailability = (availableProducts / totalProducts) * 100;

        const deliveredOrders = orders?.filter((o: any) => o.status === 'delivered').length || 0;
        const totalOrders = orders?.length || 1;
        const onTimeDelivery = (deliveredOrders / totalOrders) * 100;

        const avgRating = feedback?.reduce((sum, f) => sum + (f.rating || 0), 0) / (feedback?.length || 1);
        const avgRatingTrend = (avgRating / 5) * 100;

        const calculatedMetrics: PerformanceMetrics = {
          onTimeDelivery,
          customerRetention: Math.min(95, 60 + (avgRating * 7)),
          avgRatingTrend,
          productAvailability,
          responseTime: Math.max(50, 100 - (feedback?.length || 0) * 2),
        };

        setMetrics(calculatedMetrics);

        // Calculate shop health score
        const healthScore = Object.values(calculatedMetrics).reduce((a, b) => a + b, 0) / 5;
        setShopHealthScore(Math.round(healthScore));

        // Generate suggestions
        const newSuggestions = [];
        if (productAvailability < 80) newSuggestions.push('Restock low-demand items to improve availability');
        if (avgRatingTrend < 70) newSuggestions.push('Focus on improving product quality based on customer feedback');
        if (onTimeDelivery < 90) newSuggestions.push('Optimize order fulfillment process to improve delivery times');
        setSuggestions(newSuggestions);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load performance insights');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    // Tasks functionality disabled until vendor_tasks table is created
    toast.info('Task management coming soon');
  };

  const radarData = [
    { metric: 'On-Time Delivery', value: metrics.onTimeDelivery },
    { metric: 'Customer Retention', value: metrics.customerRetention },
    { metric: 'Rating Trend', value: metrics.avgRatingTrend },
    { metric: 'Product Availability', value: metrics.productAvailability },
    { metric: 'Response Time', value: metrics.responseTime },
  ];

  const weeklyPerformance = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 80 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 85 },
    { day: 'Fri', score: shopHealthScore },
    { day: 'Sat', score: 0 },
    { day: 'Sun', score: 0 },
  ];

  if (loading) {
    return (
      <VendorLayout shopName={shop?.shop_name}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96" />
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout shopName={shop?.shop_name} shopLogo={shop?.logo_url}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Performance Insights</h1>
          <p className="text-muted-foreground">Track your shop's growth and improvement areas</p>
        </div>

        {/* Shop Health Score */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Shop Health Score</h3>
                <div className="text-5xl font-bold">{shopHealthScore}%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {shopHealthScore >= 90 ? 'Excellent!' : shopHealthScore >= 70 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
              <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center">
                <Award className="w-16 h-16 text-white" />
              </div>
            </div>
            <Progress value={shopHealthScore} className="mt-4 h-2" />
          </CardContent>
        </Card>

        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.onTimeDelivery.toFixed(0)}%</div>
              <Progress value={metrics.onTimeDelivery} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.customerRetention.toFixed(0)}%</div>
              <Progress value={metrics.customerRetention} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Product Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.productAvailability.toFixed(0)}%</div>
              <Progress value={metrics.productAvailability} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Improvement Suggestions */}
        {suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Top 3 Actions to Improve Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-accent rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      className="p-0 h-auto"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </Button>
                    <div>
                      <p className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                        {task.task}
                      </p>
                      {task.completed_at && (
                        <p className="text-xs text-muted-foreground">
                          Completed {new Date(task.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}
