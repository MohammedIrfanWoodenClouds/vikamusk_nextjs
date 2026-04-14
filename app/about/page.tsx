'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Target, Eye, Briefcase, Users, Lightbulb, Globe, Phone } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative pb-28 bg-primary overflow-hidden" style={{ paddingTop: '200px' }}>
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/company/vikamusk-company-china-.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center">
            <span className="text-sm font-bold text-accent uppercase tracking-wider block mb-4">Who We Are</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              About Vikamusk International
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-4xl" style={{ marginBottom: '3rem' }}>
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
                Founded in 2015 and now proudly established in the Ajman Free Zone of UAE, 
                Vikamusk Construction Equipment is a trusted supplier of advanced construction and 
                material handling solutions, serving clients across China, UAE, Saudi Arabia and Oman.
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
                  priority
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <AnimatedSection className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-3 mb-4">
              Mission & Vision
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-center" style={{ marginBottom: '2rem' }}>
              Our core values guide every decision we make, ensuring we deliver excellence 
              in engineering while empowering global progress through innovative lifting solutions.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <StaggerItem className="h-full">
              <div className="group p-10 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-300 hover-lift h-full overflow-hidden">
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                    <Target size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Our Mission</h3>
                    <p className="text-white/50 leading-relaxed">
                      To foster 'A World of Creativity and Engineering Excellence' by delivering high-quality construction and material handling solutions. Our multidisciplinary approach bridges the gap between engineering and design, offering clients holistic solutions that are both technically sound and aesthetically refined.
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem className="h-full">
              <div className="group p-10 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-300 hover-lift h-full overflow-hidden">
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                    <Eye size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Our Vision</h3>
                    <p className="text-white/50 leading-relaxed">
                      To empower progress through smart lifting and handling solutions across the globe. We aim to be the most trusted partner in construction equipment, continuously evolving to meet the changing needs of the market while staying true to our core principles of quality, reliability, and innovation.
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Our Core Values
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-center" style={{ marginBottom: '2rem' }}>
              Our foundation is built on four core principles that guide our technical innovation 
              and our commitment to worldwide customer success.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                icon: <Lightbulb size={28} />, 
                title: 'Innovation', 
                desc: 'Constantly evolving with cutting-edge technology and forward-thinking engineering solutions that solve real-world industrial challenges.' 
              },
              { 
                icon: <Users size={28} />, 
                title: 'Customer Focus', 
                desc: 'Building lasting global partnerships through exceptional after-sales support and a deep understanding of unique operational needs.' 
              },
              { 
                icon: <Briefcase size={28} />, 
                title: 'Quality Excellence', 
                desc: 'Unwavering commitment to premium, durable, and high-performing equipment that exceeds international industry standards.' 
              },
              { 
                icon: <Globe size={28} />, 
                title: 'Global Reach', 
                desc: 'Expanding our networks and service systems to provide reliable products and expertise to more than 20 countries worldwide.' 
              },
            ].map((val, i) => (
              <StaggerItem key={i} className="h-full">
                <ServiceCard
                  icon={val.icon}
                  title={val.title}
                  desc={val.desc}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>



      {/* CTA */}
      <section className="bg-[#001f3f]" style={{ paddingTop: '5rem', paddingBottom: '7rem' }}>
        <div 
          className="container-custom"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <AnimatedSection>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 className="text-3xl lg:text-4xl font-black text-white text-center" style={{ marginBottom: '2rem' }}>
                Ready to Work With Us?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-center leading-relaxed" style={{ fontSize: '1.05rem', marginBottom: '2rem' }}>
                Contact our team today to discuss your industrial equipment needs and discover 
                how Vikamusk&apos;s technical expertise can empower your operation.
              </p>
              <div className="flex flex-wrap justify-center gap-5">
                <Link 
                  href="/contact"
                  className="btn-primary hover:!bg-white hover:!text-[#001f3f] hover:!border-black font-bold rounded-xl transition-all duration-300 inline-flex items-center gap-2.5 hover:scale-105 shadow-lg shadow-amber-500/20 hover:shadow-none"
                  style={{ padding: '1rem 2.25rem', fontSize: '0.95rem' }}
                >
                  Get in Touch <Phone size={18} />
                </Link>
                <Link 
                  href="/products"
                  className="bg-white/10 hover:!bg-white text-white hover:!text-[#001f3f] font-semibold rounded-xl border-2 border-white/20 hover:!border-black transition-all duration-300 inline-flex items-center gap-2.5 hover:scale-105"
                  style={{ padding: '1rem 2.25rem', fontSize: '0.95rem' }}
                >
                  Explore Products <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
