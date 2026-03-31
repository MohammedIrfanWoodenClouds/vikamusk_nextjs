'use client'

import { motion } from 'framer-motion'
import { Category } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/lib/image-url'
import { ArrowRight } from 'lucide-react'

interface CategoryShowcaseProps {
  categories: Category[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  if (categories.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Product Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive range of construction equipment for every project requirement
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, idx) => {
            const imageUrl = category.image
              ? urlForImage(category.image)
              : 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=400&fit=crop'

            return (
              <motion.div
                key={category._id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href={`/products?category=${category.slug.current}`}>
                  <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={imageUrl}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {category.title}
                      </h3>
                      {category.description && (
                        <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-accent font-semibold"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
