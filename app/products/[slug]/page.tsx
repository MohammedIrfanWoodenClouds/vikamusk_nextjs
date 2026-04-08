'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Download, Mail, ChevronRight,
  Loader2, Star, Share2, Package, Wrench, FileText, ZoomIn, LayoutGrid,
} from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';

interface ProductModel {
  id: string;
  product_id: string;
  model_name: string;
  specs: { label: string; value: string }[];
  images: string[];
  sort_order: number;
}

function normalizeProduct(p: any): any {
  let mainImg = p.image || '';
  let imgList: string[] = [];
  if (mainImg && mainImg.startsWith('[')) {
    try {
      imgList = JSON.parse(mainImg);
      mainImg = imgList[0] || '';
    } catch {
      imgList = [mainImg];
    }
  } else if (mainImg) {
    imgList = [mainImg];
  }

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.main_category_name || p.category_name || '',
    categorySlug: p.main_category_slug || p.category_slug || '',
    shortDescription: p.short_description || '',
    fullDescription: p.full_description || '',
    features: typeof p.features === 'string' ? (() => { try { return JSON.parse(p.features); } catch { return []; } })() : (p.features || []),
    specs: typeof p.specs === 'string' ? (() => { try { return JSON.parse(p.specs); } catch { return {}; } })() : (p.specs || {}),
    images: imgList,
    image: mainImg,
    brochure_url: p.brochure_url || '',
    featured: !!p.featured,
    main_category_slug: p.main_category_slug || p.category_slug,
    main_category_name: p.main_category_name || p.category_name,
    model_names: Array.isArray(p.model_names) ? p.model_names : [],
  };
}

type Tab = 'overview' | 'specs' | 'models' | 'features';

