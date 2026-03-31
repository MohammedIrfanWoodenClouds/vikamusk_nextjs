'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  {
    name: 'Products',
    href: '/products',
    children: [
      { name: 'Forklifts & Reach Trucks', href: '/products?category=forklifts-reach-trucks' },
      { name: 'Aerial Work Platforms', href: '/products?category=aerial-work-platforms' },
      { name: 'All Products', href: '/products' },
    ],
  },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-primary text-white/70 text-xs">
        <div className="container-custom flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <a href="mailto:sales@vikamusk.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail size={12} />
              sales@vikamusk.com
            </a>
            <a href="mailto:info@vikamusk.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone size={12} />
              info@vikamusk.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span>Ajman, UAE</span>
            <span>|</span>
            <span>Kochi, India</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="container-custom flex items-center justify-between h-16 lg:h-[68px]">
          {/* Logo — wrapped in constrained container */}
          <Link href="/" className="flex-shrink-0 relative" style={{ width: '140px', height: '36px' }}>
            <Image
              src="/images/logo.png"
              alt="Vikamusk International"
              fill
              className="object-contain object-left"
              priority
              sizes="140px"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-3 py-2 text-[13px] font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isActive(link.href)
                      ? 'text-accent'
                      : 'text-gray-700 hover:text-accent'
                  }`}
                >
                  {link.name}
                  {link.children && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {link.children && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-0.5 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2.5 text-[13px] text-gray-600 hover:text-accent hover:bg-amber-50 transition-colors font-medium"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-amber-600 text-white font-semibold text-[13px] px-5 py-2 rounded-md transition-all whitespace-nowrap"
            >
              Get a Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
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
              className="absolute right-0 top-0 h-full w-[min(300px,85vw)] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div className="relative" style={{ width: '110px', height: '28px' }}>
                    <Image
                      src="/images/logo.png"
                      alt="Vikamusk"
                      fill
                      className="object-contain object-left"
                      sizes="110px"
                    />
                  </div>
                  <button
                    onClick={closeMobile}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-0.5">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      <Link
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
                      {link.children && (
                        <div className="ml-3 space-y-0.5 mb-1 border-l-2 border-gray-100 pl-3">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={closeMobile}
                              className="block py-2 text-sm text-gray-500 hover:text-accent transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Downloads */}
                  <Link
                    href="/downloads"
                    onClick={closeMobile}
                    className={`block px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors ${
                      isActive('/downloads')
                        ? 'text-accent bg-amber-50'
                        : 'text-gray-700 hover:text-accent hover:bg-gray-50'
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
                    className="block w-full text-center bg-accent hover:bg-amber-600 text-white font-semibold py-3 rounded-md transition-colors"
                  >
                    Get a Quote
                  </Link>
                </div>

                {/* Mobile Contact */}
                <div className="mt-5 space-y-2.5 text-sm text-gray-500">
                  <a href="mailto:sales@vikamusk.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Mail size={14} /> sales@vikamusk.com
                  </a>
                  <a href="mailto:info@vikamusk.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Mail size={14} /> info@vikamusk.com
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
