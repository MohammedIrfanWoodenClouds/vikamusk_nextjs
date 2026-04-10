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
function ModelCard({ model, isActive, onClick, fallbackImage }: { model: ProductModel; isActive: boolean; onClick: () => void; fallbackImage?: string }) {
  const rawImages = model.images;
  const images: string[] = Array.isArray(rawImages)
    ? rawImages
    : typeof rawImages === 'string' && rawImages.startsWith('[')
      ? (() => { try { return JSON.parse(rawImages); } catch { return rawImages ? [rawImages] : []; } })()
      : rawImages
        ? [rawImages as unknown as string]
        : [];
  const displayImg = images[0] || '';

  // Get key specs for the card (e.g., first two specs)
  const keySpecs = model.specs?.slice(0, 2) || [];

  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${
        isActive ? 'border-accent bg-accent/5 ring-4 ring-accent/10' : 'border-border/40 bg-white hover:border-accent/40 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="relative h-44 bg-gradient-to-br from-gray-50 to-slate-100 overflow-hidden">
        {displayImg ? (
          displayImg.startsWith('data:') ? (
            <img src={displayImg} alt={model.model_name} className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <Image src={displayImg} alt={model.model_name} fill className="object-contain p-6 transition-transform duration-500 group-hover:scale-110" sizes="300px" />
          )
        ) : (
          /* Fallback to main product image if available, else show icon */
          fallbackImage ? (
            fallbackImage.startsWith('data:') ? (
              <img src={fallbackImage} alt={model.model_name} className="w-full h-full object-contain p-10 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
            ) : (
              <Image src={fallbackImage} alt={model.model_name} fill className="object-contain p-10 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted/20 gap-2">
              <Package size={48} strokeWidth={1} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40">No Image</span>
            </div>
          )
        )}
        
        <div className="absolute top-3 right-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
            isActive ? 'bg-accent border-accent text-primary scale-110 shadow-lg' : 'bg-white/80 border-gray-200 text-transparent opacity-0 group-hover:opacity-100'
          }`}>
            <Check size={12} strokeWidth={4} />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Select to view specs</span>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-black text-primary text-base mb-2 group-hover:text-accent transition-colors">{model.model_name}</h4>
        
        {keySpecs.length > 0 ? (
          <div className="space-y-1.5">
            {keySpecs.map((spec, i) => (
              <div key={i} className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-bold text-muted/60 uppercase tracking-tighter truncate">{spec.label}</span>
                <span className="text-[10px] font-black text-primary whitespace-nowrap">{spec.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-muted/40 italic">Click for details</p>
        )}
      </div>
    </button>
  );
}


/* ── Model Spec Comparison Table ── */
function SpecTable({ models }: { models: ProductModel[] }) {
  if (models.length === 0) return null;

  const allLabels = Array.from(
    new Set(models.flatMap(m => (m.specs || []).map(s => s.label)))
  );

  if (allLabels.length === 0) return null;

  const getValue = (model: ProductModel, label: string) =>
    model.specs?.find(s => s.label === label)?.value ?? '—';

  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-primary/10 shadow-xl bg-white max-h-[600px] custom-scrollbar">
      <table className="w-full text-sm border-collapse min-w-[700px]">
        <thead className="sticky top-0 z-30">
          <tr className="bg-primary">
            <th className="text-left px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-white/50 sticky left-0 z-40 bg-primary border-r border-white/5 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
              Parameters
            </th>
            {models.map(m => (
              <th key={m.id} className="px-6 py-5 font-black text-xs text-center whitespace-nowrap min-w-[160px] text-accent uppercase tracking-widest border-r border-white/5 last:border-0 shadow-[inset_0_-2px_0_rgba(255,255,255,0.05)]">
                {m.model_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allLabels.map((label, i) => {
            const values = models.map(m => getValue(m, label));
            const isDifferent = new Set(values.filter(v => v !== '—')).size > 1;

            return (
              <tr key={label} className={`group hover:bg-accent/5 transition-colors ${i % 2 === 0 ? 'bg-surface/30' : 'bg-white'}`}>
                <td className={`px-6 py-4 font-bold text-primary text-[11px] uppercase tracking-wider sticky left-0 z-10 border-r border-primary/5 transition-colors group-hover:bg-accent/5 ${i % 2 === 0 ? 'bg-surface/10' : 'bg-white'}`}>
                  {label}
                  {isDifferent && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-accent inline-block" title="Values differ across models" />}
                </td>
                {models.map(m => (
                  <td key={m.id} className="px-6 py-4 text-center font-bold text-primary/80 text-xs border-r border-primary/5 last:border-0">
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

  // Calculate dynamic ranges for specs
  const getSpecRange = (labelPatterns: string[]) => {
    if (models.length === 0) return null;
    const values = models
      .flatMap(m => m.specs || [])
      .filter(s => labelPatterns.some(p => s.label.toLowerCase().includes(p.toLowerCase())))
      .map(s => {
        const num = parseFloat(s.value);
        return isNaN(num) ? null : num;
      })
      .filter((v): v is number => v !== null);

    if (values.length === 0) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return min === max ? `${min}` : `${min} – ${max}`;
  };

  const heightRange = getSpecRange(['height', 'elevation']);
  const loadRange = getSpecRange(['load', 'capacity', 'weight']);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText size={14} /> },
    ...(modelsCount > 0 ? [{ id: 'models' as Tab, label: 'Models & Specs', icon: <LayoutGrid size={14} />, count: modelsCount }] : []),
    ...(specsCount > 0 ? [{ id: 'specs' as Tab, label: 'Specifications', icon: <Wrench size={14} />, count: specsCount }] : []),
    { id: 'features', label: 'Features', icon: <Check size={14} />, count: featuresCount },
  ];

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-[90px] lg:h-[120px] w-full bg-white" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border py-4 sticky top-[64px] lg:top-[72px] z-30 backdrop-blur-md bg-white/95">
        <div className="container-custom">
          <nav className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-primary/40 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="w-1 h-1 rounded-full bg-border" />
            <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
            {product.category && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <Link href={`/categories/${product.main_category_slug}`} className="hover:text-accent transition-colors">{product.category}</Link>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-primary">{product.name}</span>
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
                    className="relative aspect-square bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in group transition-transform duration-500 hover:scale-[1.02]"
                    onClick={() => currentImage && setImageZoomed(true)}
                  >
                    {currentImage ? (
                      currentImage.startsWith('data:') ? (
                        <img src={currentImage} alt={product.name} className="w-full h-full object-contain p-10 transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <Image src={currentImage} alt={product.name} fill className="object-contain p-10 transition-transform duration-700 group-hover:scale-110" priority />
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
                  <div className="flex gap-3 mt-5 overflow-x-auto pb-2 custom-scrollbar">
                    {imageList.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                          activeImage === i ? 'border-accent shadow-lg scale-105' : 'border-border/40 hover:border-accent/40 bg-white'
                        }`}
                      >
                        {img.startsWith('data:') ? (
                          <img src={img} alt="" className="w-full h-full object-contain p-2" />
                        ) : (
                          <Image src={img} alt="" width={80} height={80} className="object-contain p-2" />
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
                <h1 className="text-3xl lg:text-[44px] font-black text-primary leading-[1.1] mb-4 tracking-tight">{product.name}</h1>
                {product.shortDescription && (
                  <p className="text-base text-muted/80 leading-relaxed mb-6 border-l-4 pl-4 py-1" style={{ borderColor: '#f59e0b' }}>
                    {product.shortDescription}
                  </p>
                )}

                {/* Key Specs Summary */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-surface border border-border/60 rounded-2xl p-4 flex items-center gap-4 hover:border-accent/40 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-accent/10 transition-colors">
                      <ArrowRight size={16} className="text-accent -rotate-45" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">Working Height</p>
                      <p className="text-sm font-black text-primary">
                        {product.specs['Working Height'] || product.specs['Max. Working Height'] || (heightRange ? `~${heightRange}m` : '8–15m range')}
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface border border-border/60 rounded-2xl p-4 flex items-center gap-4 hover:border-accent/40 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-accent/10 transition-colors">
                      <Package size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">Load Capacity</p>
                      <p className="text-sm font-black text-primary">
                        {product.specs['Load Capacity'] || product.specs['Lift Capacity'] || (loadRange ? `${loadRange}kg` : '320–550kg range')}
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface border border-border/60 rounded-2xl p-4 flex items-center gap-4 hover:border-accent/40 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-accent/10 transition-colors">
                      <Wrench size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">Power Source</p>
                      <p className="text-sm font-black text-primary">{product.specs['Power Source'] || product.specs['Engine'] || 'Electric / Diesel'}</p>
                    </div>
                  </div>
                  <div className="bg-surface border border-border/60 rounded-2xl p-4 flex items-center gap-4 hover:border-accent/40 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-accent/10 transition-colors">
                      <Star size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">Ideal Usage</p>
                      <p className="text-sm font-black text-primary">Indoor & Outdoor</p>
                    </div>
                  </div>
                </div>

                {/* Highly Recommended Model (Star Feature) */}
                {models.length > 0 && (
                  <div className="mb-10 p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute -right-2 -bottom-2 opacity-10 rotate-12 group-hover:rotate-6 transition-transform">
                      <Star size={80} fill="#f59e0b" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
                      <Star size={18} fill="currentColor" className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-0.5">Special Recognition</p>
                      <p className="text-sm font-black text-primary">
                        Recommended: <span className="text-accent">{models[Math.min(3, models.length - 1)].model_name}</span> — 
                        <span className="text-xs font-bold text-muted ml-2">Best for versatile industrial maintenance</span>
                      </p>
                    </div>
                  </div>
                )}

              {/* Tabs */}
              <AnimatedSection delay={0.1}>
                <div className="flex gap-1 bg-surface rounded-xl p-1 mb-8 border border-border/50 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg text-xs font-black transition-all cursor-pointer group hover:bg-white/50"
                      style={activeTab === tab.id
                        ? { background: '#fff', color: '#001f3f', boxShadow: '0 4px 12px rgba(0,31,63,0.08)', borderBottom: '2px solid #f59e0b' }
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
                      {product.fullDescription ? (
                        <>
                          <p className="text-sm text-muted leading-relaxed whitespace-pre-line mb-8">{product.fullDescription}</p>
                          <div className="bg-surface border border-border/40 rounded-3xl p-6">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Ideal Use Cases</p>
                            <div className="flex flex-wrap gap-3">
                              {['Warehouse Maintenance', 'Construction Sites', 'Indoor Facilities', 'Logistics Centers', 'Event Management'].map((tag, i) => (
                                <div key={i} className="px-4 py-2 rounded-xl bg-white border border-border/60 text-[11px] font-bold text-muted flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-accent" />
                                  {tag}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 rounded-2xl bg-surface/50 border border-dashed border-border flex flex-col items-center justify-center text-center">
                          <FileText size={32} className="text-muted/30 mb-3" />
                          <p className="text-sm text-muted/60 font-medium">Detailed description for {product.name} is being updated.</p>
                          <p className="text-[11px] text-muted/40 mt-1 italic">For immediate technical details, please download the brochure or contact our experts.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'models' && (
                    <motion.div key="models" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="min-h-[160px]">
                      {models.length === 0 ? (
                        <div className="p-6 rounded-2xl bg-surface/50 border border-dashed border-border flex flex-col items-center justify-center text-center">
                          <LayoutGrid size={32} className="text-muted/30 mb-3" />
                          <p className="text-sm text-muted/60 font-medium">Model variations for this product will be available soon.</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted/60">Select a model to view details</p>
                          </div>
                          {/* Model cards grid */}
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            {models.map(m => (
                              <ModelCard
                                key={m.id}
                                model={m}
                                isActive={activeModelId === m.id}
                                onClick={() => setActiveModelId(activeModelId === m.id ? null : m.id)}
                                fallbackImage={product.image}
                              />
                            ))}
                          </div>

                          {/* Selected model spec detail */}
                          <AnimatePresence>
                            {activeModelId && (() => {
                              const sel = models.find(m => m.id === activeModelId);
                              if (!sel || !sel.specs?.length) return null;
                              return (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }} 
                                  animate={{ opacity: 1, height: 'auto' }} 
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mb-8 rounded-3xl border-2 border-accent/20 overflow-hidden shadow-lg shadow-accent/5"
                                >
                                  <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(245,158,11,0.08)' }}>
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                        <LayoutGrid size={14} className="text-primary" />
                                      </div>
                                      <span className="text-xs font-black text-primary uppercase tracking-widest">{sel.model_name} Specifications</span>
                                    </div>
                                    <button onClick={() => setActiveModelId(null)} className="text-muted hover:text-primary transition-colors">✕</button>
                                  </div>
                                  <div className="p-2 bg-white">
                                    {sel.specs.map((s, i, arr) => (
                                      <div key={i} className={`flex justify-between items-center px-5 py-3.5 ${i % 2 === 0 ? 'bg-surface/30' : 'bg-white'} rounded-xl transition-colors hover:bg-accent/5`}>
                                        <span className="text-[11px] font-bold text-muted/60 uppercase tracking-wider">{s.label}</span>
                                        <span className="text-xs font-black text-primary ml-4 text-right">{s.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              );
                            })()}
                          </AnimatePresence>
                          
                          {models.length > 0 && (
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Scroll down for full model comparison table</p>
                            </div>
                          )}
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
                          <div className="grid grid-cols-1 gap-3">
                            {product.features.flatMap((f: string) => f.split(/(?:\d+\.|\r?\n|;)/).map(s => s.trim()).filter(Boolean)).map((feature: string, i: number) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border/40 hover:border-accent/40 transition-all group shadow-sm hover:shadow-md"
                              >
                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-primary transition-colors">
                                  <Check size={12} strokeWidth={4} />
                                </div>
                                <span className="text-sm font-bold text-primary/80 leading-relaxed">{feature}</span>
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
              <AnimatedSection delay={0.25} className="mt-12">
                <div className="bg-primary text-white rounded-[32px] p-6 lg:p-10 shadow-3xl shadow-primary/30 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="bg-accent hover:bg-accent/90 text-primary font-black py-5 px-10 rounded-2xl flex-1 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-accent/30 text-base">
                        <Mail size={20} /> Request a Quote
                      </Link>
                      {product.brochure_url ? (
                        <a href={product.brochure_url} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-black py-5 px-10 rounded-2xl flex-1 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 border border-white/20">
                          <Download size={20} /> Full Brochure
                        </a>
                      ) : (
                        <a href="/vikamusk-company-profile.pdf" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-black py-5 px-10 rounded-2xl flex-1 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 border border-white/20">
                          <Download size={20} /> Company Profile
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-8 pt-8 border-t border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                          <Check size={12} className="text-accent" />
                        </div>
                        <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">24h Response</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                          <Check size={12} className="text-accent" />
                        </div>
                        <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">Technical Support</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                          <Check size={12} className="text-accent" />
                        </div>
                        <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">Global Shipping</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                  <button onClick={handleShare} className="flex items-center gap-2 text-[11px] font-black text-muted/60 uppercase tracking-[0.2em] hover:text-primary transition-colors">
                    <Share2 size={14} className="text-accent" /> {copied ? 'Copied!' : 'Share Product'}
                  </button>
                  <Link href="/products" className="flex items-center gap-2 text-[11px] font-black text-muted/60 uppercase tracking-[0.2em] hover:text-primary transition-colors">
                    <ArrowLeft size={14} className="text-accent" /> Back to Catalog
                  </Link>
                </div>
              </AnimatedSection>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>


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
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#001f3f' }}>
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <AnimatedSection>
            <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: '#f59e0b' }}>Consulting & Expert Advice</span>
            <h2 className="text-3xl lg:text-5xl font-black text-white mt-6 mb-6 tracking-tight">Need help choosing the right model?</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base lg:text-lg mb-12 leading-relaxed">
              Our technical specialist team is ready to guide you through the specifications and find the perfect material handling solution for your specific needs.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link href="/contact" className="bg-accent hover:bg-accent/90 text-primary font-black py-4 px-10 rounded-2xl flex items-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-accent/20">
                <Mail size={20} /> Get Expert Advice
              </Link>
              <Link href="/products" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black py-4 px-10 rounded-2xl flex items-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 border border-white/10">
                Browse Full Catalog
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 31, 63, 0.03);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 31, 63, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
    </>
  );
}
