import { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { ContactFormClient } from '@/components/contact-form-client'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'Contact Vikamusk | Get in Touch',
  description: 'Contact Vikamusk for equipment inquiries, quotes, or support. Available 24/7.',
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'sales@vikamusk.com',
      description: 'For product inquiries and quotes',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Available Monday-Friday, 9AM-6PM',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Global Headquarters',
      description: '123 Industrial Ave, City, Country',
    },
    {
      icon: Clock,
      title: 'Support',
      value: '24/7 Technical Support',
      description: 'Available for emergencies',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="Let&apos;s Connect"
        title="Get in Touch"
        description="Have questions about our equipment? We're here to help. Contact our sales team for expert consultation."
      />

      {/* Contact Methods */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactMethods.map((method, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-accent text-4xl mb-4">
                  <method.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">
                  {method.title}
                </h3>
                <p className="text-accent font-semibold text-sm mb-2">
                  {method.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {method.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Send us a Message
            </h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-slate-200"
          >
            <ContactFormClient />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'What is the typical delivery time?',
                answer: 'Delivery times vary by location and product. Most orders ship within 2-4 weeks. International orders may take 4-8 weeks.',
              },
              {
                question: 'Do you offer financing options?',
                answer: 'Yes, we offer flexible financing options through our partner institutions. Contact our sales team for details.',
              },
              {
                question: 'What warranty do you provide?',
                answer: 'We provide comprehensive warranties on all equipment. Standard warranty is 2 years with options for extended coverage.',
              },
              {
                question: 'Can you provide custom specifications?',
                answer: 'Yes, we can customize equipment based on your specific requirements. Please contact our engineering team.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-accent transition-colors"
              >
                <h3 className="text-lg font-bold text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
