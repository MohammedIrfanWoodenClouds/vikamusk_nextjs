'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import IndustryCard from '@/components/IndustryCard';

const industries = [
  {
    emoji: '🏗️',
    name: 'Construction',
    desc: 'From high-rise buildings to large-scale infrastructure projects, Vikamusk supplies the forklifts, aerial platforms, and heavy lifting equipment that keep construction sites running efficiently and safely.',
    equipment: ['Rough Terrain Forklifts', 'Boom Lifts', 'Telehandlers', 'Scissor Lifts'],
  },
  {
    emoji: '📦',
    name: 'Logistics & Warehousing',
    desc: 'Optimise your distribution centre, storage facility, or supply chain operation with our range of electric and diesel forklifts designed for high-throughput environments.',
    equipment: ['Electric Forklifts', 'Reach Trucks', 'Pallet Stackers', 'Order Pickers'],
  },
  {
    emoji: '🔧',
    name: 'Maintenance & Facilities',
    desc: 'Keep facilities, buildings, and public spaces in peak condition with access equipment built for maintenance teams working at height safely and efficiently.',
    equipment: ['Scissor Lifts', 'Vertical Mast Lifts', 'Boom Lifts', 'Spider Lifts'],
  },
  {
    emoji: '✈️',
    name: 'Aviation & Airports',
    desc: 'Precision ground support equipment for airport operations, aircraft maintenance, and cargo handling — meeting the strict safety requirements of the aviation industry.',
    equipment: ['Aircraft Ground Support', 'Cargo Forklifts', 'Elevated Work Platforms', 'Belt Loaders'],
  },
  {
    emoji: '🏭',
    name: 'Manufacturing',
    desc: 'Enhance productivity on production lines and factory floors with reliable material handling equipment tailored for repetitive, high-precision industrial tasks.',
    equipment: ['Electric Counterbalance Forklifts', 'Narrow Aisle Trucks', 'Conveyor Lifts', 'AGVs'],
  },
  {
    emoji: '🛢️',
    name: 'Oil & Gas',
    desc: 'Heavy-duty equipment engineered for the demanding conditions of upstream and downstream energy operations, with safety and reliability at the forefront.',
    equipment: ['ATEX-rated Forklifts', 'Pipe Handlers', 'Heavy Duty Telehandlers', 'Explosion-proof Lifts'],
  },
  {
    emoji: '🚢',
    name: 'Ports & Maritime',
    desc: 'Container handling, ship-to-shore logistics, and port operations demand robust equipment — Vikamusk provides solutions built for the scale and intensity of maritime environments.',
    equipment: ['Container Handlers', 'Heavy Lift Forklifts', 'Reach Stackers', 'Terminal Tractors'],
  },
  {
    emoji: '⛏️',
    name: 'Mining',
    desc: 'Extraction and processing sites require resilient, high-capacity equipment. Our mining-grade solutions are built to endure harsh terrain and demanding operational cycles.',
    equipment: ['Underground Forklifts', 'Load Haul Dumpers', 'Boom Lifts', 'Heavy Duty Platforms'],
  },
];

export default function Industries() {
  return (
    <>
      {/* Hero */}
      <section className="relative pb-28 bg-primary overflow-hidden" style={{ paddingTop: '200px' }}>
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center gap-y-10">
            <span className="text-sm font-bold text-accent uppercase tracking-[0.2em] block">Who We Serve</span>
            <h1 className="text-4xl lg:text-[72px] font-black text-white leading-[1.05] tracking-tight">
              Industries We Serve
            </h1>
            <p className="text-white/60 max-w-5xl mx-auto text-lg lg:text-xl leading-relaxed">
              Vikamusk delivers trusted equipment solutions across a wide range of sectors —
              from construction and logistics to aviation, oil & gas, and beyond.
            </p>
            <div className="h-8" /> {/* extra spacer */}
          </AnimatedSection>
        </div>
      </section>

      {/* Intro */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Reach</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-6">
                Equipment Built for Every Industry
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Since 2015, Vikamusk Construction Equipment has supplied advanced lifting and
                material handling solutions to clients across the UAE, India, Saudi Arabia, Oman,
                and beyond. Our product range — from forklifts to aerial work platforms — is
                selected and configured to meet the unique demands of each sector we serve.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                Working with 10+ leading manufacturers, we match the right equipment to the right
                application, backed by full after-sales support, genuine spare parts, and expert
                technical consultation.
              </p>
              <Link 
                href="/products" 
                className="btn-primary hover:!bg-white hover:!text-[#001f3f] border-2 border-transparent hover:!border-black transition-all duration-300"
              >
                Browse Equipment <ArrowRight size={16} />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/company/vikamusk-company-china-.png"
                  alt="Vikamusk Industries"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Sectors</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Applications & Sectors
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-center">
              Explore the industries we equip and the types of equipment best suited for each.
            </p>
          </AnimatedSection>

          <div style={{ padding: '0 0.5rem', marginTop: '1rem' }}>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((industry, i) => (
              <StaggerItem key={i}>
                <IndustryCard
                  emoji={industry.emoji}
                  name={industry.name}
                  desc={industry.desc}
                  equipment={industry.equipment}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '8+', label: 'Industries Served' },
              { value: '20+', label: 'Countries Reached' },
              { value: '350+', label: 'Equipment Delivered' },
              { value: '10+', label: 'Manufacturing Partners' },
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
                Need Equipment for Your Industry?
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
                Tell us about your application and we&apos;ll recommend the right equipment and
                support package for your operation.
              </p>
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: '1.25rem', marginTop: '0.5rem' }}
              >
                <Link
                  href="/contact"
                  className="btn-primary hover:!bg-white hover:!text-[#001f3f] hover:!border-black font-bold rounded-xl transition-all duration-300 inline-flex items-center gap-2.5 hover:scale-105 shadow-lg shadow-amber-500/20 hover:shadow-none"
                  style={{
                    padding: '1rem 2.25rem',
                    fontSize: '0.95rem',
                  }}
                >
                  Get in Touch <Phone size={18} />
                </Link>
                <Link
                  href="/products"
                  className="bg-white/10 hover:!bg-white text-white hover:!text-[#001f3f] font-semibold rounded-xl border-2 border-white/20 hover:!border-black transition-all duration-300 inline-flex items-center gap-2.5 hover:scale-105"
                  style={{
                    padding: '1rem 2.25rem',
                    fontSize: '0.95rem',
                  }}
                >
                  View Products <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
