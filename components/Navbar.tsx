'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail } from 'lucide-react';

interface NavProduct { id: number; name: string; slug: string; }
interface NavSubCategory { id: number; name: string; slug: string; image: string; product_count: number; products: NavProduct[]; }
interface NavMainCategory { id: number; name: string; slug: string; icon: string; image: string; subCategories: NavSubCategory[]; }

const staticLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileSubExpanded, setMobileSubExpanded] = useState<string | null>(null);
  const [categories, setCategories] = useState<NavMainCategory[]>([]);
  const pathname = usePathname();

  // Fetch dynamic nav categories
  useEffect(() => {
    fetch('/api/public/categories?nav=true')
      .then(r => r.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (mobileOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isTransparent = pathname === '/' && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-gray-700';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Navbar without Top Bar */}

      {/* Main Navbar */}
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
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-accent/40 z-50 transition-all duration-300" 
             style={{ width: scrolled ? '100%' : '0%', opacity: scrolled ? 1 : 0 }} />

        <div className="container-custom flex items-center justify-between h-[88px] lg:h-[104px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative h-[50px] w-[220px] lg:h-[64px] lg:w-[280px]">
            <Image 
              src="/images/logo.png" 
              alt="Vikamusk International" 
              fill 
              className={`object-contain object-left scale-[1.15] transition-all duration-300 ${isTransparent ? 'brightness-0 invert' : ''}`}
              priority 
              sizes="(max-width: 1024px) 300px, 350px" 
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-4">
            {/* Home */}
            <Link href="/" className={`px-3 py-2.5 text-[15px] font-bold rounded-md transition-all whitespace-nowrap ${isActive('/') ? 'text-accent' : `${textColor} hover:text-accent hover:bg-white/10`}`}>
              Home
            </Link>

            {/* Products Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => { setActiveDropdown(null); setActiveSub(null); }}
            >
              <Link href="/products" className={`flex items-center gap-1.5 px-3 py-2.5 text-[15px] font-bold rounded-md transition-all whitespace-nowrap ${isActive('/products') || isActive('/categories') ? 'text-accent' : `${textColor} hover:text-accent hover:bg-white/10`}`}>
                Products
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'products' ? 'rotate-180 text-accent' : ''}`} />
              </Link>

              <AnimatePresence>
                {activeDropdown === 'products' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden"
                    style={{ minWidth: '680px' }}
                  >
                    <div className="flex">
                      {/* Main Categories column */}
                      <div className="w-[240px] bg-gray-50/80 border-r border-gray-100 py-3">
                        <p className="px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categories</p>
                        {categories.map((mc) => (
                          <div
                            key={mc.id}
                            onMouseEnter={() => setActiveSub(mc.slug)}
                            className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-all ${activeSub === mc.slug ? 'bg-white text-accent shadow-sm' : 'text-gray-600 hover:bg-white/60'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{mc.icon || '📁'}</span>
                              <span className="text-sm font-semibold">{mc.name}</span>
                            </div>
                            <ChevronRight size={14} className={`transition-colors ${activeSub === mc.slug ? 'text-accent' : 'text-gray-300'}`} />
                          </div>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2 px-5">
                          <Link href="/products" className="block py-2.5 text-sm font-bold text-accent hover:text-amber-600 transition-colors">
                            View All Products →
                          </Link>
                        </div>
                      </div>

                      {/* Sub Categories + Products column */}
                      <div className="flex-1 py-3 px-2 min-h-[280px]">
                        {categories.map((mc) => (
                          <div key={mc.id} className={activeSub === mc.slug ? 'block' : 'hidden'}>
                            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{mc.name} — Sub Categories</p>
                            <div className="grid grid-cols-2 gap-1">
                              {mc.subCategories.map((sc) => (
                                <Link key={sc.id} href={`/categories/${mc.slug}/${sc.slug}`} className="group px-4 py-3 rounded-xl hover:bg-gray-50 transition-all">
                                  <div className="flex items-center gap-2">
                                    {sc.image && (sc.image.startsWith('data:') || sc.image.startsWith('/')) ? (
                                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={sc.image} alt="" className="w-full h-full object-cover" />
                                      </div>
                                    ) : null}
                                    <div>
                                      <p className="text-sm font-semibold text-gray-700 group-hover:text-accent transition-colors">{sc.name}</p>
                                      <p className="text-[11px] text-gray-400">{sc.product_count} products</p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            {/* Category page link */}
                            <div className="mt-3 px-4 pt-3 border-t border-gray-100">
                              <Link href={`/categories/${mc.slug}`} className="text-xs font-semibold text-accent hover:text-amber-600 transition-colors">
                                View all {mc.name} →
                              </Link>
                            </div>
                          </div>
                        ))}
                        {!activeSub && categories.length > 0 && (
                          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                            Hover on a category to see sub-categories
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other static links */}
            {staticLinks.filter(l => l.name !== 'Home').map((link) => (
              <Link key={link.name} href={link.href} className={`px-3 py-2.5 text-[15px] font-bold rounded-md transition-all whitespace-nowrap ${isActive(link.href) ? 'text-accent' : `${textColor} hover:text-accent hover:bg-white/10`}`}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden md:inline-flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-[#001f3f] font-bold text-sm px-6 py-2.5 rounded-lg transition-all whitespace-nowrap shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-px">
              Get a Quote
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2 rounded-md transition-colors ${textColor} hover:bg-white/10`} aria-label="Toggle menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[60] bg-black/50 lg:hidden" onClick={closeMobile}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute right-0 top-0 h-full w-[min(320px,85vw)] bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div className="relative" style={{ width: '110px', height: '28px' }}>
                    <Image src="/images/logo.png" alt="Vikamusk" fill className="object-contain object-left" sizes="110px" />
                  </div>
                  <button onClick={closeMobile} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" aria-label="Close menu">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-0.5">
                  <Link href="/" onClick={closeMobile} className={`block px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${isActive('/') ? 'text-accent bg-amber-50' : 'text-gray-700 hover:text-accent hover:bg-gray-50'}`}>
                    Home
                  </Link>

                  {/* Products accordion */}
                  <div>
                    <button onClick={() => setMobileExpanded(mobileExpanded === 'products' ? null : 'products')} className={`w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${isActive('/products') ? 'text-accent bg-amber-50' : 'text-gray-700 hover:text-accent hover:bg-gray-50'}`}>
                      Products
                      <ChevronDown size={16} className={`transition-transform ${mobileExpanded === 'products' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileExpanded === 'products' && (
                      <div className="ml-3 space-y-0.5 mb-1 border-l-2 border-gray-100 pl-3">
                        <Link href="/products" onClick={closeMobile} className="block py-2 text-sm text-accent font-semibold">All Products</Link>
                        {categories.map((mc) => (
                          <div key={mc.id}>
                            <button onClick={() => setMobileSubExpanded(mobileSubExpanded === mc.slug ? null : mc.slug)} className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-accent">
                              <span className="flex items-center gap-1.5">
                                <span>{mc.icon}</span> {mc.name}
                              </span>
                              <ChevronDown size={12} className={`transition-transform ${mobileSubExpanded === mc.slug ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileSubExpanded === mc.slug && (
                              <div className="ml-4 space-y-0.5 border-l border-gray-100 pl-3">
                                <Link href={`/categories/${mc.slug}`} onClick={closeMobile} className="block py-1.5 text-xs text-accent font-semibold">View All</Link>
                                {mc.subCategories.map((sc) => (
                                  <Link key={sc.id} href={`/categories/${mc.slug}/${sc.slug}`} onClick={closeMobile} className="block py-1.5 text-xs text-gray-500 hover:text-accent transition-colors">
                                    {sc.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {staticLinks.filter(l => l.name !== 'Home').map((link) => (
                    <Link key={link.name} href={link.href} onClick={closeMobile} className={`block px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${isActive(link.href) ? 'text-accent bg-amber-50' : 'text-gray-700 hover:text-accent hover:bg-gray-50'}`}>
                      {link.name}
                    </Link>
                  ))}

                  <Link href="/downloads" onClick={closeMobile} className={`block px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${isActive('/downloads') ? 'text-accent bg-amber-50' : 'text-gray-700 hover:text-accent hover:bg-gray-50'}`}>
                    Downloads
                  </Link>
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 pt-5 border-t border-gray-100">
                  <Link href="/contact" onClick={closeMobile} className="block w-full text-center bg-accent hover:bg-amber-500 text-[#001f3f] font-bold py-3 rounded-lg transition-colors shadow-lg shadow-amber-500/20">
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
