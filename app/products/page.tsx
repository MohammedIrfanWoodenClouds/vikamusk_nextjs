'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown,
  ArrowRight, Star, Package, Loader2, ArrowUpDown,
} from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';

interface MainCategory {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

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
  };
}

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'featured';
type ViewMode = 'grid' | 'list';

function ProductSkeleton({ view }: { view: ViewMode }) {
  if (view === 'list') {
    return (
      <div className="flex gap-5 bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
        <div className="w-32 h-32 rounded-xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-3 w-20 bg-gray-100 rounded-full" />
          <div className="h-5 w-2/3 bg-gray-100 rounded-full" />
          <div className="h-3 w-full bg-gray-100 rounded-full" />
          <div className="h-3 w-4/5 bg-gray-100 rounded-full" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
            <div className="h-5 w-24 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-3 w-full bg-gray-100 rounded-full" />
        <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
          <div className="h-5 w-24 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProductListCard({ product, index }: { product: any; index: number }) {
  const isBase64 = product.image?.startsWith('data:');
  const specEntries = Object.entries(product.specs || {}).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex gap-5 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-accent/25 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 overflow-hidden">
          {product.image ? (
            isBase64 ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <Image src={product.image} alt={product.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-500" sizes="160px" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs">No Image</div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-accent text-[#001f3f] text-[9px] font-black rounded-full uppercase tracking-wider">
              <Star size={8} fill="currentColor" /> Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          {product.category && (
            <p className="text-[10px] font-bold text-accent/80 uppercase tracking-widest mb-1">{product.category}</p>
          )}
          <h3 className="text-base font-black text-gray-900 group-hover:text-accent transition-colors leading-snug line-clamp-1 mb-1.5">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{product.shortDescription}</p>
          )}
          {specEntries.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {specEntries.map(([key, value]) => (
                <span key={key} className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 font-semibold truncate max-w-[140px]">
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-accent transition-colors mt-auto pt-2">
            View Details <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOpen, setSortOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/products').then(r => r.json()),
      fetch('/api/public/categories').then(r => r.json()),
    ]).then(([prodsData, catsData]) => {
      setProducts((prodsData.products || []).map(normalizeProduct));
      setCategories(catsData.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCategoryChange = useCallback((slug: string) => {
    setActiveCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') params.delete('category');
    else params.set('category', slug);
    router.replace(`/products?${params.toString()}`, { scroll: false });
    setShowMobileFilters(false);
  }, [searchParams, router]);

  const filteredAndSorted = useMemo(() => {
    let result = products;

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(p => p.categorySlug === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'name-asc': return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return [...result].sort((a, b) => b.name.localeCompare(a.name));
      case 'featured': return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      default: return result;
    }
  }, [products, activeCategory, searchQuery, sortBy]);

  const sortLabels: Record<SortOption, string> = {
    default: 'Default Order',
    'name-asc': 'Name: A → Z',
    'name-desc': 'Name: Z → A',
    featured: 'Featured First',
  };

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative py-24 lg:py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/97 to-primary/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `radial-gradient(circle, rgba(245,158,11,0.9) 1px, transparent 1px)`, backgroundSize: '36px 36px' }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/65 text-xs font-semibold mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Construction & Material Handling Equipment
            </div>
            <h1 className="text-4xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-5">
              Products &{' '}
              <span className="gradient-text">Services</span>
            </h1>
            <p className="text-white/55 max-w-lg text-base lg:text-lg leading-relaxed mb-10">
              Explore our complete range of forklifts, aerial work platforms, and material handling solutions — engineered for performance and reliability.
            </p>

            {/* Hero search */}
            <div className="relative max-w-xl">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/35 text-sm backdrop-blur-sm focus:outline-none focus:border-accent/50 focus:bg-white/15 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="bg-surface min-h-screen">
        <div className="container-custom py-10 lg:py-14">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(v => !v)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-primary hover:border-primary/30 transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeCategory !== 'all' && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>

            {/* Category chips – desktop */}
            <div className="hidden lg:flex flex-wrap gap-2 flex-1">
              {[{ id: 0, name: `All Products`, slug: 'all', product_count: products.length }, ...categories].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeCategory === cat.slug
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-white text-muted border border-border hover:border-primary/25 hover:text-primary'
                  }`}
                >
                  {cat.name}
                  <span className={`ml-1.5 text-[10px] ${activeCategory === cat.slug ? 'text-white/70' : 'text-gray-400'}`}>
                    ({cat.id === 0 ? products.length : (cat.product_count || 0)})
                  </span>
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(v => !v)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-semibold text-primary hover:border-primary/30 transition-colors"
                >
                  <ArrowUpDown size={13} />
                  <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-white border border-border rounded-xl shadow-lg shadow-black/5 z-20 overflow-hidden"
                    >
                      {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => { setSortBy(key); setSortOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                            sortBy === key ? 'bg-primary/5 text-primary' : 'text-muted hover:bg-gray-50 hover:text-primary'
                          }`}
                        >
                          {label}
                          {sortBy === key && <span className="float-right text-accent">✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View toggle */}
              <div className="flex bg-white border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}
                  title="Grid view"
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}
                  title="List view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden mb-6"
              >
                <div className="bg-white border border-border rounded-2xl p-4">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ id: 0, name: `All Products`, slug: 'all', product_count: products.length }, ...categories].map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          activeCategory === cat.slug
                            ? 'bg-primary text-white'
                            : 'bg-surface text-muted border border-border hover:border-primary/25'
                        }`}
                      >
                        {cat.name} ({cat.id === 0 ? products.length : (cat.product_count || 0)})
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results info + search pill */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-sm text-muted">
              {loading ? (
                <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading...</span>
              ) : (
                <>
                  <span className="font-bold text-primary">{filteredAndSorted.length}</span>
                  {' '}product{filteredAndSorted.length !== 1 ? 's' : ''} found
                </>
              )}
            </p>
            {searchQuery && !loading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-semibold text-primary">
                <Search size={11} /> "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-0.5 text-muted hover:text-primary transition-colors">
                  <X size={11} />
                </button>
              </span>
            )}
            {activeCategory !== 'all' && !loading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-semibold text-primary">
                {categories.find(c => c.slug === activeCategory)?.name}
                <button onClick={() => handleCategoryChange('all')} className="ml-0.5 text-muted hover:text-primary transition-colors">
                  <X size={11} />
                </button>
              </span>
            )}
          </div>

          {/* Product Grid / List */}
          {loading ? (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }>
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} view={viewMode} />)}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200"
            >
              <Package size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">No products found</h3>
              <p className="text-muted text-sm mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'No products in this category yet.'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); handleCategoryChange('all'); }}
                className="btn-primary text-sm px-6 py-2.5"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${activeCategory}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7'
                  : 'flex flex-col gap-4'
                }
              >
                {filteredAndSorted.map((product, i) =>
                  viewMode === 'grid'
                    ? <ProductCard key={product.id} product={product} index={i} />
                    : <ProductListCard key={product.id} product={product} index={i} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      {!loading && filteredAndSorted.length > 0 && (
        <section className="bg-white border-t border-border py-16 lg:py-20">
          <div className="container-custom text-center">
            <AnimatedSection>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Need Help Choosing?</span>
              <h2 className="text-2xl lg:text-3xl font-black text-primary mt-3 mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-muted max-w-md mx-auto text-sm mb-8 leading-relaxed">
                Our equipment specialists are ready to help you find the perfect solution for your project requirements.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn-primary">
                  Contact Sales <ArrowRight size={15} />
                </Link>
                <a href="/vikamusk-company-profile.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Download Catalogue
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}

export default function Products() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
