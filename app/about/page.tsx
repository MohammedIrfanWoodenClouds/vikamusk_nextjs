import { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { motion } from 'framer-motion'
import { Award, Users, Globe, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Vikamusk | Leading Construction Equipment Provider',
  description: 'Learn about Vikamusk, a trusted provider of quality construction equipment and machinery worldwide.',
}

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Quality',
      description: 'We deliver premium construction equipment that meets international standards.',
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority with dedicated support and service.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Operating in 50+ countries with local expertise and international standards.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuously advancing our products with latest technology and engineering.',
    },
  ]

  const timeline = [
    {
      year: '2004',
      title: 'Company Founded',
      description: 'Vikamusk was established with a vision to provide quality construction equipment.',
    },
    {
      year: '2010',
      title: 'Expansion Begins',
      description: 'Expanded operations to international markets across Asia and Europe.',
    },
    {
      year: '2016',
      title: 'Innovation Hub',
      description: 'Launched R&D center focused on sustainable construction solutions.',
    },
    {
      year: '2024',
      title: 'Global Leader',
      description: 'Recognized as a trusted provider serving 50+ countries worldwide.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="Our Story"
        title="Building Excellence Since 2004"
        description="From humble beginnings to global leadership, Vikamusk has been committed to delivering quality construction equipment and exceptional customer service."
      />

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
                <div className="h-1 w-12 bg-accent rounded" />
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide innovative, reliable, and sustainable construction equipment solutions that empower our customers to build better, safer, and more efficient projects worldwide.
              </p>
              <ul className="space-y-3">
                {['Deliver superior quality equipment', 'Ensure customer satisfaction', 'Promote sustainable practices', 'Drive continuous innovation'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-accent text-lg mt-1">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary">Our Vision</h2>
                <div className="h-1 w-12 bg-accent rounded" />
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To be the world's most trusted provider of construction equipment, recognized for innovation, reliability, and commitment to customer success across all continents.
              </p>
              <ul className="space-y-3">
                {['Global industry leader', 'Advanced technology integration', 'Sustainable equipment solutions', 'Exceptional customer experience'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-accent text-lg mt-1">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200"
              >
                <div className="text-accent text-4xl mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              20 years of innovation and growth
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 md:gap-8"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-bold font-mono">
                    {idx + 1}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-1 h-24 bg-accent/20 mt-2" />
                  )}
                </div>

                <div className="pb-8 flex-1">
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-accent transition-colors">
                    <p className="text-accent font-bold text-lg mb-2">{item.year}</p>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Expert Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Experienced professionals dedicated to delivering excellence in every project
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'John Smith', role: 'CEO & Founder' },
                { name: 'Sarah Johnson', role: 'VP Operations' },
                { name: 'Michael Chen', role: 'Chief Technology Officer' },
              ].map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-slate-200"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent font-semibold">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
