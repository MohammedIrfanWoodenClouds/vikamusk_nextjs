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
      <section className="relative pb-20 sm:pb-28 bg-primary overflow-hidden" style={{ paddingTop: 'clamp(140px, 15vw, 200px)' }}>
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
                { icon: <Globe size={28} />, title: 'Global Exposure', desc: 'Work across our service network spanning 7 countries including UAE, Saudi Arabia, Oman, Kuwait, Qatar, Bahrain, and India.' },
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
              <div className="bg-white rounded-3xl p-12 lg:p-20 text-center border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Briefcase size={40} className="text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-primary mb-4">No Active Openings</h3>
                <p className="text-muted max-w-md mx-auto mb-10 text-lg font-medium">
                  We don&apos;t have any specific roles open right now, but we&apos;re always expanding. Send us your profile for future opportunities.
                </p>
                <a href="mailto:career@vikamusk.com" className="bg-accent hover:bg-primary text-[#001f3f] hover:text-white font-black text-xs uppercase tracking-widest px-10 py-5 rounded-2xl transition-all inline-flex items-center gap-3">
                  <Mail size={18} /> Drop Your Resume
                </a>
              </div>
            </AnimatedSection>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {careers.map((career) => (
                <StaggerItem key={career.id}>
                  <div 
                    className="group bg-white border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_45px_100px_-30px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full overflow-hidden"
                    style={{ 
                      borderRadius: '2rem',
                      padding: '2.5rem 2.5rem' 
                    }}
                  >
                    {/* Card Header & Dept */}
                    <div className="flex items-center justify-between mb-8">
                       <span className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-[11px] font-black uppercase tracking-widest">
                         {career.department || 'General'}
                       </span>
                       <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                         Recent
                       </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-3xl font-black text-[#001f3f] mb-6 leading-[1.15] group-hover:text-accent transition-colors duration-500 line-clamp-2">
                        {career.title}
                      </h3>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.1em]">
                          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                            <MapPin size={14} className="text-accent" />
                          </div>
                          {career.location}
                        </div>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.1em]">
                          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                            <Briefcase size={14} className="text-accent" />
                          </div>
                          {career.type}
                        </div>
                      </div>

                      <div className="border-l-2 border-accent/20 pl-4 py-1 mb-4">
                        <p className="text-[14px] text-gray-400 font-medium leading-[1.6] italic opacity-80">
                          "{career.description}"
                        </p>
                      </div>
                    </div>

                    {/* Expandable Details Area */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expanded === career.id ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                      }`}
                    >
                      <div className="space-y-6 pt-4 border-t border-gray-50">
                        {(() => {
                           const raw = career.requirements || '';
                           const fromJson = parseJson(raw);
                           const finalReqs = (fromJson.length > 0 ? fromJson : raw.split('\n'))
                             .map(r => r.trim())
                             .filter(r => r && r !== '[]' && r !== '[""]' && r !== 'null');
                           
                           if (finalReqs.length === 0) return null;

                           return (
                             <div>
                               <h4 className="text-[11px] font-black text-[#001f3f] uppercase tracking-widest mb-3 flex items-center gap-2">
                                 <span className="w-1 h-3 bg-accent rounded-full"></span>
                                 Requirements
                               </h4>
                               <ul className="space-y-2.5">
                                 {finalReqs.map((req, idx) => (
                                   <li key={idx} className="flex items-start gap-2.5 text-[13px] text-gray-500 leading-relaxed">
                                     <Check size={14} className="text-accent mt-0.5 shrink-0" />
                                     <span>{req.replace(/^[-*•]\s*/, '')}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           );
                        })()}

                        {(() => {
                           const raw = career.benefits || '';
                           const fromJson = parseJson(raw);
                           const finalBens = (fromJson.length > 0 ? fromJson : raw.split('\n'))
                             .map(b => b.trim())
                             .filter(b => b && b !== '[]' && b !== '[""]' && b !== 'null');
                           
                           if (finalBens.length === 0) return null;

                           return (
                             <div>
                               <h4 className="text-[11px] font-black text-[#001f3f] uppercase tracking-widest mb-3 flex items-center gap-2">
                                 <span className="w-1 h-3 bg-accent rounded-full"></span>
                                 Benefits
                               </h4>
                               <ul className="space-y-2.5">
                                 {finalBens.map((ben, idx) => (
                                   <li key={idx} className="flex items-start gap-2.5 text-[13px] text-gray-500 leading-relaxed">
                                     <Check size={14} className="text-accent mt-0.5 shrink-0" />
                                     <span>{ben.replace(/^[-*•]\s*/, '')}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           );
                        })()}
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-6 border-t border-gray-50 mt-auto flex flex-col gap-4">
                      <a
                        href={`mailto:career@vikamusk.com?subject=Application for ${career.title}`}
                        className="w-full bg-[#001f3f] hover:bg-accent text-white hover:text-[#001f3f] font-black text-[12px] uppercase tracking-[0.25em] py-4 rounded-xl transition-all duration-500 text-center shadow-md hover:shadow-lg"
                      >
                        Send Resume
                      </a>
                      <button
                        onClick={() => setExpanded(expanded === career.id ? null : career.id)}
                        className="w-full justify-center text-gray-400 hover:text-primary font-black text-[11px] uppercase tracking-[0.2em] py-2 transition-all duration-300 text-center flex items-center gap-1.5"
                      >
                        <span>{expanded === career.id ? 'Show Less' : 'Learn More'}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${expanded === career.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
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
                Interested in Joining Our Team?
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
                We&apos;re always looking for talented individuals who share our passion for engineering excellence. Send us your resume and let&apos;s start a conversation.
              </p>
              <div
                className="flex flex-col sm:flex-row justify-center items-center w-full px-4"
                style={{ gap: '1rem', marginTop: '0.5rem' }}
              >
                <a
                  href="mailto:career@vikamusk.com"
                  className="w-full sm:w-auto bg-accent hover:bg-white text-[#001f3f] hover:text-[#001f3f] font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Send Resume <Mail size={18} />
                </a>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-[#001f3f] font-semibold rounded-xl border border-white/20 hover:border-white transition-all inline-flex items-center justify-center gap-2.5 hover:scale-105 hover:shadow-[0_0_25_rgba(255,255,255,0.4)]"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
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
