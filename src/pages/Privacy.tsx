import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This includes your name, email address, phone number, delivery address, and payment information.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to process your orders, communicate with you, improve our services, and comply with legal obligations. We may also use your information to send you promotional messages, though you can opt out at any time.',
    },
    {
      title: 'Information Sharing',
      content: 'We share your information with local shops to fulfill your orders and with delivery partners to complete deliveries. We do not sell your personal information to third parties for their marketing purposes.',
    },
    {
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us to exercise these rights.',
    },
    {
      title: 'Cookies and Tracking',
      content: 'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookies through your browser settings.',
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
            Privacy Policy
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
