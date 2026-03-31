import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Services & Support', href: '/services' },
  { name: 'Downloads', href: '/downloads' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

const productLinks = [
  { name: 'Diesel Heavy Forklift', href: '/products/diesel-heavy-forklift' },
  { name: 'Electric Forklift', href: '/products/electric-forklift' },
  { name: 'Electric Scissor Lift', href: '/products/electric-scissor-lift' },
  { name: 'Diesel Scissor Lift', href: '/products/diesel-scissor-lift' },
  { name: 'Articulated Boom Lift', href: '/products/articulated-boom-lift' },
  { name: 'Telescopic Boom Lift', href: '/products/telescopic-boom-lift' },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/images/logo.png"
                alt="Vikamusk International"
                width={160}
                height={40}
                className="h-9 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Founded in 2015. A trusted supplier of advanced construction and material handling solutions across UAE, India, and beyond.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:sales@vikamusk.com"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://www.google.com/maps/place/Vikamusk+Construction+Equipment+FZE/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all"
              >
                <MapPin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-accent transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-6">Products</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-accent transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">UAE Office (HQ)</p>
                <p className="text-white/70 text-sm">PO Box 932, Ajman Free Zone, Ajman, UAE</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">India Office</p>
                <p className="text-white/70 text-sm">Marine Drive, Kochi, Kerala, India</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:sales@vikamusk.com" className="text-accent hover:text-accent-light text-sm transition-colors">
                  sales@vikamusk.com
                </a>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">General Enquiries</p>
                <a href="mailto:info@vikamusk.com" className="text-accent hover:text-accent-light text-sm transition-colors">
                  info@vikamusk.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            Copyright © {new Date().getFullYear()} | Vikamusk International, All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white/70 text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/40 hover:text-white/70 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
