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

  // Close mobile menu on route change
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
      <div className="hidden md:block bg-primary text-white/80 text-xs">
        <div className="container-custom flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <a href="mailto:sales@vikamusk.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail size={13} />
              sales@vikamusk.com
            </a>
            <a href="mailto:info@vikamusk.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone size={13} />
              info@vikamusk.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-white/50">
            <span>Ajman, UAE</span>
            <span className="text-white/30">|</span>
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
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-border'
            : 'bg-white border-b border-border/50'
        }`}
      >
        <div className="container-custom flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Vikamusk International"
              width={160}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive(link.href)
                      ? 'text-accent bg-accent/5'
                      : 'text-primary/70 hover:text-accent hover:bg-accent/5'
                  }`}
                >
                  {link.name}
                  {link.children && (
                    <ChevronDown
                      size={14}
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
                      className="absolute top-full left-0 mt-0.5 w-60 bg-white rounded-xl shadow-xl border border-border/50 py-2 z-50"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-primary/70 hover:text-accent hover:bg-accent/5 transition-colors font-medium"
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
              className="hidden md:inline-flex btn-primary text-sm !py-2.5 !px-5 whitespace-nowrap"
            >
              Get a Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors text-primary"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
              className="absolute right-0 top-0 h-full w-[min(320px,85vw)] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <Image
                    src="/images/logo.png"
                    alt="Vikamusk"
                    width={120}
                    height={30}
                    className="h-7 w-auto"
                  />
                  <button
                    onClick={closeMobile}
                    className="p-2 hover:bg-surface rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                          isActive(link.href)
                            ? 'text-accent bg-accent/5'
                            : 'text-primary/80 hover:text-accent hover:bg-accent/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                      {link.children && (
                        <div className="ml-4 space-y-0.5 mb-1">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={closeMobile}
                              className="block px-4 py-2 text-sm text-muted hover:text-accent transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Downloads in mobile only */}
                  <Link
                    href="/downloads"
                    onClick={closeMobile}
                    className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                      isActive('/downloads')
                        ? 'text-accent bg-accent/5'
                        : 'text-primary/80 hover:text-accent hover:bg-accent/5'
                    }`}
                  >
                    Downloads
                  </Link>
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Link
                    href="/contact"
                    onClick={closeMobile}
                    className="btn-primary w-full text-center block"
                  >
                    Get a Quote
                  </Link>
                </div>

                {/* Mobile Contact */}
                <div className="mt-6 space-y-3 text-sm text-muted">
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
