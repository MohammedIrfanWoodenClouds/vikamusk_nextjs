'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronDown, Shield, Wrench, Globe, Award, Truck, Headphones,
  MapPin, CheckCircle2, Boxes, Star, Package,
} from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';
import { stats } from '@/lib/data';

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

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          setCounted(true);
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            if (ref.current) ref.current.textContent = `${Math.floor(eased * target)}${suffix}`;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, suffix, counted]);

  return <span ref={ref}>0{suffix}</span>;
}

const statIcons = [Truck, Package, Boxes, Award, Globe, Headphones];

const whyItems = [
  { icon: <Shield size={22} />, title: 'Quality Assurance', desc: 'Collaboration with 10+ leading industrial manufacturers ensures premium equipment meeting international standards.' },
  { icon: <Globe size={22} />, title: 'Global Presence', desc: 'Operations across UAE, India, China, Saudi Arabia & Oman — serving 20+ countries worldwide.' },
  { icon: <Wrench size={22} />, title: 'Technical Excellence', desc: 'Expert engineering team bridging innovation and reliability for holistic equipment solutions.' },
  { icon: <Award size={22} />, title: '10+ Years Experience', desc: 'A decade of proven success in construction and material handling, building lasting partnerships.' },
  { icon: <Truck size={22} />, title: 'Comprehensive Range', desc: '6 categories, 35+ series, and 100+ models covering Forklifts, Aerial Platforms and more.' },
  { icon: <Headphones size={22} />, title: 'After-Sales Support', desc: '10+ service divisions providing dependable maintenance, spare parts and technical assistance.' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/products?featured=true').then(r => r.json()),
      fetch('/api/public/categories').then(r => r.json()),
    ]).then(([prodsData, catsData]) => {
      const rawProds = prodsData.products || [];
      const uniqueProds = Array.from(new Map(rawProds.map((p: any) => [p.slug, p])).values());
      setFeaturedProducts(uniqueProds.map(normalizeProduct));

      const rawCats = catsData.categories || [];
      const uniqueCats = Array.from(new Map(rawCats.map((c: any) => [c.slug, c])).values());
      setCategories(uniqueCats);
    }).catch(() => {}).finally(() => setLoadingData(false));
  }, []);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[88vh] lg:min-h-screen flex items-center overflow-hidden bg-primary">
        {/* Background layers */}
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.png" alt="Construction Equipment" fill className="object-cover opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="container-custom relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/75 text-xs sm:text-sm mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Established 2015 &nbsp;·&nbsp; UAE, India & Global
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              A World of{' '}
              <span className="gradient-text">Creativity</span>
              <br />& Engineering{' '}
              <span className="gradient-text">Excellence</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="text-base lg:text-lg text-white/60 max-w-xl mb-10 leading-relaxed"
            >
              Trusted supplier of advanced construction and material handling solutions. Specialising in Forklifts and Aerial Work Platforms across UAE, India & beyond.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/products" className="btn-primary text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4">
                Explore Products <ArrowRight size={17} />
              </Link>
              <Link href="/contact" className="btn-secondary text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-white/30"
        >
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-14 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
            {stats.map((stat, i) => {
              const Icon = statIcons[i] || Award;
              return (
                <div key={i} className="flex flex-col items-center text-center relative group">
                  {/* Divider */}
                  {i > 0 && (
                    <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gray-100" />
                  )}
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <div className="text-3xl lg:text-4xl font-black text-primary tabular-nums">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimatedSection direction="left">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 relative">
                <Image src="/images/company/vikamusk-reception.png" alt="Vikamusk Office" fill className="object-cover" />
                {/* Gradient overlay for badge legibility */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/70 to-transparent" />
                {/* Badge inside image — no overflow issues */}
                <div className="absolute bottom-5 right-5 text-right">
                  <p className="text-3xl font-black text-white leading-none">10+</p>
                  <p className="text-[10px] text-white/65 uppercase tracking-widest mt-1">Years of Excellence</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Discover Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-5 leading-tight">
                About Vikamusk International
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Founded in 2015 in India and proudly established in the Ajman Free Zone of UAE, Vikamusk Construction Equipment is a trusted supplier of advanced construction and material handling solutions.
              </p>
              <p className="text-muted leading-relaxed mb-8">
                Serving clients across China, UAE, Saudi Arabia, Oman and India. Collaborating with 10+ industrial manufacturers worldwide for reliable, high-performance equipment.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'ISO-compliant equipment from verified global manufacturers',
                  'Dedicated after-sales and technical support teams',
                  'Custom equipment solutions for unique project needs',
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                    <CheckCircle2 size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn-outline">Learn More <ArrowRight size={15} /></Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT CATEGORIES ===== */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-14">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">What We Offer</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">Our Product Categories</h2>
            <p className="text-muted max-w-xl mx-auto text-sm lg:text-base">
              Explore our comprehensive range of construction and material handling equipment designed for performance, reliability, and safety.
            </p>
          </AnimatedSection>

          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-52 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <Boxes size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold mb-1">No categories yet</p>
              <p className="text-gray-400 text-sm">Product categories will appear here once added via the admin panel.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {categories.map((cat: any) => (
                <StaggerItem key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/25 transition-all duration-300"
                  >
                    {/* Image area */}
                    <div className="relative aspect-[16/7] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {cat.image && (cat.image.startsWith('data:') || cat.image.startsWith('/')) ? (
                        cat.image.startsWith('data:') ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl opacity-40">{cat.icon || '📦'}</span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Info */}
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          {cat.icon && <span className="text-lg">{cat.icon}</span>}
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors truncate">
                            {cat.name}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{cat.description}</p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        <span className="text-2xl font-black text-primary tabular-nums">{cat.product_count || 0}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Products</span>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="px-6 pb-5">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-accent transition-colors">
                        Browse Category <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {categories.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/products" className="btn-outline text-sm px-6 py-3">
                View All Products <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Highlighted Equipment</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3">Featured Products</h2>
            </div>
            <Link href="/products" className="btn-outline text-sm py-2.5 px-5 whitespace-nowrap">
              View All <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-dashed border-gray-200">
              <Star size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold mb-1">No featured products yet</p>
              <p className="text-gray-400 text-sm mb-5">Mark products as "Featured" in the admin panel to showcase them here.</p>
              <Link href="/products" className="btn-primary text-sm px-6 py-2.5">
                Browse All Products <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.slice(0, 6).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-14">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Why Vikamusk</span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-3 mb-4">Why Choose Us</h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm lg:text-base">
              Driven by a mission to foster &quot;A World of Creativity and Engineering Excellence&quot; — your trusted equipment partner.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {whyItems.map((item, i) => (
              <StaggerItem key={i}>
                <div className="group h-full p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/20 transition-all duration-300 hover:-translate-y-1">
                  {/* Accent top line */}
                  <div className="w-8 h-0.5 bg-accent/40 group-hover:bg-accent group-hover:w-12 transition-all duration-300 mb-5 rounded-full" />
                  <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== GLOBAL PRESENCE ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimatedSection direction="left">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Reach</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-5 leading-tight">Global Presence</h2>
              <p className="text-muted leading-relaxed mb-8 text-sm lg:text-base">
                Vikamusk continues to build lasting partnerships and set new standards in equipment reliability. Our market networks and service systems span the globe, delivering to 20+ countries.
              </p>
              <div className="space-y-3">
                {[
                  { flag: '🇦🇪', country: 'UAE (Headquarters)', city: 'Ajman Free Zone', detail: 'Head Office & Warehouse' },
                  { flag: '🇮🇳', country: 'India', city: 'Kochi, Kerala', detail: 'Regional Operations Office' },
                  { flag: '🇨🇳', country: 'China', city: 'Qingdao', detail: 'Manufacturing Partnership' },
                ].map((loc, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border/40 hover:border-accent/20 hover:shadow-sm transition-all">
                    <span className="text-2xl">{loc.flag}</span>
                    <div>
                      <h4 className="font-bold text-primary text-sm">{loc.country}</h4>
                      <p className="text-xs text-muted">{loc.city} — {loc.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                <Image src="/images/company/vikamusk-company-china-.png" alt="Vikamusk China Operations" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/75 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-accent" />
                    <p className="text-white/70 text-xs uppercase tracking-wider">Partner Facility</p>
                  </div>
                  <p className="text-white font-bold">Vikamusk Partner Facility — China</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== BUILD YOUR DREAM CTA ===== */}
      <section className="relative py-24 lg:py-36 overflow-hidden bg-[#001229]">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#001229] to-[#000d1a]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(245,158,11,0.8) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/5 blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-8 uppercase tracking-widest">
              <Star size={12} />
              Partner With Excellence
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
              Build Your Dream With{' '}
              <span className="gradient-text">Vikamusk</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto mb-10 text-base lg:text-lg leading-relaxed">
              10+ Years of Undefeated Success. Ready to power your next project with world-class equipment and dedicated engineering support?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-amber-500 text-[#001229] font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-px"
              >
                View Products <ArrowRight size={17} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/15 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                Contact Us <ArrowRight size={17} />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4">
              {[
                { value: '10+', label: 'Global Manufacturers' },
                { value: '20+', label: 'Countries Served' },
                { value: '100+', label: 'Equipment Models' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-xl font-black text-accent">{item.value}</span>
                  <span className="text-white/35 text-xs uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
