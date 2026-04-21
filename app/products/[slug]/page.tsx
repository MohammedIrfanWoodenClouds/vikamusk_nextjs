'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Download, Mail, ChevronRight,
  Loader2, Share2, Package, Wrench, FileText, ZoomIn, LayoutGrid,
  X, ChevronLeft, Star, Shield, Settings, List,
  Phone, CheckCircle, Zap, TrendingUp, Maximize2, ArrowUpRight,
} from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';

/* ─────────────────────────────── Types ─────────────────────────────── */
interface ProductModel {
  id: string;
  product_id: string;
  model_name: string;
  specs: { label: string; value: string }[];
  images: string[] | string | null;
  sort_order: number;
}

/* ─────────────────────────────── Helpers ─────────────────────────────── */
function normalizeProduct(p: any): any {
  let mainImg = p.image || '';
  let imgList: string[] = [];
  if (mainImg && mainImg.startsWith('[')) {
    try { imgList = JSON.parse(mainImg); mainImg = imgList[0] || ''; }
    catch { imgList = [mainImg]; }
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
    features: typeof p.features === 'string'
      ? (() => { try { return JSON.parse(p.features); } catch { return []; } })()
      : (p.features || []),
    specs: typeof p.specs === 'string'
      ? (() => { try { return JSON.parse(p.specs); } catch { return {}; } })()
      : (p.specs || {}),
    images: imgList,
    image: mainImg,
    brochure_url: p.brochure_url || '',
    featured: !!p.featured,
    main_category_slug: p.main_category_slug || p.category_slug,
    main_category_name: p.main_category_name || p.category_name,
    model_names: Array.isArray(p.model_names) ? p.model_names : [],
  };
}

function getModelImages(model: ProductModel): string[] {
  const raw = model.images;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string' && raw.startsWith('[')) {
    try { return JSON.parse(raw); } catch {}
  }
  if (raw) return [raw as unknown as string];
  return [];
}

type Tab = 'overview' | 'specs' | 'models' | 'features';

/* Spec icon — returns [Icon, rotated] pair */
function getSpecIcon(label: string): [typeof Settings, boolean] {
  const l = label.toLowerCase();
  if (l.includes('height') || l.includes('elevation') || l.includes('range'))
    return [TrendingUp, false];
  if (l.includes('capacity') || l.includes('load') || l.includes('weight'))
    return [Package, false];
  if (l.includes('power') || l.includes('electric') || l.includes('battery') || l.includes('motor'))
    return [Zap, false];
  if (l.includes('width') || l.includes('length') || l.includes('dimension') || l.includes('size'))
    return [Maximize2, false];
  if (l.includes('speed') || l.includes('travel'))
    return [ArrowUpRight, false];
  if (l.includes('platform') || l.includes('floor'))
    return [ArrowUpRight, false];
  return [Settings, false];
}

/* Render image with data: or URL support */
function ProductImage({ src, alt, fill, className, sizes, width, height, priority }: {
  src: string; alt: string; className?: string; priority?: boolean;
  fill?: boolean; sizes?: string; width?: number; height?: number;
}) {
  if (src.startsWith('data:')) {
    return <img src={src} alt={alt} className={className} />;
  }
  if (fill) {
    return <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />;
  }
  return <Image src={src} alt={alt} width={width ?? 80} height={height ?? 80} className={className} />;
}

