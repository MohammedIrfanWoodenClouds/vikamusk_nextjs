'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Wrench, Settings, Truck, ShieldCheck, Clock, Phone, HeadphonesIcon, Package } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="text-sm font-bold text-accent uppercase tracking-wider">What We Offer</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6">
              Services & Support
            </h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
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
              <Link href="/products" className="btn-primary">
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
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">After-Sales</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Service & Support
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Vikamusk&apos;s commitment to innovation and technical excellence ensures that 
              clients receive durable, high-performing equipment backed by dependable service.
            </p>
          </AnimatedSection>

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
                desc: 'Reliable logistics and transportation of equipment to your job site across UAE, India, and the broader region.',
              },
            ].map((service, i) => (
              <StaggerItem key={i}>
                <div className="p-8 bg-white rounded-2xl border border-border/50 h-full group hover:border-accent/30 transition-colors hover-lift">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-primary transition-all">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">{service.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{service.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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

      {/* Industries */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Industries We Serve</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Applications & Industries
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '🏗️', name: 'Construction', desc: 'Building, infrastructure, and civil engineering projects.' },
              { emoji: '📦', name: 'Logistics & Warehousing', desc: 'Distribution centers, storage, and supply chain operations.' },
              { emoji: '🔧', name: 'Maintenance & Facilities', desc: 'Building maintenance, cleaning, and facility management.' },
              { emoji: '✈️', name: 'Aviation & Airports', desc: 'Ground support equipment for airport operations.' },
              { emoji: '🏭', name: 'Manufacturing', desc: 'Production lines, factories, and industrial plants.' },
              { emoji: '🛢️', name: 'Oil & Gas', desc: 'Energy sector operations requiring heavy equipment.' },
              { emoji: '🚢', name: 'Ports & Maritime', desc: 'Container handling and port logistics operations.' },
              { emoji: '⛏️', name: 'Mining', desc: 'Extraction and processing site equipment needs.' },
            ].map((industry, i) => (
              <StaggerItem key={i}>
                <div className="p-6 rounded-xl bg-surface border border-border/50 text-center h-full hover:border-accent/30 transition-colors">
                  <span className="text-3xl mb-3 block">{industry.emoji}</span>
                  <h3 className="text-base font-bold text-primary mb-1">{industry.name}</h3>
                  <p className="text-xs text-muted">{industry.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-accent">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mb-4">
              Need Equipment Service or Support?
            </h2>
            <p className="text-primary/70 max-w-lg mx-auto mb-8">
              Our service team is ready to help with maintenance, spare parts, and technical consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="bg-primary text-white font-bold px-8 py-4 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2">
                Contact Support <Phone size={18} />
              </Link>
              <a href="/vikamusk-company-profile.pdf" target="_blank" rel="noopener noreferrer" className="bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-white/90 transition-colors inline-flex items-center gap-2">
                Download Brochure
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
