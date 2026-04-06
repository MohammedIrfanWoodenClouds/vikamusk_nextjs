'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap } from 'lucide-react';

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
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-[0_1px_0_rgba(0,31,63,0.04)] ring-1 ring-black/[0.03] hover:shadow-xl hover:shadow-primary/[0.08] hover:border-accent/25 hover:-translate-y-0.5 transition-all duration-300 h-full"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
          {product.image ? (
            isBase64 ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-7 group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-7 group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Zap size={40} className="text-gray-200" />
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1 bg-accent text-[#001f3f] text-[10px] font-black rounded-full uppercase tracking-wider shadow-md shadow-amber-500/25">
              <Star size={9} fill="currentColor" />
              Featured
            </div>
          )}

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* View details on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
              View Details <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          {/* Category tag */}
          {product.category && (
            <p className="text-[10px] font-bold text-accent/90 uppercase tracking-widest mb-2">{product.category}</p>
          )}

          {/* Name */}
          <h3 className="text-sm font-black text-gray-900 mb-2 group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 flex-1">{product.shortDescription}</p>
          )}

          {/* Quick Specs */}
          {specEntries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {specEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="text-[10px] px-2 py-0.5 bg-surface border border-gray-100 rounded-full text-gray-500 font-semibold truncate max-w-[140px]"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}

          {/* CTA row — category already shown above; avoid duplicate / overlap */}
          <div className="flex items-center justify-start pt-3 border-t border-gray-100 mt-auto">
            <span className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-accent transition-colors">
              View details
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
