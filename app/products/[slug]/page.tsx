'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Download, Mail, ChevronRight,
  Loader2, Star, Share2, Package, Wrench, FileText, ZoomIn,
} from 'lucide-react';
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

type Tab = 'overview' | 'specs' | 'features';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [imageZoomed, setImageZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/public/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.product) {
          const norm = normalizeProduct(data.product);
          setProduct(norm);
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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product?.name, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center max-w-md px-6">
          <Package size={56} className="text-gray-200 mx-auto mb-5" />
          <h1 className="text-3xl font-black text-primary mb-3">Product Not Found</h1>
          <p className="text-muted mb-8 text-sm">The product you're looking for doesn't exist or may have been removed.</p>
          <Link href="/products" className="btn-primary">
            <ArrowLeft size={15} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText size={14} /> },
    { id: 'specs', label: 'Specifications', icon: <Wrench size={14} />, count: Object.keys(product.specs || {}).length },
    { id: 'features', label: 'Features', icon: <Check size={14} />, count: (product.features || []).length },
  ];

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-border/60 py-3 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-muted overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <Link href="/products" className="hover:text-primary transition-colors font-medium">Products</Link>
            {product.category && (
              <>
                <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                <Link href={`/categories/${product.main_category_slug}`} className="hover:text-primary transition-colors font-medium">{product.category}</Link>
              </>
            )}
            {product.sub_category_name && (
              <>
                <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                <Link href={`/categories/${product.main_category_slug}/${product.sub_category_slug}`} className="hover:text-primary transition-colors font-medium">{product.sub_category_name}</Link>
              </>
            )}
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <span className="text-primary font-semibold truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ─── Product Hero ─── */}
      <section className="bg-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* ── Left: Image ── */}
            <div className="lg:sticky lg:top-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
                className="relative"
              >
                {/* Main image card */}
                <div
                  className="relative aspect-square bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in group"
                  onClick={() => setImageZoomed(true)}
                >
                  {product.image ? (
                    product.image.startsWith('data:') ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-10" />
                    ) : (
                      <Image src={product.image} alt={product.name} fill className="object-contain p-10" priority />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-200">
                      <Package size={64} />
                      <span className="text-sm">No Image Available</span>
                    </div>
                  )}

                  {/* Featured badge */}
                  {product.featured && (
                    <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 bg-accent text-[#001f3f] text-xs font-black rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/25">
                      <Star size={11} fill="currentColor" /> Featured
                    </div>
                  )}

                  {/* Zoom hint */}
                  {product.image && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ZoomIn size={11} /> Click to zoom
                    </div>
                  )}
                </div>

                {/* Category label below image */}
                {product.category && (
                  <div className="mt-4 flex items-center justify-center">
                    <Link
                      href={`/categories/${product.main_category_slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {product.category}
                      {product.sub_category_name && ` › ${product.sub_category_name}`}
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ── Right: Details ── */}
            <div>
              <AnimatedSection>
                <h1 className="text-3xl lg:text-[40px] font-black text-primary leading-tight mb-4">
                  {product.name}
                </h1>
                {product.shortDescription && (
                  <p className="text-base text-muted leading-relaxed mb-8 border-l-4 border-accent/30 pl-4 bg-surface/50 py-2 pr-3 rounded-r-xl">
                    {product.shortDescription}
                  </p>
                )}
              </AnimatedSection>

              {/* ── Tabs ── */}
              <AnimatedSection delay={0.1}>
                <div className="flex gap-0 bg-surface rounded-xl p-1 mb-6 border border-border/50">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-primary shadow-sm shadow-black/5'
                          : 'text-muted hover:text-primary'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                          activeTab === tab.id ? 'bg-accent/15 text-accent' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-[160px]"
                    >
                      {product.fullDescription ? (
                        <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{product.fullDescription}</p>
                      ) : (
                        <p className="text-sm text-muted italic">No detailed description available.</p>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'specs' && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-[160px]"
                    >
                      {Object.keys(product.specs || {}).length === 0 ? (
                        <p className="text-sm text-muted italic py-4">No specifications available.</p>
                      ) : (
                        <div className="rounded-xl border border-border/60 overflow-hidden">
                          {Object.entries(product.specs).map(([key, value], i, arr) => (
                            <div
                              key={key}
                              className={`flex justify-between items-center px-5 py-3 ${
                                i % 2 === 0 ? 'bg-surface/60' : 'bg-white'
                              } ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}
                            >
                              <span className="text-xs font-semibold text-muted">{key}</span>
                              <span className="text-xs font-bold text-primary ml-4 text-right">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-[160px]"
                    >
                      {(product.features || []).length === 0 ? (
                        <p className="text-sm text-muted italic py-4">No features listed.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {product.features.map((feature: string, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/30"
                            >
                              <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check size={11} className="text-accent" strokeWidth={3} />
                              </div>
                              <span className="text-sm text-muted leading-snug">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimatedSection>

              {/* ── CTAs ── */}
              <AnimatedSection delay={0.25} className="mt-8">
                <div className="bg-surface rounded-2xl border border-border/50 p-5">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Ready to order?</p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Link href="/contact" className="btn-primary flex-1 py-3.5 text-sm justify-center">
                      <Mail size={15} /> Request a Quote
                    </Link>
                    <a
                      href="/vikamusk-company-profile.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline flex-1 py-3.5 text-sm justify-center"
                    >
                      <Download size={15} /> Download Brochure
                    </a>
                  </div>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-muted hover:text-primary transition-colors py-2"
                  >
                    <Share2 size={13} />
                    {copied ? 'Link copied!' : 'Share this product'}
                  </button>
                </div>
              </AnimatedSection>

              {/* ── Back link ── */}
              <div className="mt-5">
                <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors">
                  <ArrowLeft size={13} /> Back to all products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {imageZoomed && product.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setImageZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl aspect-square bg-white/5 rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {product.image.startsWith('data:') ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : (
                <Image src={product.image} alt={product.name} fill className="object-contain p-8" />
              )}
              <button
                onClick={() => setImageZoomed(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-custom">
            <AnimatedSection className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest">More From This Category</span>
                <h2 className="text-2xl lg:text-3xl font-black text-primary mt-3">Related Products</h2>
              </div>
              <Link href={`/products?category=${product.main_category_slug}`} className="btn-outline text-xs py-2 px-4 hidden sm:inline-flex">
                View All <ArrowRight size={13} />
              </Link>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {relatedProducts.map((p, i) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} index={i} />
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="text-center mt-10 sm:hidden">
              <Link href={`/products?category=${product.main_category_slug}`} className="btn-outline text-sm">
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Bottom CTA ─── */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="container-custom text-center">
          <AnimatedSection>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Let's Work Together</span>
            <h2 className="text-2xl lg:text-3xl font-black text-white mt-3 mb-4">Interested in {product.name}?</h2>
            <p className="text-white/50 max-w-md mx-auto text-sm mb-8 leading-relaxed">
              Our specialists will help you choose the right configuration and get a competitive quote for your project.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                <Mail size={15} /> Get a Quote
              </Link>
              <Link href="/products" className="btn-secondary">
                Browse More Products
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
