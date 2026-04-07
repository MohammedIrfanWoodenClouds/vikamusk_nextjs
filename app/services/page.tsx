'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Wrench, Settings, Truck, ShieldCheck, Clock, Phone, HeadphonesIcon, Package } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="relative pb-28 bg-primary overflow-hidden" style={{ paddingTop: '200px' }}>
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
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
                desc: 'Reliable logistics and transportation of equipment to your job site across UAE, India, and the broader region.',
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
                className="text-3xl lg:text-4xl font-black text-white"
                style={{ marginBottom: '1.5rem', whiteSpace: 'nowrap', textAlign: 'center' }}
              >
                Need Equipment Service or Support?
              </h2>
              <p
                className="text-gray-400 leading-relaxed"
                style={{
                  maxWidth: '640px',
                  marginBottom: '2.5rem',
                  fontSize: '1.05rem',
                  lineHeight: '1.75',
                  textAlign: 'center',
                }}
              >
                Our service team is ready to help with maintenance, spare parts, and technical consultation.
              </p>
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: '1.25rem', marginTop: '0.5rem' }}
              >
                <Link
                  href="/contact"
                  className="bg-accent hover:bg-amber-600 text-[#001f3f] font-bold rounded-xl transition-all inline-flex items-center gap-2.5 hover:scale-105"
                  style={{
                    padding: '1rem 2.25rem',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Contact Support <Phone size={18} />
                </Link>
                <a
                  href="/vikamusk-company-profile.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105"
                  style={{
                    padding: '1rem 2.25rem',
                    fontSize: '0.95rem',
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
