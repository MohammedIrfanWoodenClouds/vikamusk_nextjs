'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ArrowRight, Linkedin, ChevronRight, ArrowUp } from 'lucide-react';

interface MainCategory {
  id: string;
  name: string;
  slug: string;
  product_count: number;
}

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Industries', href: '/industries' },
  { name: 'Services & Support', href: '/services' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-[3px] h-[16px] bg-accent rounded-full flex-shrink-0" />
      <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/60">{children}</h4>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition-all duration-200"
      >
        <ChevronRight
          size={12}
          className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 text-accent transition-all duration-200 flex-shrink-0"
        />
        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{children}</span>
      </Link>
    </li>
  );
}

export default function Footer() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch dynamic product categories
  useEffect(() => {
    fetch('/api/public/categories')
      .then(r => r.json())
      .then(data => {
        if (data.categories) {
          const unique = Array.from(
            new Map(data.categories.map((c: MainCategory) => [c.slug, c])).values()
          ) as MainCategory[];
          setCategories(unique);
        }
      })
      .catch(() => {});
  }, []);

  // Back-to-top button visibility
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const iconLinks = [
    {
      href: 'mailto:sales@vikamusk.com',
      icon: <Mail size={15} />,
      label: 'Email sales',
      external: false,
    },
    {
      href: 'https://www.google.com/maps/place/Vikamusk+Construction+Equipment+FZE/',
      icon: <MapPin size={15} />,
      label: 'Find us on map',
      external: true,
    },
    {
      href: 'https://www.linkedin.com/company/vikamusk-construction-equipment-fze/posts/?feedView=all',
      icon: <Linkedin size={15} />,
      label: 'LinkedIn',
      external: true,
    },
  ];

  return (
    <>
      <footer 
        className="relative z-20 bg-[#05101f] text-white overflow-hidden pt-20 lg:pt-24"
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Bottom vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/25" />

        {/* Top accent line */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent" />

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div className="relative container-custom pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-x-20 items-start">

            {/* Brand */}
            <div>
              <Link href="/" className="inline-block mb-10">
                <div className="relative" style={{ width: '150px', height: '40px' }}>
                  <Image
                    src="/images/logo-white.png"
                    alt="Vikamusk International"
                    fill
                    className="object-contain object-left"
                    sizes="150px"
                  />
                </div>
              </Link>

              {/* 1rem forced margin */}
              <p 
                className="text-white/45 text-sm leading-relaxed max-w-[280px]" 
                style={{ marginBottom: '1rem', display: 'block' }}
              >
                Founded in 2015. Trusted supplier of advanced construction and material
                handling solutions across UAE & beyond.
              </p>

              {/* Stat cards in a line */}
              <div 
                className="flex gap-4 flex-wrap" 
                style={{ marginBottom: '1rem', display: 'flex' }}
              >
                {[
                  { value: '10+', label: 'Years' },
                  { value: '50+', label: 'Products' },
                  { value: '15+', label: 'Markets' },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-white/[0.04] border border-white/[0.07] py-2.5 text-center"
                  >
                    <div className="text-accent font-bold text-sm leading-none">{stat.value}</div>
                    <div className="text-white/30 text-[10px] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Icon buttons */}
              <div 
                className="flex gap-4" 
                style={{ marginTop: '1rem', display: 'flex' }}
              >
                {iconLinks.map(({ href, icon, label, external }) =>
                  external ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/45 hover:bg-accent hover:border-accent hover:text-[#001f3f] hover:scale-110 transition-all duration-200"
                    >
                      {icon}
                    </a>
                  ) : (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/45 hover:bg-accent hover:border-accent hover:text-[#001f3f] hover:scale-110 transition-all duration-200"
                    >
                      {icon}
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:pt-8" style={{ marginTop: '1rem' }}>
              <SectionTitle>Quick Links</SectionTitle>
              <ul className="space-y-4">
                {quickLinks.map(link => (
                  <FooterLink key={link.name} href={link.href}>{link.name}</FooterLink>
                ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div className="lg:pt-8" style={{ marginTop: '1rem' }}>
              <SectionTitle>Product Categories</SectionTitle>
              <ul className="space-y-4">
                <FooterLink href="/products">All Products</FooterLink>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="group flex items-center justify-between text-sm text-white/45 hover:text-white transition-all duration-200"
                    >
                      <span className="flex items-center gap-1.5">
                        <ChevronRight
                          size={12}
                          className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 text-accent transition-all duration-200 flex-shrink-0"
                        />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                          {cat.name}
                        </span>
                      </span>
                      {cat.product_count > 0 && (
                        <span className="text-[10px] bg-white/[0.06] border border-white/[0.08] text-white/30 px-1.5 py-0.5 rounded tabular-nums">
                          {cat.product_count}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li className="text-white/20 text-xs italic">Loading…</li>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:pt-8" style={{ marginTop: '1rem' }}>
              <SectionTitle>Contact Info</SectionTitle>
              <div className="space-y-4" style={{ marginTop: '1rem' }}>
                {/* Office cards */}
                {[
                  { region: 'Ajman - UAE (HQ)', address: 'Vikamusk Construction Equipment FZE, Ajman Free Zone, Ajman, United Arab Emirates' },
                  { region: 'Dubai - UAE', address: 'Vikamusk Construction Equipment LLC, Bur Dubai, Dubai, United Arab Emirates' },
                  { region: 'Sharjah - UAE (Warehouse)', address: 'Vikamusk Construction Equipment, Al Sajaa Industrial Area, Sharjah, United Arab Emirates' },
                  { region: 'Kochi - India', address: 'Vikamusk Construction Equipment, Kochi - India' },
                ].map(({ region, address }) => (
                  <div
                    key={region}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.13] transition-colors duration-200"
                    style={{ padding: '16px', marginBottom: '16px' }}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-accent/80 mb-2">
                      {region}
                    </p>
                    <p className="text-white/50 text-sm leading-relaxed">{address}</p>
                  </div>
                ))}

                {/* Email links */}
                <div 
                  className="space-y-4"
                  style={{ marginTop: '1.5rem' }}
                >
                  {[
                    { href: 'mailto:sales@vikamusk.com', label: 'Official Support', address: 'sales@vikamusk.com' },
                    { href: 'mailto:career@vikamusk.com', label: 'Career Support', address: 'career@vikamusk.com' },
                  ].map(({ href, label, address }) => (
                    <a key={href} href={href} className="flex items-center gap-2.5 group" style={{ marginBottom: '1rem' }}>
                      <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-200">
                        <Mail size={11} className="text-accent" />
                      </div>
                      <div>
                        <span className="text-[9px] text-white/25 uppercase tracking-wider block leading-none mb-0.5">
                          {label}
                        </span>
                        <span className="text-sm text-accent group-hover:text-white transition-colors duration-200">
                          {address}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA banner ──────────────────────────────────────────── */}
          <div className="mt-16 lg:mt-20 rounded-2xl border border-accent/20 bg-gradient-to-r from-white/[0.025] via-accent/[0.04] to-white/[0.025] px-7 py-7 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-52 h-32 bg-accent/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-36 h-24 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0">
                <ArrowRight size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-white font-bold text-base lg:text-lg tracking-tight">
                  Ready to power your next project?
                </p>
                <p className="text-white/45 text-sm mt-0.5">
                  Get expert guidance from our equipment specialists.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="relative flex-shrink-0 inline-flex items-center gap-2 bg-accent hover:bg-white text-[#001f3f] font-bold text-[15px] rounded-full transition-all duration-300 whitespace-nowrap shadow-lg shadow-amber-500/25 hover:-translate-y-px hover:shadow-white/20"
              style={{ padding: '12px 28px' }}
            >
              Get a Quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="relative border-t border-white/[0.06] bg-black/20">
          <div className="container-custom py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/25 text-xs" style={{ marginTop: '1rem' }}>
              © {new Date().getFullYear()} Vikamusk International. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="text-white/25 hover:text-white/60 text-xs transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/25 hover:text-white/60 text-xs transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back-to-top button (portalled outside footer for z-index independence) */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-accent text-[#001f3f] flex items-center justify-center shadow-lg shadow-amber-500/30 hover:bg-white hover:scale-110 transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp size={16} />
      </button>
    </>
  );
}
