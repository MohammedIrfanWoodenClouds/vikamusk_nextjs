'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { urlForImage } from '@/lib/image-url'
import { motion } from 'framer-motion'
import { ChevronLeft, Download, Mail, Phone } from 'lucide-react'
import { PortableText } from '@portabletext/react'

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail]
  const mainImage = images[selectedImageIndex]
  const imageUrl = mainImage ? urlForImage(mainImage) : 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop'

  const brochureUrl = product.brochure?.asset?.url

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      >
        <Link
          href="/products"
          className="flex items-center gap-2 text-accent hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </motion.div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
        >
          {/* Image Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden bg-slate-100 shadow-lg">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images && images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => {
                  const thumbUrl = urlForImage(img)
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        selectedImageIndex === idx
                          ? 'ring-2 ring-accent'
                          : 'ring-1 ring-slate-200'
                      }`}
                    >
                      <Image
                        src={thumbUrl}
                        alt={`${product.title} view ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Title and Category */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Link
                href={`/products?category=${product.category.slug.current}`}
                className="text-accent font-semibold hover:underline"
              >
                {product.category.title}
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-primary">
                {product.title}
              </h1>
              {product.series && (
                <p className="text-lg text-muted-foreground">
                  Model: <span className="font-semibold">{product.series}</span>
                </p>
              )}
            </motion.div>

            {/* Description */}
            {product.description && (
              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {product.description}
              </motion.p>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-xl font-bold text-primary">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                    >
                      <p className="text-sm text-muted-foreground font-semibold">
                        {spec.label}
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pricing and Availability */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20"
            >
              <div>
                {product.price && (
                  <p className="text-lg text-muted-foreground mb-2">Price</p>
                )}
                {product.price ? (
                  <p className="text-2xl font-bold text-accent">{product.price}</p>
                ) : (
                  <p className="text-lg font-semibold text-accent">Contact for pricing</p>
                )}
              </div>
              <div className="mt-4 sm:mt-0">
                {product.availability && (
                  <span className="inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-primary">
                    {product.availability === 'in_stock' && 'In Stock'}
                    {product.availability === 'coming_soon' && 'Coming Soon'}
                    {product.availability === 'contact_sales' && 'Contact Sales'}
                  </span>
                )}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Request Quote
              </motion.button>

              {brochureUrl && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={brochureUrl}
                  download
                  className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Brochure
                </motion.a>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-slate-200 space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Questions about this product?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:sales@vikamusk.com"
                  className="flex items-center gap-2 px-4 py-2 hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  sales@vikamusk.com
                </a>
                <a
                  href="tel:+15551234567"
                  className="flex items-center gap-2 px-4 py-2 hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Full Description */}
        {product.fullDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-24 max-w-3xl space-y-8 prose prose-lg"
          >
            <h2 className="text-3xl font-bold text-primary">Product Details</h2>
            <div className="text-muted-foreground">
              <PortableText value={product.fullDescription} />
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}
