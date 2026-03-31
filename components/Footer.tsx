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
    <footer className="bg-[#0a1628] text-white">
      {/* Main Footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <div className="relative" style={{ width: '350px', height: '80px' }}>
                <Image
                  src="/images/logo.png"
                  alt="Vikamusk International"
                  fill
                  className="object-contain object-left invert brightness-0"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  sizes="350px"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Founded in 2015. A trusted supplier of advanced construction and material handling solutions across UAE, India, and beyond.
            </p>
            <div className="flex gap-2.5">
              <a
                href="mailto:sales@vikamusk.com"
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-accent hover:text-[#0a1628] transition-all text-gray-400"
              >
                <Mail size={16} />
              </a>
              <a
                href="https://www.google.com/maps/place/Vikamusk+Construction+Equipment+FZE/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-accent hover:text-[#0a1628] transition-all text-gray-400"
              >
                <MapPin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-5">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-5">Contact Info</h4>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">UAE Office (HQ)</p>
                <p className="text-gray-300 text-sm">PO Box 932, Ajman Free Zone, Ajman, UAE</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">India Office</p>
                <p className="text-gray-300 text-sm">Marine Drive, Kochi, Kerala, India</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Email</p>
                <a href="mailto:sales@vikamusk.com" className="text-accent hover:text-amber-300 text-sm transition-colors">
                  sales@vikamusk.com
                </a>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">General Enquiries</p>
                <a href="mailto:info@vikamusk.com" className="text-accent hover:text-amber-300 text-sm transition-colors">
                  info@vikamusk.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            Copyright © {new Date().getFullYear()} | Vikamusk International, All Rights Reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
