import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Zap, Heart } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in empowering local businesses and creating stronger neighborhoods.',
    },
    {
      icon: Target,
      title: 'Customer Focus',
      description: 'Your satisfaction drives everything we do, from delivery speed to product quality.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging technology to make hyperlocal shopping seamless and efficient.',
    },
    {
      icon: Heart,
      title: 'Sustainability',
      description: 'Reducing carbon footprint by supporting nearby stores and shorter delivery routes.',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 bg-gradient-primary bg-clip-text text-transparent">
            About LocalCart
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
            We're on a mission to revolutionize hyperlocal commerce by connecting customers with neighborhood stores for ultra-fast delivery.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <Card className="glass-card border border-white/10 shadow-floating backdrop-blur-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-display font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground font-body leading-relaxed text-lg">
                <p>
                  LocalCart was founded with a simple belief: local businesses are the heart of our communities, and they deserve the same technological advantages as large corporations.
                </p>
                <p>
                  We saw how dark stores and large chains were taking over, disconnecting communities from their neighborhood shops. So we built a platform that brings local stores online, giving them the tools to compete while maintaining the personal touch that makes them special.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers across 15+ cities, connecting them with over 500 local shops for ultra-fast, sustainable deliveries.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-center mb-12"
          >
            Our Values
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="glass-card border border-white/10 shadow-card hover:shadow-glow transition-all duration-500 h-full backdrop-blur-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary/10 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground font-body">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
