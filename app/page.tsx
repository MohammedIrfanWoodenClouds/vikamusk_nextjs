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
      <section className="bg-white border-b border-gray-100/80">
        <div className="container-custom py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-6 lg:gap-x-4 lg:gap-y-0">
            {stats.map((stat, i) => {
              const Icon = statIcons[i] || Award;
              return (
                <div key={i} className="flex flex-col items-center justify-center text-center relative group min-h-[120px] lg:min-h-0">
                  {i > 0 && (
                    <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                  )}
                  <div className="w-11 h-11 rounded-2xl bg-accent/[0.08] text-accent flex items-center justify-center mb-3.5 ring-1 ring-accent/10 group-hover:bg-accent group-hover:text-primary group-hover:ring-accent/30 transition-all duration-300">
                    <Icon size={19} />
                  </div>
                  <div className="text-3xl lg:text-[2.15rem] font-black text-primary tabular-nums leading-none tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[10px] lg:text-[11px] text-gray-500 font-bold uppercase tracking-[0.14em] mt-2.5 max-w-[9rem] mx-auto leading-snug">{stat.label}</p>
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
      <section className="section-padding bg-surface relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 31, 63, 0.06), transparent)',
        }} />
        <div className="container-custom relative">
          <AnimatedSection className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-[0.2em]">
              <span className="h-px w-6 bg-accent/40" />
              What We Offer
              <span className="h-px w-6 bg-accent/40" />
            </span>
            <h2 className="text-3xl lg:text-[2.35rem] font-black text-primary mt-4 mb-4 tracking-tight">Our Product Categories</h2>
            <p className="text-muted text-sm lg:text-base leading-relaxed">
              Explore our comprehensive range of construction and material handling equipment designed for performance, reliability, and safety.
            </p>
          </AnimatedSection>

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
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_1px_0_rgba(0,31,63,0.04)] ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-primary/[0.07]"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-t-3xl">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(135deg,rgba(245,158,11,0.06)_0%,transparent_45%)] pointer-events-none" />
                      {cat.image && (cat.image.startsWith('data:') || cat.image.startsWith('/')) ? (
                        cat.image.startsWith('data:') ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-contain p-7 sm:p-8 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain p-7 sm:p-8 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={52} className="text-gray-200" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="absolute top-3 right-3 z-20 rounded-xl bg-white/95 backdrop-blur-md px-3 py-2 shadow-md ring-1 ring-primary/10">
                        <span className="block text-lg font-black text-primary tabular-nums leading-none">{cat.product_count || 0}</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Products</span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6 pt-5">
                      <h3 className="text-lg font-black text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-2">
                        {cat.name}
                      </h3>
                      {categoryBlurb ? (
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1 mb-5">{categoryBlurb}</p>
                      ) : (
                        <div className="flex-1 min-h-[2.5rem]" aria-hidden />
                      )}
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:text-accent transition-colors mt-auto">
                        Browse category
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface group-hover:bg-accent/15 transition-colors">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
              })}
            </StaggerContainer>
          )}

          {categories.length > 0 && (
            <div className="text-center mt-12 lg:mt-14">
              <Link href="/products" className="btn-outline text-sm px-8 py-3.5 rounded-xl">
                View all products <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section-padding bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" aria-hidden />
        <div className="container-custom">
          <AnimatedSection className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-14 text-center lg:text-left">
            <div className="max-w-xl mx-auto lg:mx-0">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-[0.2em] justify-center lg:justify-start">
                <span className="h-px w-6 bg-accent/40 hidden sm:block" />
                Highlighted Equipment
              </span>
              <h2 className="text-3xl lg:text-[2.35rem] font-black text-primary mt-3 tracking-tight">Featured Products</h2>
              <p className="text-muted text-sm lg:text-base mt-3 leading-relaxed hidden sm:block">
                Hand-picked equipment from our catalog — engineered for reliability on demanding sites.
              </p>
            </div>
            <Link href="/products" className="btn-outline text-sm py-3 px-7 rounded-xl whitespace-nowrap self-center lg:self-auto shrink-0">
              View all <ArrowRight size={15} />
            </Link>
          </AnimatedSection>

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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.slice(0, 6).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
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
          <AnimatedSection className="mb-14 lg:mb-20 w-full max-w-3xl mx-auto px-4 text-center">
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
                  className="group relative h-full flex flex-col p-7 sm:p-8 rounded-[1.35rem] bg-white/[0.04] border border-white/[0.09] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:border-accent/25 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-28 h-28 bg-accent/[0.07] blur-[48px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-11 h-1 bg-accent/35 group-hover:bg-accent group-hover:w-14 transition-all duration-500 mb-7 rounded-full" />

                  <div className="w-14 h-14 rounded-2xl bg-accent/12 text-accent flex items-center justify-center mb-5 ring-1 ring-white/10 group-hover:bg-accent group-hover:text-primary group-hover:ring-accent/40 transition-all duration-300 shadow-lg shadow-black/20">
                    {item.icon}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white mb-2.5 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-white/48 text-sm sm:text-[0.9375rem] leading-relaxed flex-1 group-hover:text-white/65 transition-colors duration-300 pb-1">
                    {item.desc}
                  </p>

                  <div className="mt-5 h-px w-full bg-gradient-to-r from-accent/25 via-white/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
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
            <div className="flex w-full justify-center mb-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold uppercase tracking-[0.22em]">
                <Star size={14} className="shrink-0 animate-pulse" />
                Partner with excellence
              </div>
            </div>
            <h2 className="w-full text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white mb-10 leading-[1.08] tracking-tight text-center text-balance px-2">
              Build your dream with{' '}
              <span className="gradient-text">Vikamusk</span>
            </h2>
            <p className="text-white/52 w-full max-w-[42rem] mx-auto mb-12 lg:mb-14 text-base sm:text-lg lg:text-xl leading-relaxed text-center text-balance">
              10+ years of undefeated success. Ready to power your next project with world-class equipment and dedicated engineering support?
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-5 sm:gap-6 w-full max-w-3xl mx-auto sm:justify-center">
              <Link
                href="/products"
                className="group w-full sm:flex-1 sm:max-w-none inline-flex items-center justify-center gap-3 min-h-[3.75rem] sm:min-h-[4.25rem] px-10 sm:px-12 py-5 sm:py-6 rounded-2xl bg-accent hover:bg-amber-500 text-[#001229] font-black text-lg sm:text-xl transition-all shadow-[0_12px_40px_-8px_rgba(245,158,11,0.45)] hover:shadow-[0_16px_48px_-6px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 active:scale-[0.98] ring-1 ring-white/10"
              >
                View products
                <ArrowRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group w-full sm:flex-1 sm:max-w-none inline-flex items-center justify-center gap-3 min-h-[3.75rem] sm:min-h-[4.25rem] px-10 sm:px-12 py-5 sm:py-6 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-lg sm:text-xl border border-white/15 hover:border-white/25 transition-all backdrop-blur-md active:scale-[0.98] shadow-lg shadow-black/20"
              >
                Contact us
                <ArrowRight size={22} className="opacity-90 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="mt-16 lg:mt-24 w-full max-w-4xl mx-auto px-2 pt-4">
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
