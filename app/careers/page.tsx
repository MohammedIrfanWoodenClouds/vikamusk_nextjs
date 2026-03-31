'use client';

import Image from 'next/image';
import { ArrowRight, Mail, Users, Globe, Lightbulb, TrendingUp } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

export default function Careers() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/company/vikamusk-reception.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Join Our Team</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6">
              Careers at Vikamusk
            </h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
              Be part of a team that's shaping the future of construction equipment and 
              material handling solutions across the globe.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Join */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Why Vikamusk</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">
              Why Work With Us
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              At Vikamusk, we believe our people are our greatest asset. Join a dynamic 
              team that values innovation, growth, and excellence.
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
                  <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection>
            <div className="bg-primary rounded-3xl p-12 lg:p-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                Interested in Joining Us?
              </h2>
              <p className="text-white/60 max-w-lg mx-auto mb-8">
                We&apos;re always looking for talented individuals who share our passion for 
                engineering excellence. Send us your resume and let&apos;s start a conversation.
              </p>
              <a
                href="mailto:career@vikamusk.com"
                className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2"
              >
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
