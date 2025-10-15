import { motion } from 'framer-motion';
import { CreditCard, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import revenueData from '@/data/revenue.json';

export default function CreditBadge() {
  const { creditOptions } = revenueData;
  const usagePercentage = (creditOptions.usedCredit / creditOptions.creditLimit) * 100;

  if (!creditOptions.eligible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden border-2 border-primary/30">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent" />
        <motion.div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">LocalCart Credit</h3>
                <p className="text-sm text-muted-foreground font-normal">Active Account</p>
              </div>
            </CardTitle>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Available Credit */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Available Credit</span>
              <span className="text-3xl font-bold text-primary">
                ₹{creditOptions.availableCredit.toLocaleString()}
              </span>
            </div>
            <Progress value={100 - usagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              of ₹{creditOptions.creditLimit.toLocaleString()} total limit
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Used Credit</p>
              <p className="text-lg font-bold text-foreground">
                ₹{creditOptions.usedCredit.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Payment Due</p>
              <p className="text-lg font-bold text-foreground flex items-center space-x-1">
                <span>{creditOptions.paymentDueDays} days</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/20"
          >
            <p className="text-xs text-foreground">
              💡 Enjoy interest-free credit for orders above ₹{creditOptions.minOrderForCredit}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
