'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Download, Mail, ChevronRight } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';
import { getProductBySlug, getProductsByCategory } from '@/lib/data';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-4xl font-black text-primary mb-4">Product Not Found</h1>
          <p className="text-muted mb-6">The product you are looking for does not exist.</p>
          <Link href="/products" className="btn-primary">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border py-3">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight size={14} />
            <Link href={`/products?category=${product.categorySlug}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square bg-surface rounded-2xl overflow-hidden border border-border/50 sticky top-28"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
              {product.featured && (
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  Featured
                </div>
              )}
            </motion.div>

            {/* Details */}
            <div>
              <AnimatedSection>
                <p className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl lg:text-4xl font-black text-primary mb-6">
                  {product.name}
                </h1>
                <p className="text-muted leading-relaxed text-lg mb-8">
                  {product.fullDescription}
                </p>
              </AnimatedSection>

              {/* Key Specs */}
              <AnimatedSection delay={0.1}>
                <h3 className="text-lg font-bold text-primary mb-4">Technical Specifications</h3>
                <div className="bg-surface rounded-xl border border-border/50 overflow-hidden mb-8">
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex justify-between items-center px-6 py-3.5 ${
                        i < Object.entries(product.specs).length - 1 ? 'border-b border-border/50' : ''
                      }`}
                    >
                      <span className="text-sm font-medium text-muted">{key}</span>
                      <span className="text-sm font-bold text-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Features */}
              <AnimatedSection delay={0.2}>
                <h3 className="text-lg font-bold text-primary mb-4">Key Features</h3>
                <div className="grid grid-cols-1 gap-2.5 mb-8">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-accent" />
                      </div>
                      <span className="text-sm text-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* CTAs */}
              <AnimatedSection delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="btn-primary px-8">
                    <Mail size={16} /> Request Quote
                  </Link>
                  <a href="/vikamusk-company-profile.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline px-8">
                    <Download size={16} /> Download Brochure
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-custom">
            <AnimatedSection className="flex justify-between items-end mb-12">
              <div>
                <span className="text-sm font-bold text-accent uppercase tracking-wider">More Equipment</span>
                <h2 className="text-3xl font-black text-primary mt-3">Related Products</h2>
              </div>
              <Link href="/products" className="btn-outline text-sm py-2.5 px-5 hidden sm:inline-flex">
                View All <ArrowRight size={14} />
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