/* ─────────────────────────────── Model Card ─────────────────────────────── */
function ModelCard({ model, isActive, onClick, fallbackImage }: {
  model: ProductModel; isActive: boolean; onClick: () => void; fallbackImage?: string;
}) {
  const images = getModelImages(model);
  const displayImg = images[0] || '';
  const keySpecs = (model.specs || []).slice(0, 3);

  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-2xl overflow-hidden transition-all duration-200 group"
      style={{
        border: `2px solid ${isActive ? '#f59e0b' : '#e2e8f0'}`,
        background: isActive ? 'rgba(245,158,11,0.02)' : '#fff',
        boxShadow: isActive
          ? '0 0 0 3px rgba(245,158,11,0.12), 0 4px 16px rgba(0,0,0,0.08)'
          : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
        {displayImg ? (
          <ProductImage
            src={displayImg} alt={model.model_name}
            fill className="object-contain p-5 transition-transform duration-400 group-hover:scale-105"
            sizes="250px"
          />
        ) : fallbackImage ? (
          <ProductImage
            src={fallbackImage} alt={model.model_name}
            fill className="object-contain p-6 opacity-40 group-hover:opacity-70 transition-opacity"
            sizes="250px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={36} style={{ color: '#cbd5e1' }} />
          </div>
        )}

        {/* Selected check */}
        <div className="absolute top-2.5 right-2.5 transition-all duration-200"
          style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'scale(1)' : 'scale(0.7)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: '#f59e0b', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
            <Check size={12} strokeWidth={3} style={{ color: '#001f3f' }} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="py-4" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', borderTop: `1px solid ${isActive ? 'rgba(245,158,11,0.2)' : '#f1f5f9'}` }}>
        <p className="font-black text-[14px] mb-2.5 leading-tight transition-colors"
          style={{ color: isActive ? '#f59e0b' : '#001f3f' }}>
          {model.model_name}
        </p>
        {keySpecs.length > 0 ? (
          <div className="space-y-1.5">
            {keySpecs.map((spec, i) => (
              <div key={i} className="flex justify-between items-start gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight"
                  style={{ color: '#94a3b8' }}>{spec.label}</span>
                <span className="text-[11px] font-black text-right shrink-0"
                  style={{ color: isActive ? '#001f3f' : '#64748b' }}>{spec.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] italic" style={{ color: '#cbd5e1' }}>Select to view technical data</p>
        )}
      </div>
    </button>
  );
}

/* ─────────────────────────────── Spec Table ─────────────────────────────── */
function SpecTable({ models }: { models: ProductModel[] }) {
  if (!models.length) return null;
  const allLabels = Array.from(new Set(models.flatMap(m => (m.specs || []).map(s => s.label))));
  if (!allLabels.length) return null;
  const getValue = (m: ProductModel, label: string) =>
    m.specs?.find(s => s.label === label)?.value ?? '—';

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid #e2e8f0' }}>
      <table className="w-full text-base border-collapse" style={{ minWidth: Math.max(680, models.length * 200) }}>
        <thead className="sticky top-0 z-20">
          <tr style={{ background: '#001f3f' }}>
            <th
              className="sticky left-0 z-30 text-left py-5 uppercase tracking-widest"
              style={{ 
                color: 'rgba(255,255,255,0.45)', 
                background: '#001229', 
                borderRight: '1px solid rgba(255,255,255,0.06)', 
                minWidth: 180,
                paddingLeft: '1.25rem',
                paddingRight: '1rem',
                fontWeight: 900,
                fontSize: '11px'
              }}
            >
              Specification
            </th>
            {models.map(m => (
              <th key={m.id} className="px-5 py-5 text-center font-black whitespace-nowrap"
                style={{ color: '#f59e0b', borderRight: '1px solid rgba(255,255,255,0.06)', minWidth: 160, fontSize: '15px' }}>
                {m.model_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allLabels.map((label, i) => {
            const values = models.map(m => getValue(m, label));
            const isDiff = new Set(values.filter(v => v !== '—')).size > 1;
            const rowBg = i % 2 === 0 ? '#f8fafc' : '#ffffff';
            const isSection = label.includes('---');
            
            return (
              <tr key={label} className="group" style={{ background: rowBg }}>
                <td
                  className="sticky left-0 z-10 py-4 uppercase tracking-wide"
                  style={{ 
                    color: isSection ? '#001f3f' : '#475569', 
                    background: rowBg, 
                    borderRight: '1px solid #e2e8f0',
                    paddingLeft: isSection ? '1.25rem' : '2rem',
                    paddingRight: '1rem',
                    fontWeight: isSection ? 900 : 700,
                    fontSize: isSection ? '12px' : '12px'
                  }}
                >
                  <span className="flex items-center gap-2">
                    {label}
                    {!isSection && isDiff && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                    )}
                  </span>
                </td>
                {models.map(m => (
                  <td key={m.id} className="px-5 py-4 text-center font-bold"
                    style={{ color: '#001f3f', borderRight: '1px solid #f1f5f9', fontSize: '16px' }}>
                    {getValue(m, label)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}



/* ══════════════════════════════ Main Page ══════════════════════════════ */
export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct]               = useState<any>(null);
  const [models, setModels]                 = useState<ProductModel[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);

  const [activeTab, setActiveTab]           = useState<Tab>('overview');
  const [activeImage, setActiveImage]       = useState(0);
  const [imageZoomed, setImageZoomed]       = useState(false);
  const [lightboxIndex, setLightboxIndex]   = useState(0);
  const [copied, setCopied]                 = useState(false);
  const [activeModelId, setActiveModelId]   = useState<string | null>(null);

  const ctaRef    = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLElement>(null);

  /* ── Fetch ── */
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



  /* ── Lightbox keyboard ── */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!imageZoomed) return;
    if (e.key === 'Escape') setImageZoomed(false);
    if (e.key === 'ArrowRight')
      setLightboxIndex(i => Math.min(i + 1, (product?.images?.length ?? 1) - 1));
    if (e.key === 'ArrowLeft')
      setLightboxIndex(i => Math.max(i - 1, 0));
  }, [imageZoomed, product]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* ── Share ── */
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product?.name, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-4" style={{ color: '#f59e0b' }} />
          <p className="text-sm font-medium" style={{ color: '#64748b' }}>Loading product…</p>
        </div>
      </div>
    );
  }

  /* ── 404 ── */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: '#f1f5f9' }}>
            <Package size={40} style={{ color: '#cbd5e1' }} />
          </div>
          <h1 className="text-3xl font-black mb-3" style={{ color: '#001f3f' }}>Product Not Found</h1>
          <p className="mb-8 text-sm" style={{ color: '#64748b' }}>
            This product does not exist or has been removed.
          </p>
          <Link href="/products" className="btn-primary">
            <ArrowLeft size={15} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  /* ── Derived data ── */
  const imageList: string[] = product.images?.length > 0
    ? product.images
    : product.image ? [product.image] : [];
  const currentImage = imageList[activeImage] || '';
  const specsEntries = Object.entries(product.specs || {});
  const specsCount   = specsEntries.length;
  const featuresCount = (product.features || []).length;
  const modelsCount  = models.length;
  const quickSpecs   = specsEntries.slice(0, 4);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview',  label: 'Overview', icon: <FileText size={16} /> },
    ...(modelsCount > 0
      ? [{ id: 'models' as Tab,   label: 'Models',   icon: <LayoutGrid size={16} />, count: modelsCount }]
      : []),
    ...(specsCount > 0
      ? [{ id: 'specs' as Tab,    label: 'Specs',    icon: <Settings size={16} />,   count: specsCount }]
      : []),
    ...(featuresCount > 0
      ? [{ id: 'features' as Tab, label: 'Features', icon: <List size={16} />,       count: featuresCount }]
      : []),
  ];

  const flatFeatures: string[] = (product.features || [])
    .flatMap((f: string) =>
      f.split(/(?:\d+\.|\r?\n|;)/).map((s: string) => s.trim()).filter(Boolean)
    );

  /* ══════════════════════════════ Render ══════════════════════════════ */
  return (
    <div className="overflow-hidden">

      {/* Navbar spacer */}
      {/* Global Navbar spacing handled by PublicShell */}

      {/* ── Breadcrumb ── */}
      <div
        className="bg-white border-b sticky z-30"
        style={{ borderColor: '#e2e8f0', top: 0 }}
      >
        <div className="container-custom py-3">
          <nav
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest overflow-x-auto whitespace-nowrap"
            style={{ color: '#94a3b8' }}
          >
            <Link href="/" className="hover:text-amber-500 transition-colors shrink-0">Home</Link>
            <ChevronRight size={11} className="shrink-0" />
            <Link href="/products" className="hover:text-amber-500 transition-colors shrink-0">Products</Link>
            {product.category && (
              <>
                <ChevronRight size={11} className="shrink-0" />
                <Link
                  href={`/categories/${product.main_category_slug}`}
                  className="hover:text-amber-500 transition-colors shrink-0"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={11} className="shrink-0" />
            <span className="font-bold shrink-0" style={{ color: '#1e293b' }}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-white pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-start">

            {/* ───── LEFT: Image Gallery ───── */}
            <div className="lg:sticky" style={{ top: 56 }}>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
              >
                {/* Main image */}
                <div
                  className="relative overflow-hidden rounded-2xl cursor-zoom-in group"
                  style={{
                    aspectRatio: '1 / 1',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '1px solid #e2e8f0',
                  }}
                  onClick={() => currentImage && (() => { setLightboxIndex(activeImage); setImageZoomed(true); })()}
                >
                  {currentImage ? (
                    <ProductImage
                      src={currentImage}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-10 transition-transform duration-600 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                      style={{ color: '#cbd5e1' }}>
                      <Package size={56} />
                      <span className="text-xs font-medium">No Image</span>
                    </div>
                  )}

                  {/* Featured badge */}
                  {product.featured && (
                    <div
                      className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest shadow-md"
                      style={{ background: '#f59e0b', color: '#001f3f' }}
                    >
                      <Star size={10} fill="currentColor" /> Featured
                    </div>
                  )}

                  {/* Zoom hint */}
                  {currentImage && (
                    <div
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 text-white text-[10px] font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)' }}
                    >
                      <ZoomIn size={11} /> Zoom
                    </div>
                  )}

                  {/* Prev/Next arrows */}
                  {imageList.length > 1 && (
                    <>
                      <button
                        onClick={e => { e.stopPropagation(); setActiveImage(i => Math.max(i - 1, 0)); }}
                        disabled={activeImage === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0"
                        style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                      >
                        <ChevronLeft size={16} style={{ color: '#001f3f' }} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setActiveImage(i => Math.min(i + 1, imageList.length - 1)); }}
                        disabled={activeImage === imageList.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 disabled:!opacity-0"
                        style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                      >
                        <ChevronRight size={16} style={{ color: '#001f3f' }} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {imageList.length > 1 && (
                  <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 pr-1">
                    {imageList.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden transition-all duration-200"
                        style={{
                          border: `2px solid ${activeImage === i ? '#f59e0b' : '#e2e8f0'}`,
                          background: '#f8fafc',
                          transform: activeImage === i ? 'scale(1.06)' : 'scale(1)',
                          boxShadow: activeImage === i ? '0 2px 10px rgba(245,158,11,0.3)' : 'none',
                        }}
                      >
                        <ProductImage src={img} alt="" width={56} height={56} className="object-contain p-1.5 w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Image counter */}
                {imageList.length > 1 && (
                  <p className="text-center text-[11px] mt-2" style={{ color: '#94a3b8' }}>
                    {activeImage + 1} / {imageList.length}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div
              className="px-12"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              {/* ── Header row: category + share ── */}
              <div className="flex items-center justify-between mb-3">
                {product.category ? (
                  <Link
                    href={`/categories/${product.main_category_slug}`}
                    className="text-[10px] font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
                    style={{ color: '#f59e0b' }}
                  >
                    {product.category}
                  </Link>
                ) : <span />}

                <button
                  onClick={handleShare}
                  className="flex items-center gap-3 font-black uppercase tracking-[0.15em] rounded-2xl transition-all shadow-md hover:shadow-xl"
                  style={{ 
                    color: '#64748b', 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    margin: '1rem 0 1.5rem 1rem',
                    padding: '0.5rem 1rem',
                    fontSize: '10px',
                    lineHeight: 1
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = '#001f3f'; 
                    e.currentTarget.style.color = '#fff'; 
                    e.currentTarget.style.borderColor = '#001f3f';
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = '#f8fafc'; 
                    e.currentTarget.style.color = '#64748b'; 
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {copied
                    ? <CheckCircle size={20} />
                    : <Share2 size={20} />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>

              {/* ── Product name ── */}
              <h1
                className="font-black leading-[1.08] tracking-tight"
                style={{ color: '#001f3f', fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)', marginBottom: '1rem' }}
              >
                {product.name}
              </h1>

              {/* ── Short description ── */}
              {product.shortDescription && (
                <p
                  className="text-[15px] leading-relaxed pl-4 py-0.5"
                  style={{ color: '#475569', borderLeft: '3px solid #f59e0b', marginBottom: '1rem' }}
                >
                  {product.shortDescription}
                </p>
              )}

              {/* ── Quick spec highlights (only when product has own specs) ── */}
              {quickSpecs.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5" style={{ marginBottom: '1rem' }}>
                  {quickSpecs.map(([key, value], i) => {
                    const [Icon] = getSpecIcon(key);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3.5 rounded-xl transition-all"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(245,158,11,0.45)';
                          e.currentTarget.style.background = 'rgba(245,158,11,0.03)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.background = '#f8fafc';
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(245,158,11,0.1)' }}
                        >
                          <Icon size={14} style={{ color: '#f59e0b' }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                            style={{ color: '#94a3b8' }}>{key}</p>
                          <p className="text-[13px] font-bold truncate" style={{ color: '#001f3f' }}>
                            {String(value)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Models badge ── */}
              {modelsCount > 0 && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '1rem' }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#dcfce7' }}>
                    <LayoutGrid size={13} style={{ color: '#16a34a' }} />
                  </div>
                  <p className="text-[12px] font-semibold leading-snug" style={{ color: '#166534' }}>
                    Available in{' '}
                    <span className="font-black" style={{ color: '#16a34a' }}>
                      {modelsCount} model{modelsCount > 1 ? 's' : ''}
                    </span>
                    {' '}— select in the <strong>Models</strong> tab for full specs
                  </p>
                </div>
              )}

              {/* ── Tab Navigation ── */}
              <div
                className="flex items-center rounded-full p-2 overflow-x-auto no-scrollbar"
                style={{ 
                  background: '#f1f5f9', 
                  border: '1px solid #e2e8f0', 
                  gap: 12, 
                  marginTop: '1.5rem', 
                  marginBottom: '2.5rem' 
                }}
              >
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex-1 min-w-[160px] relative flex items-center justify-center gap-4 px-10 rounded-full text-[14px] font-black uppercase tracking-widest transition-all duration-300 group"
                      style={{ height: '58px', ... (isActive
                        ? {
                            background: '#fff',
                            color: '#001f3f',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.02)',
                          }
                        : { color: '#64748b' })
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                          e.currentTarget.style.color = '#001f3f';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                        }
                      }}
                    >
                      <span className="shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ color: isActive ? '#f59e0b' : 'inherit' }}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span
                          className="min-w-[24px] h-[24px] flex items-center justify-center px-2 text-[10px] rounded-full font-black transition-colors"
                          style={isActive
                            ? { background: 'rgba(245,158,11,0.15)', color: '#b45309' }
                            : { background: '#e2e8f0', color: '#94a3b8' }
                          }
                        >
                          {tab.count}
                        </span>
                      )}

                      {/* Active Indicator Underline */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full"
                          style={{ background: '#f59e0b' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Tab Content ── */}
              <AnimatePresence mode="wait">

                {/* Overview */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                    className="min-h-[120px]"
                  >
                    {product.fullDescription || product.shortDescription ? (
                      <p className="text-[14px] leading-relaxed whitespace-pre-line"
                        style={{ color: '#475569' }}>
                        {product.fullDescription || product.shortDescription}
                      </p>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center py-10 text-center rounded-xl"
                        style={{ background: '#f8fafc', border: '1px dashed #e2e8f0' }}
                      >
                        <FileText size={28} className="mb-2" style={{ color: '#cbd5e1' }} />
                        <p className="text-[13px] font-semibold mb-1" style={{ color: '#64748b' }}>
                          Description being updated
                        </p>
                        <p className="text-[11px]" style={{ color: '#94a3b8' }}>
                          Download the brochure or contact us for details
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Models */}
                {activeTab === 'models' && (
                  <motion.div
                    key="models"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                  >
                    {models.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl"
                        style={{ background: '#f8fafc', border: '1px dashed #e2e8f0' }}>
                        <LayoutGrid size={28} className="mb-2" style={{ color: '#cbd5e1' }} />
                        <p className="text-[13px] font-semibold" style={{ color: '#64748b' }}>
                          No model variants yet
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] font-black uppercase tracking-widest"
                          style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                          Select a model to view specifications
                        </p>

                        {/* Model cards — auto-fill grid, handles any count cleanly */}
                        <div
                          className="grid gap-3 mb-5"
                          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', paddingLeft: '2rem', paddingRight: '2rem' }}
                        >
                          {models.map(m => (
                            <ModelCard
                              key={m.id}
                              model={m}
                              isActive={activeModelId === m.id}
                              onClick={() => setActiveModelId(prev => prev === m.id ? null : m.id)}
                              fallbackImage={product.image}
                            />
                          ))}
                        </div>

                        {/* Selected model spec panel */}
                        <AnimatePresence>
                          {activeModelId && (() => {
                            const sel = models.find(m => m.id === activeModelId);
                            if (!sel || !sel.specs?.length) return null;
                            return (
                              <motion.div
                                key={activeModelId}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.18 }}
                                className="rounded-xl overflow-hidden mb-4 mx-6"
                                style={{ border: '1px solid rgba(245,158,11,0.28)' }}
                              >
                                {/* Panel header */}
                                <div
                                  className="flex items-center justify-between px-4 py-3"
                                  style={{ background: 'rgba(245,158,11,0.05)', borderBottom: '1px solid rgba(245,158,11,0.15)' }}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                      style={{ background: '#f59e0b' }}>
                                      <LayoutGrid size={13} style={{ color: '#001f3f' }} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest"
                                      style={{ color: '#001f3f' }}>
                                      {sel.model_name}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setActiveModelId(null)}
                                    className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                                    style={{ color: '#94a3b8' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                                {/* Spec rows */}
                                {sel.specs.map((s, i) => (
                                    <div
                                      key={i}
                                      className="flex justify-between items-center pr-4 py-3"
                                      style={{
                                        background: i % 2 === 0 ? '#f8fafc' : '#fff',
                                        borderBottom: i < sel.specs.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        paddingLeft: s.label.includes('---') ? '1.5rem' : '2.5rem'
                                      }}
                                    >
                                      <span className={`text-[13px] uppercase tracking-wide ${s.label.includes('---') ? 'font-black text-[#001f3f]' : 'font-bold text-[#64748b]'}`}>
                                        {s.label}
                                      </span>
                                      <span className="text-[15px] font-black text-right ml-4"
                                        style={{ color: '#001f3f' }}>{s.value}</span>
                                    </div>
                                ))}
                              </motion.div>
                            );
                          })()}
                        </AnimatePresence>


                      </>
                    )}
                  </motion.div>
                )}

                {/* Specs */}
                {activeTab === 'specs' && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                  >
                    {specsCount === 0 ? (
                      <p className="text-sm italic py-4" style={{ color: '#94a3b8' }}>
                        No specifications listed.
                      </p>
                    ) : (
                      <div className="rounded-xl overflow-hidden mx-6" style={{ border: '1px solid #e2e8f0' }}>
                        {specsEntries.map(([key, value], i) => (
                          <div
                            key={key}
                            className="flex justify-between items-center pr-4 py-3.5 transition-colors"
                            style={{
                              background: i % 2 === 0 ? '#f8fafc' : '#fff',
                              borderBottom: i < specsCount - 1 ? '1px solid #f1f5f9' : 'none',
                              paddingLeft: key.includes('---') ? '1.5rem' : '2.5rem'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.03)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? '#f8fafc' : '#fff'; }}
                          >
                            <span className={`text-[14px] ${key.includes('---') ? 'font-black text-[#001f3f]' : 'font-bold text-[#64748b]'}`}>
                              {key}
                            </span>
                            <span className="text-[16px] font-black ml-4 text-right" style={{ color: '#001f3f' }}>
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Features */}
                {activeTab === 'features' && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                  >
                    {flatFeatures.length === 0 ? (
                      <p className="text-sm italic py-4" style={{ color: '#94a3b8' }}>No features listed.</p>
                    ) : (
                      <div className="flex flex-col gap-2" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                        {flatFeatures.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.025 }}
                            className="flex items-start gap-3 p-3.5 rounded-xl transition-all"
                            style={{ background: '#fff', border: '1px solid #e2e8f0' }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)';
                              e.currentTarget.style.background = 'rgba(245,158,11,0.02)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.background = '#fff';
                            }}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: 'rgba(245,158,11,0.12)' }}
                            >
                              <Check size={11} strokeWidth={3} style={{ color: '#d97706' }} />
                            </div>
                            <span className="text-[13px] leading-relaxed" style={{ color: '#334155' }}>
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── CTA Block ── */}
              <div ref={ctaRef} className="mt-12" style={{ marginTop: '3rem' }}>
                <div
                  className="rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-xl"
                  style={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                    border: '1px solid #e2e8f0' 
                  }}
                >
                  <div className="relative z-10 flex flex-col items-center text-center gap-6">
                    {/* Row 1: Label */}
                    <p className="text-[11px] font-black uppercase tracking-[0.25em]"
                      style={{ color: '#f59e0b' }}>
                      Ready to proceed?
                    </p>
 
                    {/* Row 2: Title */}
                    <div className="max-w-md">
                      <h3 className="text-xl lg:text-2xl font-black leading-tight" 
                        style={{ color: '#001f3f' }}>
                        Get a tailored quote or download the product spec sheet
                      </h3>
                    </div>
 
                    {/* Row 3: Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 w-full">
                      <Link
                        href={`/contact?product=${encodeURIComponent(product.name)}`}
                        className="flex-1 min-w-[200px] max-w-[240px] flex items-center justify-center gap-3.5 rounded-2xl font-black text-[14px] transition-all hover:scale-[1.03] shadow-lg shadow-amber-500/20"
                        style={{
                          background: '#f59e0b',
                          color: '#001f3f',
                          height: '60px',
                        }}
                        onMouseEnter={e => { 
                          e.currentTarget.style.background = '#001f3f'; 
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={e => { 
                          e.currentTarget.style.background = '#f59e0b'; 
                          e.currentTarget.style.color = '#001f3f';
                        }}
                      >
                        <Mail size={18} /> Request Quote
                      </Link>
 
                      {product.brochure_url ? (
                        <a
                          href={product.brochure_url}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 min-w-[200px] max-w-[240px] flex items-center justify-center gap-3.5 rounded-2xl font-black text-[14px] transition-all border-2 border-[#001f3f]/10 hover:scale-[1.03]"
                          style={{
                            background: '#fff',
                            color: '#001f3f',
                            height: '60px',
                          }}
                          onMouseEnter={e => { 
                            e.currentTarget.style.borderColor = '#001f3f';
                          }}
                          onMouseLeave={e => { 
                            e.currentTarget.style.borderColor = 'rgba(0,31,63,0.1)';
                          }}
                        >
                          <Download size={18} /> Brochure
                        </a>
                      ) : (
                        <Link
                          href="/vikamusk-company-profile.pdf"
                          className="flex-1 min-w-[200px] max-w-[240px] flex items-center justify-center gap-3.5 rounded-2xl font-black text-[14px] transition-all border-2 border-[#001f3f]/10 hover:scale-[1.03]"
                          style={{
                            background: '#fff',
                            color: '#001f3f',
                            height: '60px',
                          }}
                          onMouseEnter={e => { 
                            e.currentTarget.style.borderColor = '#001f3f';
                          }}
                          onMouseLeave={e => { 
                            e.currentTarget.style.borderColor = 'rgba(0,31,63,0.1)';
                          }}
                        >
                          <Download size={18} /> Profile
                        </Link>
                      )}
                    </div>
 
                    {/* Row 4: Trust Badges */}
                    <div
                      className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-2"
                      style={{ borderTop: '1px solid #eef2f6' }}
                    >
                      {[
                        { icon: <Shield size={16} />, label: 'Fast Response' },
                        { icon: <Wrench size={16} />, label: 'Expert Support' },
                        { icon: <Phone size={16} />, label: 'Ready to Help' },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706' }}
                          >
                            {item.icon}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest leading-tight"
                            style={{ color: '#94a3b8' }}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

                {/* Back / Share row */}
                <div className="flex items-center justify-between px-1" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
                  <Link
                    href="/products"
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#334155'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <ArrowLeft size={12} style={{ color: '#f59e0b' }} /> Back to Catalog
                  </Link>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#334155'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    {copied
                      ? <><CheckCircle size={12} style={{ color: '#10b981' }} /> Copied!</>
                      : <><Share2 size={12} style={{ color: '#f59e0b' }} /> Share</>}
                  </button>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {imageZoomed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.93)' }}
            onClick={() => setImageZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl"
              style={{ aspectRatio: '1 / 1', background: 'rgba(255,255,255,0.03)' }}
              onClick={e => e.stopPropagation()}
            >
              {imageList[lightboxIndex] && (
                <ProductImage
                  src={imageList[lightboxIndex]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="90vw"
                />
              )}

              {/* Close */}
              <button
                onClick={() => setImageZoomed(false)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: 'rgba(0,0,0,0.65)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.65)'; }}
              >
                <X size={16} />
              </button>

              {/* Prev */}
              {imageList.length > 1 && lightboxIndex > 0 && (
                <button
                  onClick={() => setLightboxIndex(i => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                  style={{ background: 'rgba(0,0,0,0.65)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.9)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.65)'; }}
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* Next */}
              {imageList.length > 1 && lightboxIndex < imageList.length - 1 && (
                <button
                  onClick={() => setLightboxIndex(i => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                  style={{ background: 'rgba(0,0,0,0.65)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.9)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.65)'; }}
                >
                  <ChevronRight size={20} />
                </button>
              )}

              {/* Counter */}
              {imageList.length > 1 && (
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-white text-[11px] font-semibold"
                  style={{ background: 'rgba(0,0,0,0.65)' }}
                >
                  {lightboxIndex + 1} / {imageList.length}
                </div>
              )}

              {/* ESC hint */}
              <p className="absolute bottom-3 right-3 text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                ESC to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full Model Comparison ── */}
      {models.length > 1 && (
        <section className="section-padding" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <div className="container-custom">
            <AnimatedSection className="mb-8">
              <span className="text-[11px] font-bold uppercase tracking-widest block mb-2"
                style={{ color: '#f59e0b' }}>Technical Data</span>
              <h2 className="text-2xl lg:text-3xl font-black" style={{ color: '#001f3f' }}>
                Full Model Comparison
              </h2>
              <p className="text-sm mt-1.5" style={{ color: '#64748b' }}>
                Compare all {modelsCount} models side by side — scroll horizontally for more columns
              </p>
            </AnimatedSection>
            <SpecTable models={models} />
          </div>
        </section>
      )}

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="section-padding" style={{ background: '#fff' }}>
          <div className="container-custom">
            <AnimatedSection className="flex justify-between items-end mb-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest block mb-2"
                  style={{ color: '#f59e0b' }}>More From This Category</span>
                <h2 className="text-2xl lg:text-3xl font-black" style={{ color: '#001f3f', marginBottom: '1rem' }}>
                  Related Products
                </h2>
              </div>
              <Link
                href={`/products?category=${product.main_category_slug}`}
                className="btn-outline text-xs py-2 px-5 hidden sm:inline-flex"
                style={{ marginBottom: '1rem' }}
              >
                View All <ArrowRight size={13} />
              </Link>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} index={i} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ── Bottom CTA — observed to hide floating bar ── */}
      <section 
        ref={bottomRef}
        className="bg-[#001f3f]" 
        style={{ paddingTop: '3rem', paddingBottom: '7rem' }}
      >
        <div
          className="container-custom"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <AnimatedSection>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white"
                style={{ marginBottom: '1.5rem', textAlign: 'center', lineHeight: '1.2' }}
              >
                Need help choosing the right model?
              </h2>
              <p
                className="text-gray-400 leading-relaxed px-4"
                style={{
                  maxWidth: '640px',
                  marginBottom: '2.5rem',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  textAlign: 'center',
                }}
              >
                Our technical specialists are ready to guide you through the specifications
                and find the perfect solution for your operation.
              </p>
              <div
                className="flex flex-col sm:flex-row justify-center items-center w-full px-4"
                style={{ gap: '1rem', marginTop: '0.5rem' }}
              >
                <Link
                  href="/contact"
                  className="w-full sm:w-auto bg-accent hover:bg-white text-[#001f3f] hover:text-[#001f3f] font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Get Expert Advice <Phone size={18} />
                </Link>
                <Link
                  href="/products"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-[#001f3f] font-semibold rounded-xl border border-white/20 hover:border-white transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  Browse Full Catalog
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
