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
        className="group flex flex-col h-full bg-white rounded-[2rem] border border-gray-200/80 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/40 overflow-hidden"
      >
        {/* Image Box */}
        <div className="relative h-[450px] sm:h-[500px] w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(135deg,rgba(245,158,11,0.06)_0%,transparent_50%)] pointer-events-none" />
          {product.image ? (
            isBase64 ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Zap size={52} className="text-gray-200" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="w-full bg-white z-10 relative pt-2 px-6" style={{ paddingBottom: '2rem' }}>
          
          {/* Name Container */}
          <div className="w-full text-center flex flex-col items-center" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
            <h3 className="text-xl sm:text-2xl font-black text-black leading-tight line-clamp-2">
              {product.name}
            </h3>
            {product.category && (
               <p className="text-xs font-bold text-accent uppercase tracking-widest mt-2">{product.category}</p>
            )}
          </div>
          
          {/* Button Container */}
          <div className="w-full flex justify-center items-center">
            <span className="flex items-center justify-center w-[85%] py-3.5 bg-[#f59e0b] text-white border border-black rounded-full text-sm sm:text-base font-black uppercase tracking-wider shadow-[0_3px_0_rgba(0,0,0,1)] hover:bg-[#d97706] hover:translate-y-1 hover:shadow-none transition-all duration-300">
              View Product
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
