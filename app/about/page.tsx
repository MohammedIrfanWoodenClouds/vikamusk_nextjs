'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Target, Eye, Briefcase, Users, Lightbulb, Globe } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/company/vikamusk-company-china-.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Who We Are</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6 max-w-2xl">
              About Vikamusk International
            </h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
              A trusted name in construction equipment and material handling solutions since 2015.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-6">
                Discover Our Story
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Founded in 2015 in India and now proudly established in the Ajman Free Zone of UAE, 
                Vikamusk Construction Equipment is a trusted supplier of advanced construction and 
                material handling solutions, serving clients across China, UAE, Saudi Arabia, Oman and India.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                Specializing in Forklifts and Aerial Work Platforms, Vikamusk provides reliable 
                equipment designed to enhance efficiency, safety, and productivity on every job site.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                Vikamusk is involved in collaboration with 10+ Industrial manufacturers. With a strong 
                focus on quality, performance, and customer satisfaction, the company caters to a wide 
                range of industries, including construction, maintenance, logistics and service sectors.
              </p>
              <p className="text-muted leading-relaxed">
                Driven by a vision to empower progress through smart lifting and handling solutions, 
                Vikamusk Construction Equipment continues to build lasting partnerships and set new 
                standards in equipment reliability across the region. The company is planning to 
                establish market networks and service systems spanning the globe, providing products 
                and services to more than 20 countries.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/company/vikamusk-reception.png"
                  alt="Vikamusk Reception"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3">
              Mission & Vision
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection direction="left">
              <div className="p-10 bg-white rounded-2xl border border-border/50 h-full">
                <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-black text-primary mb-4">Our Mission</h3>
                <p className="text-muted leading-relaxed">
                  To foster "A World of Creativity and Engineering Excellence" by delivering 
                  high-quality construction and material handling solutions. Our multidisciplinary 
                  approach bridges the gap between engineering and design, offering clients 
                  holistic solutions that are both technically sound and aesthetically refined.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="p-10 bg-white rounded-2xl border border-border/50 h-full">
                <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                  <Eye size={28} />
                </div>
                <h3 className="text-2xl font-black text-primary mb-4">Our Vision</h3>
                <p className="text-muted leading-relaxed">
                  To empower progress through smart lifting and handling solutions across 
                  the globe. We aim to be the most trusted partner in construction equipment, 
                  continuously evolving to meet the changing needs of the market while staying 
                  true to our core principles of quality, reliability, and innovation.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-3">
              Our Core Values
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Lightbulb size={24} />, title: 'Innovation', desc: 'Constantly evolving with cutting-edge technology and forward-thinking solutions.' },
              { icon: <Users size={24} />, title: 'Customer Focus', desc: 'Building lasting partnerships through exceptional service and support.' },
              { icon: <Briefcase size={24} />, title: 'Quality', desc: 'Unwavering commitment to premium, durable, high-performing equipment.' },
              { icon: <Globe size={24} />, title: 'Global Reach', desc: 'Expanding our networks to serve clients across 20+ countries worldwide.' },
            ].map((val, i) => (
              <StaggerItem key={i}>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center h-full">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                    {val.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-white/50 text-sm">{val.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Key Domains */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">What We Do</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Three Key Domains
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              With a focus on innovation and technical excellence, we deliver high-quality 
              solutions across three key domains.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Industrial & Construction Equipment Supply',
                desc: 'Comprehensive range of forklifts, aerial platforms, excavators, and specialized construction machinery from 10+ leading manufacturers.',
              },
              {
                num: '02',
                title: 'Design & Drafting',
                desc: 'Professional engineering design and drafting services that bridge the gap between technical requirements and creative solutions.',
              },
              {
                num: '03',
                title: 'Service & Support',
                desc: 'Dependable after-sales service including maintenance, spare parts, technical assistance and operator training programs.',
              },
            ].map((domain, i) => (
              <StaggerItem key={i}>
                <div className="p-8 rounded-2xl bg-surface border border-border/50 h-full group hover:border-accent/30 transition-colors">
                  <span className="text-5xl font-black text-accent/20 group-hover:text-accent/40 transition-colors">{domain.num}</span>
                  <h3 className="text-xl font-bold text-primary mt-4 mb-3">{domain.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{domain.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#001f3f]">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-5">
              Ready to Work With Us?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Contact our team to discuss your equipment needs and discover how Vikamusk can help.
            </p>
            <Link href="/contact" className="bg-accent hover:bg-amber-600 text-[#001f3f] font-bold px-7 py-3.5 rounded-lg transition-all inline-flex items-center gap-2 text-sm">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
