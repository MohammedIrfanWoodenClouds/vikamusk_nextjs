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

function categoryBodyText(cat: { name?: string; description?: string }) {
  const name = (cat.name || '').trim();
  const desc = (cat.description || '').trim();
  if (!desc) return null;
  if (desc.toLowerCase() === name.toLowerCase()) return null;
  if (name && desc.toLowerCase().startsWith(name.toLowerCase()) && desc.length <= name.length + 3) return null;
  return desc;
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

  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const isCarousel = featuredProducts.length > 3;

  useEffect(() => {
    if (!isCarousel) return;
    let isHovered = false;
    
    const handleMouseEnter = () => isHovered = true;
    const handleMouseLeave = () => isHovered = false;
    
    const elem = featuredScrollRef.current;
    if (elem) {
      elem.addEventListener('mouseenter', handleMouseEnter);
      elem.addEventListener('mouseleave', handleMouseLeave);
      
      // Initialize to the middle block of duplicates to allow smooth swiping left & right
      setTimeout(() => {
        if (!featuredScrollRef.current) return;
        const first = featuredScrollRef.current.children[0] as HTMLElement;
        if (first) {
           featuredScrollRef.current.scrollLeft = featuredProducts.length * (first.offsetWidth + 24);
        }
      }, 100);
    }

    const interval = setInterval(() => {
      if (!featuredScrollRef.current || isHovered) return;
      const el = featuredScrollRef.current;
      const firstChild = el.children[0] as HTMLElement;
      if (!firstChild) return;
      
      const step = firstChild.offsetWidth + 24;
      el.scrollBy({ left: step, behavior: 'smooth' });

      // Teleport instantly back after smooth scroll completes to create infinite loop feeling
      setTimeout(() => {
        if (!featuredScrollRef.current) return;
        const singleBlockWidth = featuredProducts.length * step;
        if (featuredScrollRef.current.scrollLeft >= singleBlockWidth * 2 - 10) {
          featuredScrollRef.current.scrollBy({ left: -singleBlockWidth, behavior: 'auto' });
        }
      }, 600);
    }, 3000);

    return () => {
      clearInterval(interval);
      if (elem) {
        elem.removeEventListener('mouseenter', handleMouseEnter);
        elem.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [featuredProducts]);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/products?featured=true').then(r => r.json()),
      fetch('/api/public/categories?featured=true').then(r => r.json()),
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm font-medium tracking-wide mb-8"
              style={{ padding: '0.45rem 1.25rem', margin: '0.5rem' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
              Established 2015 &nbsp;·&nbsp; UAE, India & Global
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black text-white leading-[1.05] tracking-tight"
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
              className="text-base lg:text-lg text-white/60 max-w-xl leading-relaxed"
              style={{ marginTop: '1.5rem' }}
            >
              Trusted supplier of advanced construction and material handling solutions. Specialising in Forklifts and Aerial Work Platforms across UAE, India & beyond.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4"
              style={{ marginTop: '1.5rem' }}
            >
              <Link href="/products" className="btn-primary text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4 hover:!bg-white hover:!text-[#001f3f] hover:!border-white hover:!shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                Explore Products <ArrowRight size={17} />
              </Link>
              <Link href="/contact" className="btn-secondary text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4 hover:!bg-white hover:!text-[#001f3f] hover:!border-white hover:!shadow-[0_0_25px_rgba(255,255,255,0.4)]">
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
      <section className="bg-white border-b border-gray-100/80 my-6">
        <div className="container-custom py-28 md:py-32 lg:py-36">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-16 gap-x-6 lg:gap-x-4 lg:gap-y-0">
            {stats.map((stat, i) => {
              const Icon = statIcons[i] || Award;
              return (
                <div key={i} className="flex flex-col items-center justify-center text-center relative group min-h-[160px] lg:min-h-[150px]">
                  {i > 0 && (
                    <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-accent/[0.08] text-accent flex items-center justify-center mb-4 ring-1 ring-accent/10 group-hover:bg-accent group-hover:text-primary group-hover:ring-accent/30 transition-all duration-300">
                    <Icon size={20} />
                  </div>
                  <div className="text-3xl lg:text-[2.25rem] font-black text-primary tabular-nums leading-none tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[10px] lg:text-[11px] text-gray-500 font-bold uppercase tracking-[0.14em] mt-3 max-w-[9rem] mx-auto leading-snug">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                {/* Main image container */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 relative group">
                  <Image src="/images/company/vikamusk-reception.png" alt="Vikamusk Office" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/30" />
                </div>

                {/* Floating "10+ Years" badge - positioned outside the overflow-hidden container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 120 }}
                  className="absolute -bottom-7 -right-4 lg:-right-7 z-10"
                >
                  <div className="relative group/badge">
                    {/* Animated glow ring */}
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/10 to-accent/25 blur-md animate-[pulse-glow_3s_ease-in-out_infinite] opacity-60" />

                    {/* Badge card */}
                    <div className="relative flex flex-col items-center justify-center w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-2xl bg-white border border-gray-100/80 shadow-[0_20px_60px_-15px_rgba(0,31,63,0.18)] backdrop-blur-sm overflow-hidden">
                      {/* Internal accent gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-primary/[0.04]" />

                      {/* Top accent bar */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-accent-light to-accent" />

                      {/* Content */}
                      <div className="relative text-center">
                        <p className="text-3xl sm:text-4xl font-black leading-none bg-gradient-to-br from-primary via-primary to-primary-light bg-clip-text text-transparent">
                          10<span className="text-accent">+</span>
                        </p>
                        <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-2 mb-1.5" />
                        <p className="text-[7px] sm:text-[8px] text-muted font-bold uppercase tracking-[0.18em] leading-tight">
                          Years of<br />Excellence
                        </p>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-accent/[0.06] rounded-tl-2xl" />
                    </div>
                  </div>
                </motion.div>

                {/* Decorative accent corner frame */}
                <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl pointer-events-none" />
                <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-primary/10 rounded-bl-xl pointer-events-none" />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-[0.2em]">
                <span className="h-px w-6 bg-accent/40" />
                Discover Our Story
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-4 mb-2 leading-tight">
                About Vikamusk International
              </h2>
              {/* Decorative underline */}
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 rounded-full bg-accent" />
                <div className="h-1 w-4 rounded-full bg-accent/30" />
                <div className="h-1 w-2 rounded-full bg-accent/15" />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <p className="text-muted leading-relaxed mb-4">
                  Founded in 2015 in India and proudly established in the Ajman Free Zone of UAE, Vikamusk Construction Equipment is a trusted supplier of advanced construction and material handling solutions.
                </p>
                <p className="text-muted leading-relaxed">
                  Serving clients across China, UAE, Saudi Arabia, Oman and India. Collaborating with 10+ industrial manufacturers worldwide for reliable, high-performance equipment.
                </p>
              </div>

              {/* USP pills */}
              <div className="space-y-3" style={{ marginTop: '1rem' }}>
                {[
                  'ISO-compliant equipment from verified global manufacturers',
                  'Dedicated after-sales and technical support teams',
                  'Custom equipment solutions for unique project needs',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 group/item">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center mt-0.5 group-hover/item:bg-accent/20 transition-colors">
                      <CheckCircle2 size={14} className="text-accent" />
                    </span>
                    <span className="text-sm text-muted leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <Link href="/about" className="btn-outline group inline-flex">
                  Learn More
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT CATEGORIES ===== */}
      {/* HIDDEN FOR NOW: if needed add later */}
      {false && (
      <section className="section-padding bg-surface relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 31, 63, 0.06), transparent)',
        }} />
        <div className="container-custom relative">
          <div className="w-full flex flex-col items-center justify-center text-center px-4" style={{ marginBottom: '2rem' }}>
            <AnimatedSection direction="up" className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
              <div className="flex w-full items-center justify-center gap-3 mb-4">
                <span className="h-[2px] w-8 bg-accent/50" />
                <span className="text-xs font-black text-accent uppercase tracking-[0.25em]">What We Offer</span>
                <span className="h-[2px] w-8 bg-accent/50" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-primary tracking-tight mb-5 w-full text-center">
                Our Product Categories
              </h2>
              <p className="text-muted text-base lg:text-lg leading-relaxed text-center w-full">
                Explore our comprehensive range of construction and material handling equipment designed for performance, reliability, and safety.
              </p>
            </AnimatedSection>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-3xl border border-gray-100/80 bg-white p-1 shadow-sm overflow-hidden">
                  <div className="aspect-[5/4] rounded-[1.15rem] bg-gray-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200/90 shadow-sm">
              <Boxes size={44} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold mb-1">No categories yet</p>
              <p className="text-gray-400 text-sm max-w-md mx-auto">Product categories will appear here once added via the admin panel.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {categories.map((cat: any) => {
                const categoryBlurb = categoryBodyText(cat);
                return (
                <StaggerItem key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group flex flex-col h-full bg-white rounded-[2rem] border border-gray-200/80 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/40 overflow-hidden"
                  >
                    <div className="relative h-[450px] sm:h-[500px] w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(135deg,rgba(245,158,11,0.06)_0%,transparent_50%)] pointer-events-none" />
                      {cat.image && (cat.image.startsWith('data:') || cat.image.startsWith('/')) ? (
                        cat.image.startsWith('data:') ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-contain p-8 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain p-8 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        )
                      ) : (
                        <Package size={52} className="text-gray-200" />
                      )}
                      
                      {/* Badge */}
                      <div className="absolute z-20 flex items-center justify-center gap-1.5 rounded-full bg-accent text-white border border-black shadow-md shadow-accent/20 group-hover:bg-primary group-hover:border-primary transition-colors duration-500" style={{ top: 0, left: 0, margin: '1rem', padding: '0.4rem 1rem' }}>
                        <span className="text-sm font-black tabular-nums tracking-tight">{cat.product_count || 0}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">Products</span>
                      </div>
                    </div>

                    <div className="w-full bg-white z-10 relative pt-2 px-6" style={{ paddingBottom: '2rem' }}>
                      
                      {/* Name Container */}
                      <div className="w-full text-center" style={{ marginBottom: '1rem' }}>
                        <h3 className="text-xl sm:text-2xl font-black text-black leading-tight">
                          {cat.name}
                        </h3>
                      </div>
                      
                      {/* Button Container */}
                      <div className="w-full flex justify-center items-center">
                        <span className="flex items-center justify-center w-[85%] py-3.5 bg-[#f59e0b] text-white border border-black rounded-full text-sm sm:text-base font-black uppercase tracking-wider shadow-[0_3px_0_rgba(0,0,0,1)] hover:bg-[#d97706] hover:translate-y-1 hover:shadow-none transition-all duration-300">
                          Browse category
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
              })}
            </StaggerContainer>
          )}

          {categories.length > 0 && (
            <div className="text-center" style={{ marginTop: '1rem' }}>
              <Link href="/products" className="btn-outline text-sm px-8 py-3.5 rounded-xl">
                View all products <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>
      )}

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section-padding bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" aria-hidden />
        <div className="container-custom">
          <div className="w-full flex flex-col items-center justify-center text-center px-4" style={{ marginBottom: '2rem' }}>
            <AnimatedSection className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
              <div className="flex w-full items-center justify-center gap-3 mb-4">
                <span className="h-[2px] w-8 bg-accent/50 hidden sm:block" />
                <span className="text-xs font-black text-accent uppercase tracking-[0.25em]">Highlighted Equipment</span>
                <span className="h-[2px] w-8 bg-accent/50 hidden sm:block" />
              </div>
              <h2 className="text-3xl lg:text-[2.35rem] font-black text-primary tracking-tight mb-4 w-full text-center">
                Featured Products
              </h2>
              <p className="text-muted text-base lg:text-lg leading-relaxed text-center w-full max-w-full lg:whitespace-nowrap">
                Hand-picked equipment from our catalog — engineered for reliability on demanding sites.
              </p>
            </AnimatedSection>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse" />
                    <div className="h-5 bg-gray-100 rounded w-4/5 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-gray-200/90">
              <Star size={44} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold mb-1">No featured products yet</p>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">Mark products as &quot;Featured&quot; in the admin panel to showcase them here.</p>
              <Link href="/products" className="btn-primary text-sm px-8 py-3.5 rounded-xl">
                Browse all products <ArrowRight size={15} />
              </Link>
            </div>
          ) : !isCarousel ? (
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
              {featuredProducts.map((product, i) => (
                <div key={product.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
              <div 
                ref={featuredScrollRef} 
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[...featuredProducts, ...featuredProducts, ...featuredProducts].map((product, i) => (
                  <div 
                    key={`${product.id}-${i}`} 
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-none shrink-0 snap-start flex flex-col"
                  >
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </div>
              <style dangerouslySetInnerHTML={{__html: `\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n`}} />
            </div>
          )}

          {/* View All Button */}
          {featuredProducts.length > 0 && (
            <div className="text-center w-full flex justify-center" style={{ marginTop: '1rem' }}>
              <Link href="/products" className="btn-outline text-sm px-8 py-3.5 rounded-xl flex items-center justify-center gap-2">
                View all products <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section
        className="relative min-h-[100dvh] flex flex-col justify-center py-16 lg:py-24 overflow-x-hidden"
        style={{ background: '#001f3f' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(165deg, #001229 0%, #072443 42%, #001f3f 100%)' }} />

        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.55) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,158,11,0.55) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="absolute top-1/4 -left-32 w-[520px] h-[520px] bg-accent/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -right-24 w-[480px] h-[480px] bg-primary-light/[0.15] rounded-full blur-[100px] pointer-events-none" />

        <div className="container-custom relative z-10 w-full py-4 flex flex-col items-center">
          <AnimatedSection className="w-full max-w-3xl mx-auto px-4 text-center mb-16">
            <div className="flex w-full justify-center mb-5">
              <motion.span
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-accent uppercase tracking-[0.22em]"
              >
                <span className="h-px w-8 bg-accent/35 shrink-0" />
                Why Vikamusk
                <span className="h-px w-8 bg-accent/35 shrink-0" />
              </motion.span>
            </div>
            <h2 className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-black text-white mb-6 tracking-tight leading-[1.12] text-center text-balance">
              A partner dedicated to{' '}
              <span className="gradient-text">your success</span>
            </h2>
            <p className="text-white/55 text-base lg:text-lg leading-relaxed text-center text-balance max-w-2xl mx-auto">
              We don&apos;t just supply equipment; we deliver engineering excellence and strategic support that helps you build a legacy of creativity and performance.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {whyItems.map((item, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative h-full flex flex-col items-center text-center p-8 sm:p-10 rounded-[1.35rem] bg-white/[0.04] border border-white/[0.09] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:border-accent/25 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-28 h-28 bg-accent/[0.07] blur-[48px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Centered Decorative Bar */}
                  <div className="w-11 h-1 bg-accent/35 group-hover:bg-accent group-hover:w-14 transition-all duration-500 mb-8 rounded-full" />

                  {/* Centered Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-accent/12 text-accent flex items-center justify-center mb-8 ring-1 ring-white/10 group-hover:bg-accent group-hover:text-primary group-hover:ring-accent/40 transition-all duration-300 shadow-lg shadow-black/20">
                    {item.icon}
                  </div>

                  {/* Card Content with Padding/Spacing */}
                  <div className="flex flex-col flex-1 px-2 my-8">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-4 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-white/48 text-sm sm:text-base leading-relaxed group-hover:text-white/65 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-8 h-px w-full bg-gradient-to-r from-accent/25 via-white/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                </motion.div>
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
              <div style={{ marginBottom: '1rem' }}>
                <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Reach</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <h2 className="text-3xl lg:text-4xl font-black text-primary leading-tight">Global Presence</h2>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <p className="text-muted leading-relaxed text-sm lg:text-base">
                  Vikamusk continues to build lasting partnerships and set new standards in equipment reliability. Our market networks and service systems span the globe, delivering to 20+ countries.
                </p>
              </div>
              <div className="flex flex-col">
                {[
                  { flag: '🇦🇪', country: 'UAE (Headquarters)', city: 'Ajman Free Zone', detail: 'Head Office & Warehouse' },
                  { flag: '🇮🇳', country: 'India', city: 'Kochi, Kerala', detail: 'Regional Operations Office' },
                  { flag: '🇨🇳', country: 'China', city: 'Qingdao', detail: 'Manufacturing Partnership' },
                ].map((loc, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border/40 hover:border-accent/20 hover:shadow-sm transition-all" style={{ marginBottom: '1rem' }}>
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
      <section className="relative min-h-[100dvh] flex flex-col justify-center py-16 lg:py-24 overflow-x-hidden bg-[#001229] pb-24 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#001229] to-[#000d1a]" />
        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(245,158,11,0.75) 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(90vw,800px)] h-[380px] rounded-full bg-accent/[0.06] blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[min(70vw,560px)] h-[280px] rounded-full bg-[#0a3460]/40 blur-[90px] pointer-events-none" />

        <div className="container-custom relative z-10 w-full py-4 flex flex-col items-center">
          <AnimatedSection className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 text-center">
            <div className="flex w-full justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold uppercase tracking-[0.22em]">
                <Star size={14} className="shrink-0 animate-pulse" />
                Partner with excellence
              </div>
            </div>
            <h2 className="w-full text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white mb-4 leading-[1.08] tracking-tight text-center text-balance px-2">
              Build your dream with{' '}
              <span className="gradient-text">Vikamusk</span>
            </h2>
            <div className="text-center w-full" style={{ marginBottom: '3rem' }}>
              <p className="text-white/52 w-full max-w-[42rem] mx-auto text-base sm:text-lg lg:text-xl leading-relaxed text-center text-balance">
                10+ years of undefeated success. Ready to power your next project with world-class equipment and dedicated engineering support?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-lg mx-auto">
              <Link
                href="/products"
                className="group w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 min-h-[3.25rem] px-8 py-4 rounded-xl bg-accent hover:bg-white text-[#001229] hover:text-[#001f3f] font-black text-base sm:text-lg transition-all duration-300 shadow-[0_12px_40px_-8px_rgba(245,158,11,0.45)] hover:shadow-[0_12px_30px_-8px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] ring-1 ring-white/10"
              >
                View products
                <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 min-h-[3.25rem] px-8 py-4 rounded-xl bg-white/[0.06] hover:bg-white text-white hover:text-[#001f3f] font-bold text-base sm:text-lg border border-white/15 hover:border-white transition-all duration-300 backdrop-blur-md active:scale-[0.98] shadow-lg shadow-black/20 hover:-translate-y-0.5"
              >
                Contact us
                <ArrowRight size={20} className="opacity-90 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="w-full max-w-4xl mx-auto px-2 pt-4" style={{ marginTop: '3rem' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
                {[
                  { value: '10+', label: 'Global Manufacturers', icon: Globe },
                  { value: '20+', label: 'Countries Served', icon: MapPin },
                  { value: '100+', label: 'Equipment Models', icon: Boxes },
                ].map((item, i) => {
                  const IconCmp = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-8 sm:py-9 backdrop-blur-sm hover:border-accent/20 hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center text-accent/70 mb-5 ring-1 ring-white/10">
                        <IconCmp size={26} strokeWidth={1.75} />
                      </div>
                      <span className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight mb-2">{item.value}</span>
                      <span className="text-white/45 text-[11px] sm:text-xs uppercase font-bold tracking-[0.18em] leading-snug max-w-[12rem] mx-auto">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
