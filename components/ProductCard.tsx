'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/data';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(5px)', scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 transform hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 md:p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {product.featured && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-[#001f3f] text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[11px] font-bold text-accent uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
              <span key={key} className="text-[11px] px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-gray-600 font-semibold truncate max-w-full">
                {key}: {value}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center text-sm font-bold text-[#001f3f] group-hover:text-accent transition-colors">
            View Details
            <motion.span
              className="ml-2 inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
