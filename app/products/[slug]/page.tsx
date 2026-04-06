'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Download, Mail, ChevronRight, Loader2 } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';

function normalizeProduct(p: any): any {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.main_category_name || '',
    categorySlug: p.main_category_slug || '',
    shortDescription: p.short_description || '',
    fullDescription: p.full_description || '',
    features: typeof p.features === 'string' ? (() => { try { return JSON.parse(p.features); } catch { return []; } })() : (p.features || []),
    specs: typeof p.specs === 'string' ? (() => { try { return JSON.parse(p.specs); } catch { return {}; } })() : (p.specs || {}),
    image: p.image || '',
    featured: !!p.featured,
    main_category_slug: p.main_category_slug,
    sub_category_name: p.sub_category_name,
    sub_category_slug: p.sub_category_slug,
    main_category_name: p.main_category_name,
  };
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.product) {
          const norm = normalizeProduct(data.product);
          setProduct(norm);
          // Fetch related
          fetch(`/api/public/products?main_category=${norm.main_category_slug}`)
            .then(r => r.json())
            .then(relData => {
              const related = (relData.products || [])
                .map(normalizeProduct)
                .filter((p: any) => p.slug !== slug)
                .slice(0, 3);
              setRelatedProducts(related);
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-4xl font-black text-primary mb-4">Product Not Found</h1>
          <p className="text-muted mb-6">The product you are looking for does not exist.</p>
          <Link href="/products" className="btn-primary"><ArrowLeft size={16} /> Back to Products</Link>
        </div>
      </div>
    );
  }

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
            <Link href={`/categories/${product.main_category_slug}`} className="hover:text-primary transition-colors">{product.category}</Link>
            {product.sub_category_name && (
              <>
                <ChevronRight size={14} />
                <Link href={`/categories/${product.main_category_slug}/${product.sub_category_slug}`} className="hover:text-primary transition-colors">{product.sub_category_name}</Link>
              </>
            )}
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative aspect-square bg-surface rounded-2xl overflow-hidden border border-border/50 sticky top-28">
              {product.image ? (
                product.image.startsWith('data:') ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-8" />
                ) : (
                  <Image src={product.image} alt={product.name} fill className="object-contain p-8" priority />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
              {product.featured && (
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent text-primary text-xs font-bold rounded-full uppercase tracking-wider">Featured</div>
              )}
            </motion.div>

            {/* Details */}
            <div>
              <AnimatedSection>
                <p className="text-sm font-bold text-accent uppercase tracking-wider mb-2">{product.category}</p>
                <h1 className="text-3xl lg:text-4xl font-black text-primary mb-6">{product.name}</h1>
                <p className="text-muted leading-relaxed text-lg mb-8">{product.fullDescription}</p>
              </AnimatedSection>

              {/* Specs */}
              <AnimatedSection delay={0.1}>
                <h3 className="text-lg font-bold text-primary mb-4">Technical Specifications</h3>
                <div className="bg-surface rounded-xl border border-border/50 overflow-hidden mb-8">
                  {Object.entries(product.specs).map(([key, value], i, arr) => (
                    <div key={key} className={`flex justify-between items-center px-6 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}>
                      <span className="text-sm font-medium text-muted">{key}</span>
                      <span className="text-sm font-bold text-primary">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Features */}
              <AnimatedSection delay={0.2}>
                <h3 className="text-lg font-bold text-primary mb-4">Key Features</h3>
                <div className="grid grid-cols-1 gap-2.5 mb-8">
                  {product.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={12} className="text-accent" /></div>
                      <span className="text-sm text-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* CTAs */}
              <AnimatedSection delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="btn-primary px-8"><Mail size={16} /> Request Quote</Link>
                  <a href="/vikamusk-company-profile.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline px-8"><Download size={16} /> Download Brochure</a>
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
              <Link href="/products" className="btn-outline text-sm py-2.5 px-5 hidden sm:inline-flex">View All <ArrowRight size={14} /></Link>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
