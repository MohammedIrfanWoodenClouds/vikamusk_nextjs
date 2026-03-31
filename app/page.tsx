'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Shield, Wrench, Globe, Award, Truck, Headphones } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';
import { categories, getFeaturedProducts, stats } from '@/lib/data';
import { useRef, useEffect, useState } from 'react';

// ============= COUNTER COMPONENT =============
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          setCounted(true);
          let start = 0;
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

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      {/* ============= HERO SECTION ============= */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-primary">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
            alt="Construction Equipment"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-16 lg:py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs sm:text-sm mb-6 lg:mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Established 2015 • Ajman Free Zone, UAE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 lg:mb-6"
            >
              A World of{' '}
              <span className="gradient-text">Creativity</span>
              {' '}& Engineering{' '}
              <span className="gradient-text">Excellence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-base lg:text-lg text-white/70 max-w-xl mb-8 lg:mb-10 leading-relaxed"
            >
              Trusted supplier of advanced construction and material handling solutions. 
              Specializing in Forklifts and Aerial Work Platforms across UAE, India & beyond.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/products" className="btn-primary text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-secondary text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/40"
          >
            <ChevronDown size={28} />
          </motion.div>
        </motion.div>
      </section>

      {/* ============= STATS BAR ============= */}
      <section className="bg-surface border-b border-border">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-primary mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= ABOUT PREVIEW ============= */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/company/vikamusk-reception.png"
                  alt="Vikamusk Office"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/80 to-transparent">
                  <p className="text-white font-semibold">Vikamusk International HQ</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Discover Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-6">
                About Vikamusk International
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                Founded in 2015 in India and now proudly established in the Ajman Free Zone of UAE, 
                Vikamusk Construction Equipment is a trusted supplier of advanced construction and 
                material handling solutions, serving clients across China, UAE, Saudi Arabia, Oman and India.
              </p>
              <p className="text-muted leading-relaxed mb-8">
                Specializing in Forklifts and Aerial Work Platforms, Vikamusk provides reliable 
                equipment designed to enhance efficiency, safety, and productivity on every job site. 
                Collaborating with 10+ Industrial manufacturers worldwide.
              </p>
              <Link href="/about" className="btn-outline">
                Learn More <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============= PRODUCT CATEGORIES ============= */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Our Product Categories
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Explore our comprehensive range of construction and material handling equipment 
              designed for performance, reliability, and safety.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative w-full md:w-48 h-48 md:h-auto bg-gray-50 flex-shrink-0">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain p-6 md:p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <div className="text-3xl mb-3">{cat.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                      {cat.description}
                    </p>
                    <span className="text-sm font-bold text-[#001f3f] flex items-center gap-1 group-hover:gap-2 group-hover:text-accent transition-all">
                      View {cat.productCount} Products <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============= FEATURED PRODUCTS ============= */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Equipment</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3">
                Featured Products
              </h2>
            </div>
            <Link href="/products" className="btn-outline text-sm py-2.5 px-5">
              View All Products <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 6).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============= WHY CHOOSE US ============= */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Why Vikamusk</span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-3 mb-4">
              Why Choose Us
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              At Vikamusk International, we are driven by a mission to foster 
              "A World of Creativity and Engineering Excellence."
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={28} />,
                title: 'Quality Assurance',
                desc: 'Collaboration with 10+ leading industrial manufacturers ensures premium quality equipment that meets international standards.',
              },
              {
                icon: <Globe size={28} />,
                title: 'Global Presence',
                desc: 'Operations spanning UAE, India, China, Saudi Arabia, and Oman — providing products and services to 20+ countries.',
              },
              {
                icon: <Wrench size={28} />,
                title: 'Technical Excellence',
                desc: 'Expert engineering team that bridges the gap between innovation and reliability for holistic equipment solutions.',
              },
              {
                icon: <Award size={28} />,
                title: '10+ Years Experience',
                desc: 'A decade of undefeated success in construction and material handling, building lasting partnerships.',
              },
              {
                icon: <Truck size={28} />,
                title: 'Comprehensive Range',
                desc: '6 categories, 35+ series, and 100+ models covering Forklifts, Aerial Platforms, and more.',
              },
              {
                icon: <Headphones size={28} />,
                title: 'After-Sales Support',
                desc: '10+ service divisions providing dependable maintenance, spare parts, and technical assistance.',
              },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-primary transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============= GLOBAL PRESENCE ============= */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Reach</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-6">
                Global Presence
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                Vikamusk Construction Equipment continues to build lasting partnerships and set new 
                standards in equipment reliability across the region. Our market networks and service 
                systems span the globe, providing products and services to more than 20 countries.
              </p>
              <div className="space-y-4">
                {[
                  { flag: '🇦🇪', country: 'UAE (HQ)', city: 'Ajman Free Zone', detail: 'Head Office & Warehouse' },
                  { flag: '🇮🇳', country: 'India', city: 'Kochi, Kerala', detail: 'Regional Office' },
                  { flag: '🇨🇳', country: 'China', city: 'Qingdao', detail: 'Manufacturing Partnership' },
                ].map((loc, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border/50">
                    <span className="text-2xl">{loc.flag}</span>
                    <div>
                      <h4 className="font-bold text-primary">{loc.country}</h4>
                      <p className="text-sm text-muted">{loc.city} — {loc.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/company/vikamusk-company-china-.png"
                  alt="Vikamusk China Operations"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/80 to-transparent">
                  <p className="text-white font-semibold">Vikamusk Partner Facility — China</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============= CTA BANNER ============= */}
      <section className="relative py-20 lg:py-24 overflow-hidden bg-[#001f3f]">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-5">
              Build Your Dream With{' '}
              <span className="text-accent">Vikamusk</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 text-base lg:text-lg">
              10+ Years of Undefeated Success. Ready to power your next project 
              with world-class equipment?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="bg-accent hover:bg-amber-600 text-[#001f3f] font-bold px-7 py-3.5 rounded-lg transition-all inline-flex items-center gap-2 text-sm">
                View Products <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-lg border border-white/20 hover:border-white/40 transition-all inline-flex items-center gap-2 text-sm">
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
