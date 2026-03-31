'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/data';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block bg-white rounded-2xl border border-border/60 overflow-hidden hover-lift"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-surface overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {product.featured && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
              <span key={key} className="text-xs px-2 py-1 bg-surface rounded-full text-muted font-medium truncate max-w-full">
                {key}: {value}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center text-sm font-semibold text-accent group-hover:gap-3 gap-1.5 transition-all">
            View Details
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
