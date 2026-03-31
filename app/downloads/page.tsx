'use client';

import Image from 'next/image';
import { Download, FileText, ArrowRight } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import Link from 'next/link';

const downloads = [
  {
    title: 'Vikamusk Company Profile',
    description: 'Complete company overview including our product range, manufacturing partners, global presence and service capabilities.',
    file: '/vikamusk-company-profile.pdf',
    type: 'PDF',
    size: 'Company Brochure',
  },
];

export default function Downloads() {
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
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Resources</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6">
              Downloads & Brochures
            </h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
              Access our company brochures, product catalogs, and technical documentation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {downloads.map((item, i) => (
              <StaggerItem key={i}>
                <div className="bg-white rounded-2xl border border-border/50 overflow-hidden hover-lift h-full flex flex-col">
                  <div className="p-8 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
                      <FileText size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">{item.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="px-2 py-1 bg-surface rounded font-semibold">{item.type}</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  <div className="px-8 pb-8">
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center"
                    >
                      <Download size={16} /> Download
                    </a>
                  </div>
                </div>
              </StaggerItem>
            ))}

            {/* Product Catalog Placeholder */}
            <StaggerItem>
              <div className="bg-white rounded-2xl border border-dashed border-border overflow-hidden h-full flex flex-col">
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-surface text-muted flex items-center justify-center mb-5">
                    <FileText size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">Product Catalogs</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    Detailed product catalogs for each equipment category coming soon.
                  </p>
                  <Link href="/contact" className="text-sm font-semibold text-accent flex items-center gap-1">
                    Request Catalog <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-2xl border border-dashed border-border overflow-hidden h-full flex flex-col">
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-surface text-muted flex items-center justify-center mb-5">
                    <FileText size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">Technical Specs</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    Detailed technical specification sheets for all equipment models.
                  </p>
                  <Link href="/contact" className="text-sm font-semibold text-accent flex items-center gap-1">
                    Request Specs <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* CTA */}
          <AnimatedSection>
            <div className="bg-primary rounded-2xl p-10 lg:p-14 text-center">
              <h2 className="text-2xl lg:text-3xl font-black text-white mb-4">
                Need Specific Documentation?
              </h2>
              <p className="text-white/60 max-w-lg mx-auto mb-8">
                Contact our sales team for specific product brochures, technical specifications, 
                or certification documents.
              </p>
              <Link href="/contact" className="btn-primary px-8 py-4">
                Contact Sales <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
