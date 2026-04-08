'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Mail, Users, Globe, Lightbulb, TrendingUp, MapPin, Clock, Briefcase, ChevronDown, Check, Phone } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';

interface Career {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  benefits: string;
  is_active: number;
  created_at: string;
}

export default function Careers() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/public/careers')
      .then(r => r.json())
      .then(data => {
        setCareers(data.careers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const parseJson = (str: string): string[] => {
    try { const arr = JSON.parse(str); return Array.isArray(arr) ? arr : []; } catch { return []; }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pb-28 bg-primary overflow-hidden" style={{ paddingTop: '200px' }}>
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/company/vikamusk-reception.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center">
            <span className="text-sm font-bold text-accent uppercase tracking-wider block mb-4">Join Our Team</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">Careers at Vikamusk</h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl" style={{ marginBottom: '3rem' }}>
              Be part of a team that&apos;s shaping the future of construction equipment and material handling solutions across the globe.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Join */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Why Vikamusk</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">Why Work With Us</h2>
            <p className="text-muted max-w-2xl mx-auto text-center">
              At Vikamusk, we believe our people are our greatest asset. Join a dynamic team that values innovation, growth, and excellence.
            </p>
          </AnimatedSection>

          <div style={{ padding: '0 0.5rem', marginTop: '1rem' }}>
            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { icon: <Globe size={28} />, title: 'Global Exposure', desc: 'Work across UAE, India, and China in a truly international environment. Gain valuable experience in diverse global markets.' },
                { icon: <TrendingUp size={28} />, title: 'Career Growth', desc: 'Clear paths for advancement with mentorship and professional development programs to help you reach your full potential.' },
                { icon: <Users size={28} />, title: 'Dynamic Team', desc: 'Collaborate with talented engineers, designers, and business professionals in a supportive and inclusive culture.' },
                { icon: <Lightbulb size={28} />, title: 'Innovation First', desc: 'Work with cutting-edge equipment and modern engineering solutions that solve real-world industrial challenges.' },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <ServiceCard 
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Opportunities</span>
            <h2 className="text-3xl lg:text-[42px] font-black text-primary mt-3 mb-4">Open Positions</h2>
            <p className="text-muted max-w-xl mx-auto text-center leading-relaxed">
              Explore current openings and find the right role for you at Vikamusk. 
              Join a team that&apos;s shaping the future of industrial equipment.
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-24">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-primary font-medium tracking-wide">Scanning for talent...</p>
            </div>
          ) : careers.length === 0 ? (
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-12 lg:p-20 text-center border border-border/50 shadow-sm max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Briefcase size={40} className="text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-primary mb-4">No Active Openings</h3>
                <p className="text-muted max-w-md mx-auto mb-10 text-lg">
                  We don&apos;t have any specific roles open right now, but we&apos;re always expanding. Send us your profile for future opportunities.
                </p>
                <a href="mailto:career@vikamusk.com" className="btn-primary px-10 py-5 inline-flex items-center gap-3 text-lg">
                  <Mail size={20} /> Drop Your Resume
                </a>
              </div>
            </AnimatedSection>
          ) : (
            <div className="flex flex-col items-center gap-4 max-w-7xl mx-auto">
              {careers.map((career) => {
                const requirements = parseJson(career.requirements);
                const benefits = parseJson(career.benefits);
                const isExpanded = expanded === career.id;

                return (
                  <AnimatedSection key={career.id} className="w-full flex justify-center">
                    <div 
                      className={`group bg-white rounded-2xl border transition-all duration-500 overflow-hidden w-full max-w-4xl mx-auto ${
                        isExpanded 
                        ? 'border-accent/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]' 
                        : 'border-border/50 hover:border-accent/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] shadow-sm'
                      }`}
                    >
                      {/* Main Card Header */}
                      <div className="p-6 md:p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                              {career.department && (
                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-black uppercase tracking-widest border border-accent/20">
                                  {career.department}
                                </span>
                              )}
                              <span className="px-3 py-1 rounded-full bg-primary/5 text-primary/60 text-[11px] font-black uppercase tracking-widest border border-primary/10">
                                {career.type}
                              </span>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-black text-primary group-hover:text-accent transition-colors duration-300">
                              {career.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-6">
                              {career.location && (
                                <div className="flex items-center gap-2 text-muted font-medium">
                                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                                    <MapPin size={16} className="text-accent" />
                                  </div>
                                  {career.location}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-muted font-medium">
                                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                                  <Clock size={16} className="text-accent" />
                                </div>
                                Posted Recently
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 lg:self-center">
                            <button
                              onClick={() => setExpanded(isExpanded ? null : career.id)}
                              className={`px-7 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 border-2 ${
                                isExpanded 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-transparent text-primary border-border hover:border-primary/20 hover:bg-surface'
                              }`}
                            >
                              {isExpanded ? 'Hide Details' : 'View Details'}
                              <ChevronDown size={20} className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <a
                              href={`mailto:career@vikamusk.com?subject=Application for ${career.title}`}
                              className="px-7 py-4 rounded-2xl bg-accent text-[#001f3f] font-bold hover:bg-primary hover:text-white transition-all shadow-lg shadow-accent/20 flex items-center gap-3 border-2 border-accent hover:border-primary"
                            >
                              Apply Now <ArrowRight size={20} />
                            </a>
                          </div>
                        </div>
                        
                        {/* Expandable Details Container */}
                        <div 
                          className={`grid transition-all duration-500 ease-in-out ${
                            isExpanded ? 'grid-rows-[1fr] opacity-100 mt-12' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="pt-10 border-t border-border/50 space-y-12">
                              {/* About the Role */}
                              {career.description && (
                                <div className="max-w-3xl">
                                  <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    The Opportunity
                                  </h4>
                                  <p className="text-muted text-[16px] leading-[1.8] font-medium">
                                    {career.description}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                                {/* Requirements */}
                                {requirements.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                      What We Look For
                                    </h4>
                                    <ul className="space-y-4">
                                      {requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-4 group/item">
                                          <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-accent group-hover/item:text-white transition-all">
                                            <Check size={14} className="text-accent group-hover/item:text-white" />
                                          </div>
                                          <span className="text-[15px] text-muted font-medium leading-normal">{req}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Benefits */}
                                {benefits.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      Why Join Us
                                    </h4>
                                    <ul className="space-y-4">
                                      {benefits.map((ben, i) => (
                                        <li key={i} className="flex items-start gap-4 group/item">
                                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                            <Check size={14} className="text-emerald-500 group-hover/item:text-white" />
                                          </div>
                                          <span className="text-[15px] text-muted font-medium leading-normal">{ben}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Footer Action */}
                              <div className="pt-8 flex justify-center border-t border-border/10">
                                <a 
                                  href={`mailto:career@vikamusk.com?subject=Application for ${career.title}`} 
                                  className="group inline-flex items-center gap-4 text-primary font-black uppercase tracking-widest text-sm hover:text-accent transition-colors"
                                >
                                  Finalize Application <Mail size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
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
                className="text-3xl lg:text-4xl font-black text-white"
                style={{ marginBottom: '1.5rem', whiteSpace: 'nowrap', textAlign: 'center' }}
              >
                Interested in Joining Our Team?
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
                We&apos;re always looking for talented individuals who share our passion for engineering excellence. Send us your resume and let&apos;s start a conversation.
              </p>
              <div
                className="flex flex-wrap justify-center"
                style={{ gap: '1.25rem', marginTop: '0.5rem' }}
              >
                <a
                  href="mailto:career@vikamusk.com"
                  className="bg-accent hover:bg-white text-[#001f3f] hover:text-[#001f3f] font-bold rounded-xl transition-all inline-flex items-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 2.25rem',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Send Resume <Mail size={18} />
                </a>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white text-white hover:text-[#001f3f] font-semibold rounded-xl border border-white/20 hover:border-white transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 2.25rem',
                    fontSize: '0.95rem',
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
