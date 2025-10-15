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

      {/* Hero Section - Asymmetric Split Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block"
              >
                <Badge className="mb-6 glass-card border-primary/30 px-6 py-3 text-base backdrop-blur-xl">
                  ✨ Live in 15+ Cities
                </Badge>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-[0.9]">
                <motion.span 
                  className="block mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Shop
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Hyperlocal
                </motion.span>
                <motion.span 
                  className="block text-muted-foreground text-4xl md:text-5xl lg:text-6xl mt-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  Live Fast.
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg font-body leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                Your neighborhood stores, now online. Get ultra-fast delivery while supporting local businesses in your community.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <Link to="/shops">
                  <Button 
                    size="lg" 
                    variant="premium"
                    className="text-lg px-10 py-7 h-auto font-bold shadow-glow"
                  >
                    Explore Shops
                    <ChevronRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="text-lg px-10 py-7 h-auto border-2 border-primary/20"
                >
                  How It Works
                </Button>
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                className="mt-12 grid grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <div>
                  <div className="text-3xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">15min</div>
                  <div className="text-sm text-muted-foreground font-body">Avg Delivery</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold bg-gradient-secondary bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-muted-foreground font-body">Local Shops</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">100%</div>
                  <div className="text-sm text-muted-foreground font-body">Authentic</div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[600px]">
                {/* Floating Cards */}
                <motion.div
                  className="absolute top-0 right-0 w-64 glass-card p-6 rounded-3xl border border-white/20 shadow-glow backdrop-blur-xl"
                  animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl" />
                    <div>
                      <div className="font-display font-bold">Fresh Veggies</div>
                      <div className="text-xs text-muted-foreground">2 min away</div>
                    </div>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30">Available Now</Badge>
                </motion.div>
                
                <motion.div
                  className="absolute bottom-20 left-0 w-64 glass-card p-6 rounded-3xl border border-white/20 shadow-floating backdrop-blur-xl"
                  animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-xl" />
                    <div>
                      <div className="font-display font-bold">Bakery Fresh</div>
                      <div className="text-xs text-muted-foreground">5 min away</div>
                    </div>
                  </div>
                  <Badge className="bg-warning/20 text-warning border-warning/30">Hot Deals</Badge>
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 glass-card p-8 rounded-3xl border-2 border-primary/30 shadow-glow backdrop-blur-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Clock className="w-8 h-8 text-primary mb-3" />
                  <div className="font-display font-bold text-2xl mb-2">Lightning Fast</div>
                  <div className="text-muted-foreground font-body">15-minute delivery to your doorstep</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10" />
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

      {/* CTA Section - Unique Bento Box Design */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left - Main CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative glass-card border-2 border-primary/20 rounded-[3rem] p-12 overflow-hidden group hover:border-primary/40 transition-all duration-500"
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="relative z-10">
                <div className="inline-block mb-6">
                  <Badge className="glass-card border-primary/30 px-4 py-2 text-base backdrop-blur-xl">
                    🎯 Join LocalCart
                  </Badge>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-display font-black mb-6 leading-tight">
                  Ready to
                  <br />
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Go Local?
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 font-body max-w-md">
                  Join thousands of smart shoppers supporting local businesses while enjoying lightning-fast delivery.
                </p>
                
                <Link to="/shops">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg" 
                      variant="premium"
                      className="text-lg px-10 py-7 h-auto font-bold shadow-glow w-full sm:w-auto"
                    >
                      Start Shopping Now
                      <ChevronRight className="ml-2 w-6 h-6" />
                    </Button>
                  </motion.div>
                </Link>
                
                {/* Trust indicators */}
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-primary border-2 border-background" />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground font-body">
                    <span className="font-bold text-foreground">10,000+</span> happy customers
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all duration-500" />
            </motion.div>
            
            {/* Right - Feature Cards Grid */}
            <div className="grid grid-rows-2 gap-8">
              {/* Partner CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card border border-white/10 rounded-[2rem] p-8 hover:border-secondary/30 transition-all duration-500 group relative overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
                />
                
                <div className="relative z-10">
                  <Store className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-2xl font-display font-bold mb-3">Own a Shop?</h3>
                  <p className="text-muted-foreground font-body mb-6">
                    Partner with us and reach thousands of local customers.
                  </p>
                  <Button 
                    variant="glass" 
                    className="border-2 border-secondary/30 hover:border-secondary/50 w-full"
                  >
                    Become a Partner
                  </Button>
                </div>
              </motion.div>
              
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="glass-card border border-white/10 rounded-[2rem] p-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
                
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Zap className="w-8 h-8 text-accent mb-2" />
                      <div className="text-3xl font-display font-bold mb-1">15min</div>
                      <div className="text-sm text-muted-foreground font-body">Fast Delivery</div>
                    </div>
                    <div>
                      <Shield className="w-8 h-8 text-primary mb-2" />
                      <div className="text-3xl font-display font-bold mb-1">100%</div>
                      <div className="text-sm text-muted-foreground font-body">Authentic</div>
                    </div>
                    <div>
                      <Heart className="w-8 h-8 text-secondary mb-2" />
                      <div className="text-3xl font-display font-bold mb-1">500+</div>
                      <div className="text-sm text-muted-foreground font-body">Local Shops</div>
                    </div>
                    <div>
                      <Star className="w-8 h-8 text-warning mb-2" />
                      <div className="text-3xl font-display font-bold mb-1">4.8</div>
                      <div className="text-sm text-muted-foreground font-body">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
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