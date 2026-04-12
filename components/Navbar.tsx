'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, ChevronDown, ChevronRight, Package, Loader2 } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface NavProduct {
  id: string;
  name: string;
  slug: string;
}

interface NavMainCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  products: NavProduct[];
}

/* ------------------------------------------------------------------ */
/*  Static nav links                                                   */
/* ------------------------------------------------------------------ */
const staticLinks = [
  { name: 'Home', href: '/' },
  { name: 'Industries', href: '/industries' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

/* ------------------------------------------------------------------ */
/*  Navbar Component                                                   */
/* ------------------------------------------------------------------ */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop mega‑menu
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCatSlug, setActiveCatSlug] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile accordions
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);

  // Data
  const [categories, setCategories] = useState<NavMainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pathname = usePathname();

  /* ---- Fetch categories from admin‑managed DB ---- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch('/api/public/categories?nav=true')
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        // De-duplicate categories by slug (keep first occurrence)
        const seen = new Set<string>();
        const unique: NavMainCategory[] = [];
        for (const cat of data.categories ?? []) {
          if (!seen.has(cat.slug)) {
            seen.add(cat.slug);
            unique.push(cat);
          }
        }
        setCategories(unique);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- Scroll listener ---- */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* ---- Close mobile on route change ---- */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ---- Lock body scroll when mobile menu open ---- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /* ---- Helpers ---- */
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const openMega = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
    // Auto‑select first category if nothing selected
    if (!activeCatSlug && categories.length > 0) {
      setActiveCatSlug(categories[0].slug);
    }
  }, [activeCatSlug, categories]);

  const closeMega = useCallback(() => {
    megaTimeout.current = setTimeout(() => {
      setMegaOpen(false);
      setActiveCatSlug(null);
    }, 150); // small delay so mouse can travel across gap
  }, []);

  const cancelCloseMega = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
  }, []);

  const isTransparent = pathname === '/' && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-gray-700';
  const bgColor = scrolled ? 'bg-white/80 backdrop-blur-xl' : isTransparent ? 'bg-transparent' : 'bg-white';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  /* ---- Active category data ---- */
  const activeCategory = categories.find((c) => c.slug === activeCatSlug) ?? null;

  return (
    <>
      {/* ─────────────────── DESKTOP NAVBAR ─────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border-gray-200'
            : isTransparent
              ? 'bg-transparent border-transparent'
              : 'bg-white border-gray-100'
        }`}
      >
        {/* Progress accent line */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-accent/40 z-50 transition-all duration-300"
          style={{ width: scrolled ? '100%' : '0%', opacity: scrolled ? 1 : 0 }}
        />

        <div className={`container-custom flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'h-[64px] lg:h-[72px]' : 'h-[88px] lg:h-[104px]'
        }`}>
          {/* Logo */}
          <Link 
            href="/" 
            className="flex-shrink-0 relative transition-all duration-500 h-[44px] w-[180px] lg:h-[52px] lg:w-[210px]"
          >
            <Image
              src={isTransparent ? "/images/logo-white.png" : "/images/logo-black.png"}
              alt="Vikamusk International"
              fill
              className="object-contain object-left transition-all duration-500"
              priority
              sizes="(max-width: 1024px) 240px, 280px"
            />
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-4">
            {/* Home */}
            <Link
              href="/"
              className={`px-3 py-2.5 text-[15px] font-bold rounded-md transition-all whitespace-nowrap ${
                isActive('/') ? 'text-accent' : `${textColor} hover:text-accent hover:bg-white/10`
              }`}
            >
              Home
            </Link>

            {/* ── Products Mega Menu Trigger ── */}
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <Link
                href="/products"
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[15px] font-bold rounded-md transition-all whitespace-nowrap ${
                  isActive('/products') || isActive('/categories')
                    ? 'text-accent'
                    : `${textColor} hover:text-accent hover:bg-white/10`
                }`}
              >
                Products
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${megaOpen ? 'rotate-180 text-accent' : ''}`}
                />
              </Link>

              {/* ── Mega Menu Dropdown ── */}
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    onMouseEnter={cancelCloseMega}
                    onMouseLeave={closeMega}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden rounded-2xl w-fit"
                    style={{ 
                      padding: '1.25rem 2rem' 
                    }}
                  >
                    {/* Loading state */}
                    {loading && (
                      <div className="flex items-center justify-center py-16 px-12">
                        <Loader2 size={24} className="animate-spin text-accent mr-3" />
                        <span className="text-sm text-gray-400">Loading categories…</span>
                      </div>
                    )}

                    {/* Error state */}
                    {!loading && error && (
                      <div className="flex flex-col items-center justify-center py-16 px-12">
                        <p className="text-sm text-gray-400 mb-2">Failed to load categories</p>
                        <Link href="/products" className="text-sm font-semibold text-accent hover:text-amber-600 transition-colors">
                          Browse All Products →
                        </Link>
                      </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && categories.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 px-12">
                        <Package size={32} className="text-gray-300 mb-3" />
                        <p className="text-sm text-gray-400 mb-2">No categories yet</p>
                        <Link href="/products" className="text-sm font-semibold text-accent hover:text-amber-600 transition-colors">
                          Browse All Products →
                        </Link>
                      </div>
                    )}

                    {/* Loaded state with categories */}
                    {!loading && !error && categories.length > 0 && (
                    <div className="w-full relative">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100/60">
                        <div className="flex items-center gap-6">
                          <h3 className="text-lg font-black text-[#001f3f] tracking-tight">
                            Product Catalog
                          </h3>
                        </div>
                        <Link 
                          href="/products"
                          className="group flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-accent transition-all"
                        >
                          View All Equipment
                          <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>

                      {/* Main Split Layout */}
                      <div className="flex gap-1">
                        {/* Left: Category Navigation */}
                        <div className="w-[320px] pr-8 border-r border-gray-50 py-1">
                           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 px-3">
                             Categories
                           </p>
                           <div className="space-y-0.5">
                            {categories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                onMouseEnter={() => setActiveCatSlug(cat.slug)}
                                className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                                  activeCatSlug === cat.slug 
                                    ? 'bg-amber-50 text-accent translate-x-1' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#001f3f]'
                                }`}
                              >
                                <span className="text-[14px] font-bold">
                                  {cat.name}
                                </span>
                                <ChevronRight 
                                  size={14} 
                                  className={`transition-all duration-300 ${
                                    activeCatSlug === cat.slug ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                  }`} 
                                />
                              </Link>
                            ))}
                           </div>
                        </div>

                        {/* Right: Products Display - Dynamic Width */}
                        <motion.div 
                          className="pl-10 py-1 border-l border-gray-50/50"
                          initial={false}
                          animate={{ 
                            width: (activeCategory?.products?.length ?? 0) > 0 ? 460 : 340,
                            opacity: activeCategory ? 1 : 0.5 
                          }}
                          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                        >
                           <AnimatePresence mode="wait">
                             <motion.div
                               key={activeCatSlug || 'empty'}
                               initial={{ opacity: 0, x: 15 }}
                               animate={{ opacity: 1, x: 0 }}
                               exit={{ opacity: 0, x: -10 }}
                               transition={{ duration: 0.2 }}
                             >
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3">
                                  {activeCategory ? `Products in ${activeCategory.name}` : 'Select Category'}
                                </p>

                               {activeCategory && activeCategory.products?.length ? (
                                   <div className="grid grid-cols-1 gap-y-1">
                                     {activeCategory.products.map((p) => (
                                       <Link
                                         key={p.id}
                                         href={`/products/${p.slug}`}
                                         className="group py-1.5 px-2 -mx-2 rounded-md hover:bg-slate-50 transition-all duration-200"
                                       >
                                           <p className="text-[13px] font-bold text-gray-700 group-hover:text-accent transition-colors leading-tight">
                                             {p.name}
                                           </p>
                                       </Link>
                                     ))}
                                   </div>
                               ) : (
                                 <div className="py-12 text-center">
                                    <Package size={20} className="mx-auto text-gray-200 mb-2" />
                                    <p className="text-[11px] text-gray-400 font-medium italic">
                                      {activeCategory ? 'No specialized items listed yet' : 'Choose a category to browse products'}
                                    </p>
                                 </div>
                               )}
                             </motion.div>
                           </AnimatePresence>
                        </motion.div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-gray-100/60 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                         <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            Official Global Catalog — Heavy-Duty Industrial Equipment
                         </p>
                      </div>
                    </div>


                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other static links (excluding Home — already rendered above) */}
            {staticLinks
              .filter((l) => l.name !== 'Home')
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2.5 text-[15px] font-bold rounded-md transition-all whitespace-nowrap ${
                    isActive(link.href) ? 'text-accent' : `${textColor} hover:text-accent hover:bg-white/10`
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center gap-2 bg-accent hover:bg-white text-[#001f3f] hover:text-[#001f3f] font-bold text-[15px] rounded-full flex-shrink-0 transition-all duration-300 whitespace-nowrap shadow-lg shadow-amber-500/20 hover:shadow-white/20 hover:-translate-y-px border-2 border-transparent hover:border-black active:scale-[0.98]"
              style={{
                padding: scrolled ? '10px 24px' : '12px 28px',
                marginLeft: '16px',
              }}
            >
              Get a Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors ${textColor} hover:bg-white/10`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ─────────────────── MOBILE MENU ─────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
            onClick={closeMobile}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[min(320px,85vw)] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div className="relative" style={{ width: '140px', height: '36px' }}>
                    <Image src="/images/logo-black.png" alt="Vikamusk" fill className="object-contain object-left" sizes="140px" />
                  </div>
                  <button onClick={closeMobile} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" aria-label="Close menu">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-0.5">
                  {/* Home */}
                  <Link
                    href="/"
                    onClick={closeMobile}
                    className={`block px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${
                      isActive('/') ? 'text-accent bg-amber-50' : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                    }`}
                  >
                    Home
                  </Link>

                  {/* ── Products Accordion ── */}
                  <div>
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${
                        isActive('/products') || isActive('/categories')
                          ? 'text-accent bg-amber-50'
                          : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                      }`}
                    >
                      Products
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${mobileProductsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 space-y-0.5 mb-1 border-l-2 border-gray-100 pl-3">
                            {/* All Products link */}
                            <Link href="/products" onClick={closeMobile} className="block py-2 text-sm text-accent font-semibold">
                              All Products
                            </Link>

                            {/* Loading */}
                            {loading && (
                              <div className="flex items-center gap-2 py-2">
                                <Loader2 size={14} className="animate-spin text-gray-300" />
                                <span className="text-xs text-gray-400">Loading…</span>
                              </div>
                            )}

                            {/* Error */}
                            {!loading && error && (
                              <p className="py-2 text-xs text-gray-400">Could not load categories</p>
                            )}

                            {/* Categories */}
                            {!loading &&
                              !error &&
                              categories.map((mc) => (
                                <div key={mc.id}>
                                  <button
                                    onClick={() => setMobileSubOpen(mobileSubOpen === mc.slug ? null : mc.slug)}
                                    className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-accent transition-colors"
                                  >
                                    <span className="truncate">{mc.name}</span>
                                    <ChevronDown
                                      size={12}
                                      className={`flex-shrink-0 ml-1 transition-transform duration-300 ${
                                        mobileSubOpen === mc.slug ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>

                                  <AnimatePresence>
                                    {mobileSubOpen === mc.slug && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                      >
                                        <div className="ml-4 space-y-0.5 border-l border-gray-100 pl-3">
                                          <Link
                                            href={`/categories/${mc.slug}`}
                                            onClick={closeMobile}
                                            className="block py-1.5 text-xs text-accent font-semibold"
                                          >
                                            View All {mc.name}
                                          </Link>

                                          {mc.products && mc.products.length === 0 && (
                                            <p className="py-1.5 text-xs text-gray-400 italic">No products yet</p>
                                          )}

                                          {mc.products && mc.products.map((p) => (
                                            <Link
                                              key={p.id}
                                              href={`/products/${p.slug}`}
                                              onClick={closeMobile}
                                              className="block py-1.5 text-xs text-gray-500 hover:text-accent transition-colors"
                                            >
                                              {p.name}
                                            </Link>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Other static links */}
                  {staticLinks
                    .filter((l) => l.name !== 'Home')
                    .map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={closeMobile}
                        className={`block px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${
                          isActive(link.href)
                            ? 'text-accent bg-amber-50'
                            : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}

                  <Link
                    href="/downloads"
                    onClick={closeMobile}
                    className={`block px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${
                      isActive('/downloads') ? 'text-accent bg-amber-50' : 'text-gray-700 hover:text-accent hover:bg-gray-50'
                    }`}
                  >
                    Downloads
                  </Link>
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 pt-5 border-t border-gray-100">
                  <Link
                    href="/contact"
                    onClick={closeMobile}
                    className="block w-full text-center bg-accent hover:bg-amber-500 text-[#001f3f] font-bold text-[15px] rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                    style={{ padding: '14px 0' }}
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
