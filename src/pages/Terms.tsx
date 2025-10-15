import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function Terms() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using LocalCart, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
    },
    {
      title: 'Use of Service',
      content: 'You must be at least 18 years old to use LocalCart. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
    },
    {
      title: 'Orders and Payments',
      content: 'All orders are subject to acceptance and availability. Prices are subject to change without notice. Payment must be made at the time of order placement through our accepted payment methods.',
    },
    {
      title: 'Delivery',
      content: 'We strive to deliver within the estimated timeframe, but delays may occur due to factors beyond our control. Delivery fees and minimum order requirements may apply.',
    },
    {
      title: 'Returns and Refunds',
      content: 'Our return and refund policy varies by product and shop. Generally, damaged or incorrect items can be returned for a full refund. Contact customer support within 24 hours of delivery for assistance.',
    },
    {
      title: 'User Conduct',
      content: 'You agree not to misuse our services, engage in fraudulent activities, or violate any applicable laws. We reserve the right to suspend or terminate accounts that violate these terms.',
    },
    {
      title: 'Limitation of Liability',
      content: 'LocalCart is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability is limited to the amount paid for the relevant order.',
    },
    {
      title: 'Changes to Terms',
      content: 'We may modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-muted-foreground font-body">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card border border-white/10 shadow-card backdrop-blur-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-display font-bold mb-4">{section.title}</h2>
                  <p className="text-muted-foreground font-body leading-relaxed text-lg">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
