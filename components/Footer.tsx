'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

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
  { name: 'Downloads', href: '/downloads' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-sm text-white/45 hover:text-white transition-colors duration-200"
      >
        <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-accent flex-shrink-0 transition-colors" />
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const [categories, setCategories] = useState<MainCategory[]>([]);

  useEffect(() => {
    fetch('/api/public/categories')
      .then(r => r.json())
      .then(data => {
        if (data.categories) {
          // Deduplicate by slug in case of DB inconsistency
          const unique = Array.from(
            new Map(data.categories.map((c: MainCategory) => [c.slug, c])).values()
          ) as MainCategory[];
          setCategories(unique);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative z-20 bg-[#05101f] text-white border-t border-white/[0.06] mt-0">
      <div className="h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent" />

      <div className="container-custom pt-20 pb-12 lg:pt-24 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-x-16 lg:gap-y-14">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-8">
              <div className="relative" style={{ width: '160px', height: '42px' }}>
                <Image
                  src="/images/logo-white.png"
                  alt="Vikamusk International"
                  fill
                  className="object-contain object-left"
                  sizes="160px"
                />
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              Founded in 2015. Trusted supplier of advanced construction and material handling solutions across UAE, India, and beyond.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:sales@vikamusk.com"
                title="Email sales"
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-[#05101f] transition-all text-white/45"
              >
                <Mail size={16} />
              </a>
              <a
                href="https://www.google.com/maps/place/Vikamusk+Construction+Equipment+FZE/"
                target="_blank"
                rel="noopener noreferrer"
                title="Find us on map"
                className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-[#05101f] transition-all text-white/45"
              >
                <MapPin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <FooterLink key={link.name} href={link.href}>{link.name}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Dynamic Product Categories */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6">Product Categories</h4>
            <ul className="space-y-3">
              <FooterLink href="/products">All Products</FooterLink>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group flex items-center justify-between text-sm text-white/45 hover:text-white transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-accent flex-shrink-0 transition-colors" />
                      {cat.name}
                    </span>
                    {cat.product_count > 0 && (
                      <span className="text-[10px] text-white/20 tabular-nums">{cat.product_count}</span>
                    )}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-white/20 text-xs italic">No categories yet</li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6">Contact Info</h4>
            <div className="space-y-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-1">UAE Office (HQ)</p>
                <p className="text-white/55 text-sm leading-relaxed">PO Box 932, Ajman Free Zone, Ajman, UAE</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-1">India Office</p>
                <p className="text-white/55 text-sm">Marine Drive, Kochi, Kerala, India</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-1">Sales Enquiries</p>
                <a href="mailto:sales@vikamusk.com" className="text-accent hover:text-amber-300 text-sm transition-colors">
                  sales@vikamusk.com
                </a>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-1">General</p>
                <a href="mailto:info@vikamusk.com" className="text-accent hover:text-amber-300 text-sm transition-colors">
                  info@vikamusk.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-20 pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-1.5">
            <p className="text-white font-bold text-lg tracking-tight">Ready to power your next project?</p>
            <p className="text-white/45 text-sm max-w-md">Get expert guidance from our equipment specialists.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-accent hover:bg-amber-500 text-[#05101f] font-bold text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 whitespace-nowrap"
          >
            Get a quote <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/[0.06] bg-black/20">
        <div className="container-custom py-6 lg:py-7 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Vikamusk International. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-white/25 hover:text-white/60 text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/25 hover:text-white/60 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
