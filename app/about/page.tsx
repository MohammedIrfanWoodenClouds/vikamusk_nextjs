'use client';
 
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Target, Eye, Briefcase, Users, Lightbulb, Globe, Phone, Package, ChevronRight, Loader2 } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';

export default function About() {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
 
  useEffect(() => {
    fetch('/api/public/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoadingCats(false);
      })
      .catch(() => setLoadingCats(false));
  }, []);
 
  return (
    <>
      {/* Hero */}
      <section className="relative pb-20 sm:pb-28 bg-primary overflow-hidden" style={{ paddingTop: 'clamp(140px, 15vw, 200px)' }}>
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/company/vikamusk-company-china-.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center">
            <span 
              className="text-sm font-bold text-accent uppercase tracking-wider block"
              style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
            >
              Who We Are
            </span>
            <h1 
              className="text-4xl lg:text-5xl font-black text-white leading-tight"
              style={{ marginBottom: '2rem' }}
            >
              About Vikamusk International
            </h1>
            <p 
              className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto"
              style={{ marginBottom: '3rem' }}
            >
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
                Vikamusk Construction Equipment is a trusted supplier of advanced construction and 
                material handling solutions, serving clients across UAE, Saudi Arabia, Oman, Kuwait, Qatar, Bahrain, and India.
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
                Vikamusk Construction Equipment continues to build lasting partnerships and set new 
                standards in equipment reliability across the region. The company is establishing 
                market networks and service systems spanning the globe, including 7 countries as per service network.
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
                desc: 'Expanding our networks and service systems to provide reliable products and expertise to 7 countries as per service network.' 
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
 
      {/* Dynamic Categories Section */}
      <section 
        className="pt-8 lg:pt-12 bg-surface relative overflow-hidden"
        style={{ paddingBottom: '10rem' }}
      >
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center mb-0">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Range</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Specialized Categories
            </h2>
            <p 
              className="text-muted max-w-2xl mx-auto text-center"
              style={{ marginBottom: '2rem' }}
            >
              Discover our comprehensive selection of high-performance equipment, 
              tailored for diverse industrial and construction needs.
            </p>
          </AnimatedSection>
 
          {loadingCats ? (
            <div className="flex justify-center py-20">
              <Loader2 size={40} className="animate-spin text-accent" />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
              {categories.map((cat: any, i: number) => (
                <StaggerItem key={cat.id} className="flex flex-col h-full">
                  <Link 
                    href={`/categories/${cat.slug}`}
                    className="group flex flex-col flex-1 bg-white border-2 border-black rounded-[2rem] overflow-hidden shadow-[0_8px_0_#000] transition-all duration-300"
                  >
                    <div className="relative aspect-[16/11] bg-white p-12 flex items-center justify-center border-b-2 border-black shrink-0">
                      {cat.image ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <Package size={48} className="opacity-20" />
                        </div>
                      )}
                    </div>
                    <div 
                      className="px-8 pt-8 flex-1 flex flex-col items-center text-center"
                      style={{ paddingBottom: '2rem' }}
                    >
                      <h3 className="text-xl sm:text-[22px] font-black text-black uppercase mb-8 tracking-tight transition-colors min-h-[56px] flex items-center justify-center">
                        {cat.name}
                      </h3>
                      
                      <div className="w-full mt-auto flex justify-center">
                        <div className="flex items-center justify-center w-[85%] py-3.5 bg-accent text-white border-2 border-black rounded-xl text-[13px] font-black uppercase tracking-widest shadow-[0_4px_0_#000] transition-all duration-200">
                          View Category <ArrowRight size={16} className="ml-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
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
                Ready to Work With Us?
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
                Contact our team today to discuss your industrial equipment needs and discover 
                how Vikamusk&apos;s technical expertise can empower your operation.
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
                  Get in Touch <Phone size={18} />
                </Link>
                <Link
                  href="/products"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-[#001f3f] font-semibold rounded-xl border border-white/20 hover:border-white transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                  }}
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
