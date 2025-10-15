import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Help() {
  const faqs = [
    {
      question: 'How does LocalCart work?',
      answer: 'LocalCart connects you with local neighborhood stores. Browse products, add them to your cart from multiple shops, and get everything delivered to your doorstep in 15 minutes or less.',
    },
    {
      question: 'What areas do you deliver to?',
      answer: 'We currently operate in 15+ cities across the country. Enter your address at checkout to see if we deliver to your location.',
    },
    {
      question: 'Is there a minimum order amount?',
      answer: 'Minimum order amounts vary by shop and location, typically ranging from $10-$20. You can check the minimum for each shop on their page.',
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is confirmed, you can track it in real-time from the Orders page. You\'ll receive notifications at each stage of delivery.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, and digital wallets. You can also use our LocalCart Credit for buy now, pay later options.',
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 2 minutes of placing it. After that, please contact our support team for assistance.',
    },
    {
      question: 'What if I receive damaged items?',
      answer: 'We have a 100% satisfaction guarantee. If you receive damaged items, contact us immediately through the app and we\'ll arrange a replacement or refund.',
    },
    {
      question: 'How do I become a partner shop?',
      answer: 'Click on "Become a Partner" in the footer or contact us at partners@localcart.com. Our team will guide you through the onboarding process.',
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
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground font-body mb-8">
            Find answers to common questions about LocalCart
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-12 h-14 glass-card border-white/10 text-lg"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card border border-white/10 shadow-floating backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-xl px-6">
                    <AccordionTrigger className="font-display font-semibold text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-body leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
