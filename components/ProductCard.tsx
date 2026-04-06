'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    categorySlug: string;
    shortDescription: string;
    specs: Record<string, string>;
    image: string;
    featured: boolean;
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isBase64 = product.image?.startsWith('data:');

  const specEntries = Object.entries(product.specs || {}).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/25 transition-all duration-300 h-full"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.image ? (
            isBase64 ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-7 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-7 group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-sm font-medium">
              No Image
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1 bg-accent text-[#001f3f] text-[10px] font-black rounded-full uppercase tracking-wider shadow-md shadow-amber-500/30">
              <Star size={9} fill="currentColor" />
              Featured
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] font-bold text-accent/80 uppercase tracking-widest mb-2">{product.category}</p>
          )}

          {/* Name */}
          <h3 className="text-base font-black text-gray-900 mb-2 group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">{product.shortDescription}</p>
          )}

          {/* Quick Specs */}
          {specEntries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {specEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 font-semibold truncate max-w-[140px]"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-accent transition-colors mt-auto pt-3 border-t border-gray-50">
            View Details
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
