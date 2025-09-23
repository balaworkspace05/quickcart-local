import { motion } from 'framer-motion';
import { Crown, Gift, Star, Zap, Trophy, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoyaltyBadge from '@/components/LoyaltyBadge';
import AnimatedCounter from '@/components/AnimatedCounter';
import GlassmorphicCard from '@/components/GlassmorphicCard';

export default function LoyaltyRewards() {
  const userStats = {
    currentPoints: 1250,
    level: 'gold' as const,
    nextLevelPoints: 2000,
    totalSaved: 450,
    ordersThisMonth: 12,
    streakDays: 7
  };

  const rewards = [
    {
      id: '1',
      title: 'Free Delivery',
      points: 100,
      description: 'Get free delivery on your next order',
      category: 'delivery',
      icon: '🚚',
      available: true
    },
    {
      id: '2',
      title: '₹50 Cashback',
      points: 250,
      description: 'Instant cashback on orders above ₹500',
      category: 'cashback',
      icon: '💰',
      available: true
    },
    {
      id: '3',
      title: 'Premium Support',
      points: 500,
      description: '24/7 priority customer support',
      category: 'support',
      icon: '👨‍💼',
      available: true
    },
    {
      id: '4',
      title: 'Double Points Weekend',
      points: 750,
      description: 'Earn 2x points on weekend orders',
      category: 'multiplier',
      icon: '⚡',
      available: false
    }
  ];

  const achievements = [
    {
      title: 'Early Adopter',
      description: 'One of the first 1000 users',
      icon: Star,
      unlocked: true,
      rarity: 'legendary'
    },
    {
      title: 'Local Champion',
      description: 'Ordered from 10+ local shops',
      icon: Crown,
      unlocked: true,
      rarity: 'epic'
    },
    {
      title: 'Streak Master',
      description: 'Order daily for 30 days',
      icon: Target,
      unlocked: false,
      rarity: 'rare',
      progress: 7,
      target: 30
    },
    {
      title: 'Big Spender',
      description: 'Spend ₹10,000 in a month',
      icon: TrendingUp,
      unlocked: false,
      rarity: 'common',
      progress: 3500,
      target: 10000
    }
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-500 to-pink-500';
      case 'epic': return 'from-orange-500 to-red-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loyalty & Rewards</h1>
          <p className="text-xl text-muted-foreground">
            Earn points with every order and unlock amazing rewards
          </p>
        </motion.div>

        {/* User Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Loyalty Badge */}
            <div className="md:col-span-1">
              <LoyaltyBadge
                level={userStats.level}
                points={userStats.currentPoints}
                nextLevelPoints={userStats.nextLevelPoints}
              />
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <GlassmorphicCard className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Total Saved</h3>
                <AnimatedCounter
                  to={userStats.totalSaved}
                  prefix="₹"
                  className="text-2xl font-bold text-success"
                />
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">This Month</h3>
                <AnimatedCounter
                  to={userStats.ordersThisMonth}
                  suffix=" orders"
                  className="text-2xl font-bold text-primary"
                />
              </GlassmorphicCard>
            </div>
          </div>
        </motion.div>

        {/* Available Rewards */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-6 h-6 text-primary" />
                <span>Available Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GlassmorphicCard className={`p-6 ${!reward.available ? 'opacity-60' : ''}`}>
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{reward.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{reward.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {reward.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              {reward.points} points
                            </Badge>
                            <Button
                              size="sm"
                              disabled={!reward.available || userStats.currentPoints < reward.points}
                              className="bg-gradient-primary"
                            >
                              {userStats.currentPoints >= reward.points ? 'Redeem' : 'Not enough points'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-warning" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassmorphicCard 
                      className={`p-6 relative overflow-hidden ${
                        achievement.unlocked ? 'border-success/30' : 'border-muted'
                      }`}
                    >
                      {/* Rarity gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-5`} />
                      
                      <div className="relative z-10 flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.unlocked 
                            ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}` 
                            : 'bg-muted'
                        }`}>
                          <achievement.icon className={`w-6 h-6 ${
                            achievement.unlocked ? 'text-white' : 'text-muted-foreground'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold ${
                              achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {achievement.title}
                            </h3>
                            {achievement.unlocked && (
                              <Badge className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white border-0 text-xs`}>
                                {achievement.rarity}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>
                          
                          {!achievement.unlocked && achievement.progress !== undefined && (
                            <div>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.target}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <motion.div
                                  className="h-2 rounded-full bg-gradient-primary"
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${((achievement.progress || 0) / (achievement.target || 1)) * 100}%` 
                                  }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}