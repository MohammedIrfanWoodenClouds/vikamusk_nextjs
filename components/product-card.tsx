'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { urlForImage } from '@/lib/image-url'
import { ArrowRight } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.thumbnail
    ? urlForImage(product.thumbnail)
    : 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=500&fit=crop'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group h-full"
    >
      <Link href={`/products/${product.slug.current}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden bg-slate-100">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Category */}
            <p className="text-accent text-sm font-semibold mb-2">
              {product.category.title}
            </p>

            {/* Title */}
            <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              {product.title}
            </h3>

            {/* Series */}
            {product.series && (
              <p className="text-sm text-muted-foreground mb-3">
                Model: {product.series}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                {product.description}
              </p>
            )}

            {/* Price/Availability */}
            <div className="mt-auto pt-4 border-t border-slate-200">
              {product.price && (
                <p className="text-accent font-semibold mb-3">{product.price}</p>
              )}

              {/* CTA */}
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all duration-300"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
