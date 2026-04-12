'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

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

function parseImages(raw: string): [string, string] {
  if (!raw) return ['', ''];
  if (raw.startsWith('[')) {
    try {
      const arr = JSON.parse(raw);
      return [arr[0] || '', arr[1] || ''];
    } catch {
      return [raw, ''];
    }
  }
  return [raw, ''];
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [primaryImage, secondaryImage] = parseImages(product.image);
  const modelNames = product.model_names || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex-1 flex flex-col"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex-1 flex flex-col h-full bg-white rounded-[2rem] border-2 border-black shadow-[0_5px_0_#000] transition-all duration-300 overflow-hidden"
      >
        {/* Image Box */}
        <div className="relative h-[280px] sm:h-[320px] w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center shrink-0 overflow-hidden">

          {primaryImage ? (
            primaryImage.startsWith('data:') ? (
              /* ── Base64: plain <img> stack ── */
              <>
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="primary-img absolute inset-0 w-full h-full object-contain p-10 transition-all duration-500 ease-out"
                  style={{ zIndex: 1 }}
                />
                {secondaryImage && (
                  <img
                    src={secondaryImage}
                    alt={`${product.name} – alternate view`}
                    className="secondary-img absolute inset-0 w-full h-full object-contain p-10 opacity-0 transition-all duration-500 ease-out"
                    style={{ zIndex: 2 }}
                  />
                )}
              </>
            ) : (
              /* ── URL: Next/Image stack ── */
              <>
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-contain p-10 transition-all duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ zIndex: 1 }}
                />
                {secondaryImage && (
                  <Image
                    src={secondaryImage}
                    alt={`${product.name} – alternate view`}
                    fill
                    className="object-contain p-10 opacity-0 transition-all duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ zIndex: 2 }}
                  />
                )}
              </>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <Zap size={64} className="opacity-10" />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-[2px] w-full bg-black shrink-0" />

        {/* Content */}
        <div className="w-full bg-white relative pt-5 px-8 flex-1 flex flex-col" style={{ paddingBottom: '2.5rem' }}>

          {/* Name Container */}
          <div className="w-full text-center flex flex-col items-center" style={{ marginBottom: '1.25rem' }}>
            {product.category && (
              <p className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-2">{product.category}</p>
            )}
            <h3 className="text-[22px] sm:text-[26px] font-black text-black leading-tight line-clamp-2 px-4 uppercase min-h-[56px] sm:min-h-[66px] flex items-center justify-center">
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
          <div className="w-full flex justify-center items-center mt-auto">
            <span className="flex items-center justify-center w-[92%] py-3.5 bg-accent text-white border-2 border-black rounded-xl text-sm sm:text-[15px] font-black uppercase tracking-wider shadow-[0_4px_0_#000] transition-all duration-200">
              Explore Equipment <ArrowRight size={18} className="ml-2" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
