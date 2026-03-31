import { sanityFetch } from '@/lib/sanity'
import { GET_FEATURED_PRODUCTS, GET_ALL_CATEGORIES } from '@/lib/queries'
import { Hero } from '@/components/hero'
import { StatsSection } from '@/components/stats-section'
import { FeaturedProducts } from '@/components/featured-products'
import { CategoryShowcase } from '@/components/category-showcase'
import { Product, Category } from '@/types'
import { motion } from 'framer-motion'

export default async function Home() {
  // Fetch data in parallel
  const [featuredProducts, categories] = await Promise.all([
    sanityFetch<Product[]>({
      query: GET_FEATURED_PRODUCTS,
    }).catch(() => []),
    sanityFetch<Category[]>({
      query: GET_ALL_CATEGORIES,
    }).catch(() => []),
  ])

  const stats = [
    { value: '500+', label: 'Equipment Units' },
    { value: '50+', label: 'Countries Served' },
    { value: '20+', label: 'Years Experience' },
    { value: '1000+', label: 'Happy Clients' },
  ]

  return (
    <>
      {/* Hero Section */}
      <Hero
        subtitle="Premium Construction Equipment"
        title="Build the Future with Vikamusk"
        description="Industry-leading machinery and equipment for construction, mining, and heavy operations. Trusted by professionals worldwide."
        cta={{ label: 'View Products', href: '/products' }}
        secondaryCta={{ label: 'Get Quote', href: '/contact' }}
      />

      {/* Stats Section */}
      <StatsSection
        stats={stats}
        title="Why Choose Vikamusk?"
        description="We are committed to delivering excellence and innovation in construction equipment"
      />

      {/* Categories Section */}
      <CategoryShowcase categories={categories} />

      {/* Featured Products Section */}
      <FeaturedProducts products={featuredProducts} />

      {/* Global Presence Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Global Presence</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                With operations in over 50 countries, Vikamusk is your trusted partner for construction equipment. Our extensive network ensures fast delivery and responsive support worldwide.
              </p>

              <ul className="space-y-4">
                {[
                  'International shipping and logistics',
                  'Local service centers and support',
                  'Flexible financing options',
                  'Comprehensive warranty programs',
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-accent text-2xl">✓</span>
                    <span className="text-gray-200">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: '🌍', title: 'Global Network' },
                { icon: '🚀', title: 'Innovation' },
                { icon: '⚙️', title: 'Performance' },
                { icon: '✨', title: 'Quality' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-accent/10 transition-all duration-300"
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <p className="font-semibold">{item.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Ready to Find Your Equipment?
              </h2>
              <p className="text-lg text-muted-foreground">
                Contact our sales team for expert consultation and competitive pricing
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg"
              >
                Get in Touch
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-200"
              >
                Browse Catalog
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
