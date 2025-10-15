import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  ShoppingCart, 
  Zap, 
  Star, 
  ChevronRight,
  Shield,
  Clock,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonials } from '@/data/mockData';
import { motion } from 'framer-motion';
import FeaturedShopsCarousel from '@/components/revenue/FeaturedShopsCarousel';
import OffersCarousel from '@/components/revenue/OffersCarousel';

export default function Landing() {
  const features = [
    {
      icon: Store,
      title: 'No Dark Stores',
      description: 'We partner with your neighborhood shops, supporting local businesses.',
      color: 'text-green-600'
    },
    {
      icon: ShoppingCart,
      title: 'Multi-Store Checkout',
      description: 'One cart, multiple shops. Get everything you need in a single order.',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      title: 'AI-Powered Recommendations',
      description: 'Smart suggestions and upselling to help you discover what you need.',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Featured Shops Carousel */}
      <div className="container mx-auto px-4 py-8">
        <FeaturedShopsCarousel />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge className="mb-6 glass-card text-white border-white/30 px-6 py-2 text-base backdrop-blur-xl">
                ✨ Now delivering in 15+ cities
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Shop Local.
              <br />
              <span className="bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                Get Faster.
              </span>
              <br />
              Pay Less.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Connect with neighborhood stores and get ultra-fast delivery while supporting your local community.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link to="/shops">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="glass"
                    className="bg-white/95 text-primary hover:bg-white hover:shadow-glow text-lg px-10 py-6 h-auto font-semibold"
                  >
                    Shop Now
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg px-10 py-6 h-auto backdrop-blur-xl"
                >
                  Download App
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <motion.div 
                className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full backdrop-blur-xl"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Clock className="w-5 h-5" />
                <span className="font-medium">15-min delivery</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full backdrop-blur-xl"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">100% authentic</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full backdrop-blur-xl"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Support local</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Offers Section */}
      <div className="container mx-auto px-4">
        <OffersCarousel location="Koramangala" />
      </div>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Why Choose LocalCart?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              We're revolutionizing hyperlocal commerce by connecting you directly with neighborhood stores.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <Card className="h-full glass-card border border-white/10 shadow-floating hover:shadow-glow hover:border-white/30 transition-all duration-500 text-center p-8 group backdrop-blur-xl">
                  <CardContent className="p-0">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className={`w-10 h-10 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-body">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 bg-gradient-secondary bg-clip-text text-transparent">
              Loved by Thousands
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              See what our customers say about their LocalCart experience
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="h-full glass-card border border-white/10 shadow-floating hover:shadow-glow hover:border-primary/30 transition-all duration-500 backdrop-blur-xl group">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4 gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Star className="w-5 h-5 fill-warning text-warning" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic font-body leading-relaxed">"{testimonial.text}"</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="font-display font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground font-body">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              Ready to Support Local?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto font-body">
              Join thousands of customers who choose to shop local and get lightning-fast delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shops">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="glass"
                    className="bg-white text-primary hover:bg-white/95 hover:shadow-glow text-lg px-10 py-6 h-auto font-semibold"
                  >
                    Start Shopping
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg px-10 py-6 h-auto backdrop-blur-xl"
                >
                  Become a Partner
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 glass-card border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  L
                </div>
                <span className="font-display font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">LocalCart</span>
              </div>
              <p className="text-muted-foreground font-body leading-relaxed">
                Supporting local businesses while delivering convenience to your doorstep.
              </p>
            </div>
            
            <div>
              <h4 className="font-display font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground font-body">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/press" className="hover:text-foreground transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground font-body">
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/feedback" className="hover:text-foreground transition-colors">Feedback</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground font-body">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-muted-foreground">
            <p className="font-body">&copy; 2024 LocalCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}