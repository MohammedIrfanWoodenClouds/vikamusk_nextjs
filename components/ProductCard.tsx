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
    model_names?: string[];
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isBase64 = product.image?.startsWith('data:');
  const specEntries = Object.entries(product.specs || {}).slice(0, 2);
  const modelNames = product.model_names || [];

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
        className="group flex flex-col h-full bg-white rounded-[2rem] border-2 border-black shadow-[0_5px_0_#000] hover:shadow-[0_2px_0_#000] hover:translate-y-0.5 transition-all duration-300 overflow-hidden"
      >
        {/* Image Box */}
        <div className="relative h-[480px] sm:h-[550px] w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(135deg,rgba(245,158,11,0.06)_0%,transparent_50%)] pointer-events-none" />
          {product.image ? (
            isBase64 ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-12 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-12 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <Zap size={64} className="opacity-10" />
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent text-[#001f3f] text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl">
              <Star size={10} fill="currentColor" className="inline mr-1" /> Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="w-full bg-white z-10 relative pt-4 px-8" style={{ paddingBottom: '2.5rem' }}>
          
          {/* Name Container */}
          <div className="w-full text-center flex flex-col items-center" style={{ marginBottom: '1.25rem', marginTop: '1.25rem' }}>
            {product.category && (
               <p className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-2">{product.category}</p>
            )}
            <h3 className="text-[22px] sm:text-[26px] font-black text-black leading-tight line-clamp-2 px-4 uppercase">
              {product.name}
            </h3>
            {modelNames.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-3 px-4">
                {modelNames.slice(0, 4).map((name) => (
                  <span key={name} className="text-[10px] px-2.5 py-1 rounded-full font-bold border border-black/10 text-black/50 bg-gray-50 uppercase tracking-wide">
                    {name}
                  </span>
                ))}
                {modelNames.length > 4 && (
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold border border-black/10 text-black/40 bg-gray-50">
                    +{modelNames.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Button Container */}
          <div className="w-full flex justify-center items-center">
            <span className="flex items-center justify-center w-[92%] py-3.5 bg-accent text-white border-2 border-black rounded-xl text-sm sm:text-[15px] font-black uppercase tracking-wider shadow-[0_4px_0_#000] hover:translate-y-0.5 hover:shadow-[0_2px_0_#000] transition-all duration-200">
              Explore Equipment <ArrowRight size={18} className="ml-2" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