/* ── Single Model Card ── */
function ModelCard({ model, isActive, onClick }: { model: ProductModel; isActive: boolean; onClick: () => void }) {
  const images = model.images || [];
  const [imgIdx, setImgIdx] = useState(0);
  const displayImg = images[imgIdx] || '';

  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-2xl overflow-hidden border-2 transition-all"
      style={{ borderColor: isActive ? '#f59e0b' : 'rgba(0,31,63,0.1)', background: isActive ? 'rgba(245,158,11,0.04)' : '#fff' }}
    >
      {/* Model image */}
      <div className="relative h-40 bg-gradient-to-br from-gray-50 to-slate-100 overflow-hidden">
        {displayImg ? (
          displayImg.startsWith('data:') ? (
            <img src={displayImg} alt={model.model_name} className="w-full h-full object-contain p-4" />
          ) : (
            <Image src={displayImg} alt={model.model_name} fill className="object-contain p-4" sizes="200px" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <Package size={36} className="opacity-30" />
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === imgIdx ? '#f59e0b' : 'rgba(0,0,0,0.2)' }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="font-black text-primary text-sm">{model.model_name}</p>
        {model.specs?.length > 0 && (
          <p className="text-[11px] text-muted mt-0.5">{model.specs.length} specifications</p>
        )}
      </div>
    </button>
  );
}

/* ── Model Spec Comparison Table ── */
function SpecTable({ models }: { models: ProductModel[] }) {
  if (models.length === 0) return (
    <p className="text-sm text-muted italic py-4">No model specifications have been added yet.</p>
  );

  const allLabels = Array.from(
    new Set(models.flatMap(m => (m.specs || []).map(s => s.label)))
  );

  if (allLabels.length === 0) return (
    <p className="text-sm text-muted italic py-4">Models exist but have no spec data yet.</p>
  );

  const getValue = (model: ProductModel, label: string) =>
    model.specs?.find(s => s.label === label)?.value ?? '—';

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 shadow-sm">
      <table className="w-full text-sm border-collapse min-w-[400px]">
        <thead>
          <tr style={{ background: '#001f3f' }}>
            <th className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wider text-white/80 sticky left-0 min-w-[150px]" style={{ background: '#001f3f' }}>
              Specification
            </th>
            {models.map(m => (
              <th key={m.id} className="px-5 py-4 font-bold text-xs text-center whitespace-nowrap min-w-[130px] text-white">
                {m.model_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allLabels.map((label, i) => (
            <tr key={label} className={i % 2 === 0 ? 'bg-surface/60' : 'bg-white'}>
              <td className="px-5 py-3 font-semibold text-muted text-xs border-r border-border/40 sticky left-0 bg-inherit">
                {label}
              </td>
              {models.map(m => (
                <td key={m.id} className="px-5 py-3 text-center font-bold text-primary text-xs">
                  {getValue(m, label)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [models, setModels] = useState<ProductModel[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeImage, setActiveImage] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.product) {
          const norm = normalizeProduct(data.product);
          setProduct(norm);
          setModels(data.models || []);

          const catSlug = norm.main_category_slug || norm.categorySlug;
          if (catSlug) {
            fetch(`/api/public/products?main_category=${catSlug}`)
              .then(r => r.json())
              .then(relData => {
                const related = (relData.products || [])
                  .map(normalizeProduct)
                  .filter((p: any) => p.slug !== slug)
                  .slice(0, 3);
                setRelatedProducts(related);
              }).catch(() => {});
          }
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
          <p className="text-muted mb-8 text-sm">This product does not exist or has been removed.</p>
          <Link href="/products" className="btn-primary">
            <ArrowLeft size={15} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Build image list
  const imageList: string[] = product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
  const currentImage = imageList[activeImage] || '';

  const specsCount = Object.keys(product.specs || {}).length;
  const featuresCount = (product.features || []).length;
  const modelsCount = models.length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText size={14} /> },
    ...(modelsCount > 0 ? [{ id: 'models' as Tab, label: 'Models & Specs', icon: <LayoutGrid size={14} />, count: modelsCount }] : []),
    ...(specsCount > 0 ? [{ id: 'specs' as Tab, label: 'Specifications', icon: <Wrench size={14} />, count: specsCount }] : []),
    { id: 'features', label: 'Features', icon: <Check size={14} />, count: featuresCount },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border/60 py-3 sticky top-[64px] lg:top-[72px] xl:top-[104px] z-30 backdrop-blur-sm bg-white/95 mt-[88px] lg:mt-[104px]">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-muted overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <Link href="/products" className="hover:text-primary transition-colors font-medium">Products</Link>
            {product.category && (
              <>
                <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                <Link href={`/categories/${product.main_category_slug}`} className="hover:text-primary transition-colors font-medium">{product.category}</Link>
              </>
            )}
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
            <span className="text-primary font-semibold truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero */}
      <section className="bg-white pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* Left: Image Gallery */}
            <div className="lg:sticky lg:top-24">
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                {/* Main image */}
                <div
                  className="relative aspect-square bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in group"
                  onClick={() => currentImage && setImageZoomed(true)}
                >
                  {currentImage ? (
                    currentImage.startsWith('data:') ? (
                      <img src={currentImage} alt={product.name} className="w-full h-full object-contain p-10" />
                    ) : (
                      <Image src={currentImage} alt={product.name} fill className="object-contain p-10" priority />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-200">
                      <Package size={64} /><span className="text-sm">No Image Available</span>
                    </div>
                  )}

                  {product.featured && (
                    <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-full uppercase tracking-wider shadow-lg" style={{ background: '#f59e0b', color: '#001f3f' }}>
                      <Star size={11} fill="currentColor" /> Featured
                    </div>
                  )}

                  {currentImage && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={11} /> Click to zoom
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {imageList.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {imageList.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
                        style={{ borderColor: activeImage === i ? '#f59e0b' : '#e2e8f0' }}
                      >
                        {img.startsWith('data:') ? (
                          <img src={img} alt="" className="w-full h-full object-contain p-1" />
                        ) : (
                          <Image src={img} alt="" width={64} height={64} className="object-contain p-1" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {product.category && (
                  <div className="mt-4 flex justify-center">
                    <Link href={`/categories/${product.main_category_slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {product.category}
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Details */}
            <div>
              <AnimatedSection>
                <h1 className="text-3xl lg:text-[40px] font-black text-primary leading-tight mb-4">{product.name}</h1>
                {product.shortDescription && (
                  <p className="text-base text-muted leading-relaxed mb-8 border-l-4 pl-4 py-2 pr-3 rounded-r-xl" style={{ borderColor: '#f59e0b', background: '#fefce8' }}>
                    {product.shortDescription}
                  </p>
                )}
              </AnimatedSection>

              {/* Tabs */}
              <AnimatedSection delay={0.1}>
                <div className="flex gap-1 bg-surface rounded-xl p-1 mb-6 border border-border/50 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
                      style={activeTab === tab.id
                        ? { background: '#fff', color: '#001f3f', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                        : { color: '#64748b' }}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.5 text-[10px] rounded-full font-bold"
                          style={activeTab === tab.id
                            ? { background: 'rgba(245,158,11,0.15)', color: '#d97706' }
                            : { background: '#f1f5f9', color: '#94a3b8' }}
                        >{tab.count}</span>
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="min-h-[160px]">
                      {product.fullDescription
                        ? <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{product.fullDescription}</p>
                        : <p className="text-sm text-muted italic">No detailed description available.</p>
                      }
                    </motion.div>
                  )}

                  {activeTab === 'models' && (
                    <motion.div key="models" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="min-h-[160px]">
                      {/* Model cards grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        {models.map(m => (
                          <ModelCard
                            key={m.id}
                            model={m}
                            isActive={activeModelId === m.id}
                            onClick={() => setActiveModelId(activeModelId === m.id ? null : m.id)}
                          />
                        ))}
                      </div>

                      {/* Selected model spec detail */}
                      {activeModelId && (() => {
                        const sel = models.find(m => m.id === activeModelId);
                        if (!sel || !sel.specs?.length) return null;
                        return (
                          <div className="mb-5 rounded-xl border border-accent/30 overflow-hidden">
                            <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: 'rgba(245,158,11,0.08)' }}>
                              <LayoutGrid size={13} className="text-accent" />
                              <span className="text-xs font-black text-primary uppercase tracking-wider">{sel.model_name} — Specifications</span>
                            </div>
                            {sel.specs.map((s, i, arr) => (
                              <div key={i} className={`flex justify-between items-center px-4 py-2.5 ${i % 2 === 0 ? 'bg-surface/60' : 'bg-white'} ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}>
                                <span className="text-xs font-semibold text-muted">{s.label}</span>
                                <span className="text-xs font-bold text-primary ml-4 text-right">{s.value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Comparison table */}
                      {models.some(m => m.specs?.length > 0) && (
                        <>
                          <p className="text-xs text-muted mb-2 font-medium">Side-by-side comparison</p>
                          <SpecTable models={models} />
                        </>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'specs' && (
                    <motion.div key="specs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="min-h-[160px]">
                      {specsCount === 0
                        ? <p className="text-sm text-muted italic py-4">No specifications available.</p>
                        : (
                          <div className="rounded-xl border border-border/60 overflow-hidden">
                            {Object.entries(product.specs).map(([key, value], i, arr) => (
                              <div key={key} className={`flex justify-between items-center px-5 py-3 ${i % 2 === 0 ? 'bg-surface/60' : 'bg-white'} ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}>
                                <span className="text-xs font-semibold text-muted">{key}</span>
                                <span className="text-xs font-bold text-primary ml-4 text-right">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div key="features" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="min-h-[160px]">
                      {featuresCount === 0
                        ? <p className="text-sm text-muted italic py-4">No features listed.</p>
                        : (
                          <div className="grid grid-cols-1 gap-2">
                            {product.features.map((feature: string, i: number) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/30"
                              >
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(245,158,11,0.15)' }}>
                                  <Check size={11} className="text-accent" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-muted leading-snug">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        )
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimatedSection>

              {/* CTAs */}
              <AnimatedSection delay={0.25} className="mt-8">
                <div className="bg-surface rounded-2xl border border-border/50 p-5">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Ready to order?</p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-primary flex-1 py-3.5 text-sm justify-center">
                      <Mail size={15} /> Request a Quote
                    </Link>
                    {product.brochure_url ? (
                      <a href={product.brochure_url} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 py-3.5 text-sm justify-center">
                        <Download size={15} /> Download Brochure
                      </a>
                    ) : (
                      <a href="/vikamusk-company-profile.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 py-3.5 text-sm justify-center">
                        <Download size={15} /> Company Profile
                      </a>
                    )}
                  </div>
                  <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-muted hover:text-primary transition-colors py-2">
                    <Share2 size={13} /> {copied ? 'Link copied!' : 'Share this product'}
                  </button>
                </div>
              </AnimatedSection>

              <div className="mt-5">
                <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors">
                  <ArrowLeft size={13} /> Back to all products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width spec table for many models */}
      {models.length > 2 && (
        <section className="section-padding bg-surface border-t border-border/50">
          <div className="container-custom">
            <AnimatedSection className="mb-10">
              <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: '#f59e0b' }}>Technical Data</span>
              <h2 className="text-2xl lg:text-3xl font-black text-primary">Full Model Comparison</h2>
              <p className="text-muted text-sm mt-2">Scroll horizontally to compare all models</p>
            </AnimatedSection>
            <SpecTable models={models} />
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {imageZoomed && currentImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setImageZoomed(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl aspect-square rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              onClick={e => e.stopPropagation()}
            >
              {currentImage.startsWith('data:')
                ? <img src={currentImage} alt={product.name} className="w-full h-full object-contain p-8" />
                : <Image src={currentImage} alt={product.name} fill className="object-contain p-8" />
              }
              <button onClick={() => setImageZoomed(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-custom">
            <AnimatedSection className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>More From This Category</span>
                <h2 className="text-2xl lg:text-3xl font-black text-primary mt-3">Related Products</h2>
              </div>
              <Link href={`/products?category=${product.main_category_slug}`} className="btn-outline text-xs py-2 px-4 hidden sm:inline-flex">
                View All <ArrowRight size={13} />
              </Link>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {relatedProducts.map((p, i) => (
                <StaggerItem key={p.id}><ProductCard product={p} index={i} /></StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 lg:py-20" style={{ background: '#001f3f' }}>
        <div className="container-custom text-center">
          <AnimatedSection>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Let's Work Together</span>
            <h2 className="text-2xl lg:text-3xl font-black text-white mt-3 mb-4">Interested in {product.name}?</h2>
            <p className="text-white/50 max-w-md mx-auto text-sm mb-8 leading-relaxed">
              Our specialists will help you choose the right configuration and get a competitive quote.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary"><Mail size={15} /> Get a Quote</Link>
              <Link href="/products" className="btn-secondary">Browse More Products</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
