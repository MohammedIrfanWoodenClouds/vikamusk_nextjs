'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Wrench, Settings, Truck, ShieldCheck, Clock, Phone, HeadphonesIcon, Package, Globe, Activity, MapPin } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="relative pb-20 sm:pb-28 bg-primary overflow-hidden" style={{ paddingTop: 'clamp(140px, 15vw, 200px)' }}>
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center">
            <span 
              className="text-sm font-bold text-accent uppercase tracking-wider block"
              style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
            >
              What We Offer
            </span>
            <h1 
              className="text-4xl lg:text-5xl font-black text-white leading-tight"
              style={{ marginBottom: '2rem' }}
            >
              Services & Support
            </h1>
            <p 
              className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
              style={{ marginBottom: '3rem' }}
            >
              Comprehensive equipment solutions backed by dependable service, maintenance, 
              and technical expertise across the region.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Equipment Supply */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Core Service</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-6">
                Industrial & Construction Equipment Supply
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Vikamusk Construction Equipment is a trusted supplier of advanced construction 
                and material handling solutions. We specialize in diesel and electric forklifts, 
                scissor lifts, boom lifts, telehandlers, and a comprehensive range of aerial work platforms.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                With collaboration with 10+ industrial manufacturers, we provide reliable equipment 
                designed to enhance efficiency, safety, and productivity on every job site. Our products 
                serve construction, maintenance, logistics, and service sectors globally.
              </p>
              <Link href="/products" className="btn-primary" style={{ marginTop: '1rem' }}>
                View Our Equipment <ArrowRight size={16} />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/company/vikamusk-company-china-.png"
                  alt="Vikamusk Equipment Supply"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">After-Sales</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Service & Support
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-center">
              Vikamusk&apos;s commitment to innovation and technical excellence ensures that 
              clients receive durable, high-performing equipment backed by dependable service.
            </p>
          </AnimatedSection>

          <div style={{ padding: '0 0.5rem', marginTop: '1rem' }}>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Wrench size={28} />,
                title: 'Preventive Maintenance',
                desc: 'Scheduled maintenance programs to minimize downtime and extend equipment lifespan. Our technicians ensure your machines perform at peak efficiency.',
              },
              {
                icon: <Settings size={28} />,
                title: 'Repairs & Overhaul',
                desc: 'Expert repair services for all equipment types, from minor fixes to complete engine and hydraulic system overhauls.',
              },
              {
                icon: <Package size={28} />,
                title: 'Genuine Spare Parts',
                desc: 'Access to genuine OEM spare parts from our 10+ manufacturing partners. Fast delivery to minimize your equipment downtime.',
              },
              {
                icon: <ShieldCheck size={28} />,
                title: 'Safety Inspections',
                desc: 'Thorough safety audits and certifications for all equipment. Ensuring compliance with international safety standards.',
              },
              {
                icon: <HeadphonesIcon size={28} />,
                title: 'Technical Consultation',
                desc: 'Expert guidance on selecting the right equipment for your specific applications, site conditions, and operational requirements.',
              },
              {
                icon: <Truck size={28} />,
                title: 'Equipment Delivery',
                desc: 'Reliable logistics and transportation of equipment to your job site across UAE and the broader region.',
              },
            ].map((service, i) => (
              <StaggerItem key={i}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  desc={service.desc}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Service Network - Globe Video with Flex Columns */}
      <section className="relative py-24 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[800px] border-b border-white/10 px-4 md:px-8">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>
        
        <div className="container-custom relative z-10 w-full">
          {/* Heading */}
          <AnimatedSection className="w-full text-center flex justify-center mb-16 md:mb-24 z-30 relative">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Our Service <span className="text-[#f59e0b]">Network</span>
            </h2>
          </AnimatedSection>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 w-full max-w-7xl mx-auto">
            
            {/* Left Column: 4 Countries */}
            <div className="grid grid-cols-2 lg:flex lg:flex-col gap-10 sm:gap-16 w-full lg:w-[30%] z-30 order-2 lg:order-1">
              {[
                { name: 'UAE' },
                { name: 'Saudi Arabia' },
                { name: 'Oman' },
                { name: 'Kuwait' }
              ].map((loc, i) => (
                <AnimatedSection key={loc.name} delay={i * 0.1} className="w-full">
                  <div className="flex items-center w-full group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                    <div className="flex items-center gap-3 shrink-0">
                      <MapPin size={24} className="text-[#f59e0b]" />
                      <span className="text-[#f59e0b] text-lg md:text-xl font-bold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{loc.name}</span>
                    </div>
                    {/* Dashed line pointing inwards to the globe */}
                    <div className="hidden lg:block flex-1 h-[1px] border-b-2 border-dashed border-[#f59e0b]/30 mx-4 group-hover:border-[#f59e0b]/70 transition-colors"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50 shadow-[0_0_12px_rgba(245,158,11,0.6)] hidden lg:block group-hover:bg-[#f59e0b] transition-colors"></div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Middle Globe */}
            <div className="relative w-full max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] aspect-square flex items-center justify-center z-10 shrink-0 shadow-2xl order-1 lg:order-2 mb-12 lg:mb-0">
              {/* Soft white glow behind the globe */}
              <div className="absolute inset-0 bg-white/10 blur-[100px] rounded-full pointer-events-none scale-[0.75]"></div>
              
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-contain mix-blend-screen scale-110 relative z-20 pointer-events-none"
              >
                <source src="/videos/digital_globe.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Right Column: 3 Countries */}
            <div className="grid grid-cols-2 lg:flex lg:flex-col gap-10 sm:gap-16 w-full lg:w-[30%] z-30 order-3 lg:order-3">
              {[
                { name: 'Qatar' },
                { name: 'Bahrain' },
                { name: 'India' }
              ].map((loc, i) => (
                <AnimatedSection key={loc.name} delay={i * 0.1 + 0.4} className="w-full">
                  <div className="flex lg:flex-row-reverse items-center w-full group cursor-pointer hover:translate-x-2 lg:hover:-translate-x-2 transition-transform duration-300">
                    <div className="flex items-center lg:flex-row-reverse gap-3 shrink-0 lg:text-right">
                      <MapPin size={24} className="text-[#f59e0b]" />
                      <span className="text-[#f59e0b] text-lg md:text-xl font-bold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{loc.name}</span>
                    </div>
                    {/* Dashed line pointing inwards to the globe */}
                    <div className="hidden lg:block flex-1 h-[1px] border-b-2 border-dashed border-[#f59e0b]/30 mx-4 group-hover:border-[#f59e0b]/70 transition-colors"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50 shadow-[0_0_12px_rgba(245,158,11,0.6)] hidden lg:block group-hover:bg-[#f59e0b] transition-colors"></div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Service Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10+', label: 'Service Divisions' },
              { value: '20+', label: 'Countries Served' },
              { value: '350+', label: 'Equipment Delivered' },
              { value: '24/7', label: 'Technical Support' },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-3xl lg:text-4xl font-black text-accent mb-1">{stat.value}</div>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#001f3f]" style={{ paddingTop: '3rem', paddingBottom: '7rem' }}>
        <div
          className="container-custom"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <AnimatedSection>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white"
                style={{ marginBottom: '1.5rem', textAlign: 'center', lineHeight: '1.2' }}
              >
                Need Equipment Service or Support?
              </h2>
              <p
                className="text-gray-400 leading-relaxed px-4"
                style={{
                  maxWidth: '640px',
                  marginBottom: '2.5rem',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  textAlign: 'center',
                }}
              >
                Our service team is ready to help with maintenance, spare parts, and technical consultation.
              </p>
              <div
                className="flex flex-col sm:flex-row justify-center items-center w-full px-4"
                style={{ gap: '1rem', marginTop: '0.5rem' }}
              >
                <Link
                  href="/contact"
                  className="w-full sm:w-auto bg-accent hover:bg-white text-[#001f3f] hover:text-[#001f3f] font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Contact Support <Phone size={18} />
                </Link>
                <a
                  href="/vikamusk-company-profile.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-[#001f3f] font-semibold rounded-xl border border-white/20 hover:border-white transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  Download Brochure
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
