'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Mail, Users, Globe, Lightbulb, TrendingUp, MapPin, Clock, Briefcase, ChevronDown, Check } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

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
      <section className="relative pt-44 lg:pt-52 pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/company/vikamusk-reception.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Join Our Team</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6">Careers at Vikamusk</h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
              Be part of a team that&apos;s shaping the future of construction equipment and material handling solutions across the globe.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Join */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Why Vikamusk</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">Why Work With Us</h2>
            <p className="text-muted max-w-2xl mx-auto">
              At Vikamusk, we believe our people are our greatest asset. Join a dynamic team that values innovation, growth, and excellence.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe size={24} />, title: 'Global Exposure', desc: 'Work across UAE, India, and China in a truly international environment.' },
              { icon: <TrendingUp size={24} />, title: 'Career Growth', desc: 'Clear paths for advancement with mentorship and skill development.' },
              { icon: <Users size={24} />, title: 'Dynamic Team', desc: 'Collaborate with engineers, designers, and business professionals.' },
              { icon: <Lightbulb size={24} />, title: 'Innovation First', desc: 'Work with cutting-edge equipment and modern engineering solutions.' },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="p-8 rounded-2xl bg-surface border border-border/50 text-center h-full hover:border-accent/30 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-5">{item.icon}</div>
                  <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Opportunities</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">Open Positions</h2>
            <p className="text-muted max-w-xl mx-auto">
              Explore current openings and find the right role for you.
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted">Loading positions...</p>
            </div>
          ) : careers.length === 0 ? (
            <AnimatedSection>
              <div className="bg-white rounded-3xl p-12 lg:p-16 text-center border border-border/50">
                <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-2xl font-bold text-primary mb-3">No Open Positions Right Now</h3>
                <p className="text-muted max-w-md mx-auto mb-6">
                  We don&apos;t have any openings at the moment, but we&apos;re always looking for talented individuals. Send us your resume!
                </p>
                <a href="mailto:career@vikamusk.com" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
                  <Mail size={18} /> Send Resume
                </a>
              </div>
            </AnimatedSection>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {careers.map((career) => {
                const requirements = parseJson(career.requirements);
                const benefits = parseJson(career.benefits);
                const isExpanded = expanded === career.id;

                return (
                  <AnimatedSection key={career.id}>
                    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden hover:border-accent/20 transition-all shadow-sm">
                      {/* Header */}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : career.id)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-primary mb-1">{career.title}</h3>
                          <div className="flex flex-wrap gap-3">
                            {career.department && (
                              <span className="flex items-center gap-1 text-xs text-muted"><Briefcase size={12} /> {career.department}</span>
                            )}
                            {career.location && (
                              <span className="flex items-center gap-1 text-xs text-muted"><MapPin size={12} /> {career.location}</span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted"><Clock size={12} /> {career.type}</span>
                          </div>
                        </div>
                        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-border/50 pt-5 space-y-6">
                          {career.description && (
                            <div>
                              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">About the Role</h4>
                              <p className="text-muted text-sm leading-relaxed">{career.description}</p>
                            </div>
                          )}

                          {requirements.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Requirements</h4>
                              <div className="space-y-2">
                                {requirements.map((req, i) => (
                                  <div key={i} className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={11} className="text-accent" /></div>
                                    <span className="text-sm text-muted">{req}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {benefits.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Benefits</h4>
                              <div className="space-y-2">
                                {benefits.map((ben, i) => (
                                  <div key={i} className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={11} className="text-emerald-500" /></div>
                                    <span className="text-sm text-muted">{ben}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2">
                            <a href={`mailto:career@vikamusk.com?subject=Application for ${career.title}`} className="btn-primary px-6 py-3 inline-flex items-center gap-2 text-sm">
                              <Mail size={16} /> Apply for this Position
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection>
            <div className="bg-primary rounded-3xl p-12 lg:p-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Interested in Joining Us?</h2>
              <p className="text-white/60 max-w-lg mx-auto mb-8">
                We&apos;re always looking for talented individuals who share our passion for engineering excellence. Send us your resume and let&apos;s start a conversation.
              </p>
              <a href="mailto:career@vikamusk.com" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
                <Mail size={18} /> Send Resume to career@vikamusk.com
              </a>
              <p className="text-white/30 text-sm mt-6">
                Or email us directly at <a href="mailto:career@vikamusk.com" className="text-accent hover:underline">career@vikamusk.com</a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
