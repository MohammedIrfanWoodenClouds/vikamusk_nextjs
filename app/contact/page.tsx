'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Mail, MapPin, Send, Building2, Clock, CheckCircle2, AlertCircle,
  Loader2, Phone, ArrowUpRight, ChevronDown, Zap, Globe,
} from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          subject: 'General Enquiry',
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-white">

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section
        className="relative bg-[#001f3f] overflow-hidden"
        style={{ paddingTop: '148px', paddingBottom: '112px' }}
      >
        {/* Background image — very subtle */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" priority />
        </div>

        {/* Base gradient — fully contained, no bottom bleed */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#072443] to-[#001229] pointer-events-none" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Amber glow accent — top-right */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[#f59e0b]/[0.06] blur-[100px] pointer-events-none" />

        {/* Wave bridge — softens the hero → section hard edge */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0,56 L0,28 Q360,0 720,28 Q1080,56 1440,28 L1440,56 Z" fill="#f8fafc" />
          </svg>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <AnimatedSection direction="up">
              <span className="inline-flex items-center gap-3 text-[#f59e0b] font-bold uppercase tracking-[0.35em] text-[11px] mb-8">
                <span className="block w-10 h-px bg-[#f59e0b]/50" />
                Get In Touch
                <span className="block w-10 h-px bg-[#f59e0b]/50" />
              </span>

              <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black text-white leading-[1.02] tracking-tight mb-6">
                Global Edge.{' '}
                <span className="text-[#f59e0b]">Direct&nbsp;Support.</span>
              </h1>

              <p className="text-white/55 text-lg leading-relaxed max-w-xl font-medium">
                Connect with our specialists across UAE and India. From equipment
                sourcing to after-sales — we respond within 24 hours.
              </p>
            </AnimatedSection>

            {/* Quick-stats bar */}
            <AnimatedSection direction="up" delay={0.18}>
              <div className="flex flex-wrap gap-6 mt-12">
                {[
                  { value: '< 24 hrs', label: 'Response Time' },
                  { value: '15+', label: 'Countries Served' },
                  { value: '50+', label: 'Team Specialists' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/25 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    </div>
                    <div>
                      <p className="text-white font-black text-base leading-none">{value}</p>
                      <p className="text-white/40 text-xs font-medium mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>




      {/* ══ CONTACT FORM ═══════════════════════════════════════════ */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] mb-4">Get in Touch</h2>
                <p className="text-slate-500 text-lg">Nunc erat cursus tellus gravida.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {/* First Name */}
                  <div className="space-y-3">
                    <label htmlFor="firstName" className="block text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      placeholder="Please enter first name..."
                      className="w-full h-14 bg-white border-2 border-slate-100 rounded-lg px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-3">
                    <label htmlFor="lastName" className="block text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      placeholder="Please enter last name..."
                      className="w-full h-14 bg-white border-2 border-slate-100 rounded-lg px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="Please enter email..."
                      className="w-full h-14 bg-white border-2 border-slate-100 rounded-lg px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-3">
                    <label htmlFor="phone" className="block text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="Please enter phone number..."
                      className="w-full h-14 bg-white border-2 border-slate-100 rounded-lg px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <label htmlFor="message" className="block text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    What Do You Have In Mind
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    placeholder="Please enter query..."
                    className="w-full p-6 bg-white border-2 border-slate-100 rounded-lg text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-bold uppercase tracking-wider">Message sent successfully!</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold uppercase tracking-wider">{errorMsg}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`
                    w-full h-16 rounded-lg font-black uppercase tracking-[0.25em] text-sm transition-all duration-300
                    flex items-center justify-center gap-3
                    ${status === 'loading' 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-[#fabc22] text-white hover:bg-white hover:text-[#001f3f] hover:border-2 hover:border-black shadow-lg hover:shadow-2xl'
                    }
                  `}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══ MAP SECTION ═════════════════════════════════════════════ */}

      <section className="bg-white pt-24 pb-20">
        <div className="container-custom">
          <AnimatedSection direction="up">
            <div className="text-center mb-14">
              <span className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-widest">Visit Us</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#001f3f] mt-3 mb-4">Our Global Presence</h2>
              <div className="w-12 h-1 bg-[#f59e0b] rounded-full mx-auto" />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.15}>
            {/* map-container triggers .map-iframe hover rule in globals.css */}
            <div className="map-container relative group rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-[0_8px_40px_rgba(0,31,63,0.1)] h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.1!2d55.4529249!3d25.419355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5700095feacd%3A0xd5d4c8ef24f9568e!2sVikamusk%20Construction%20Equipment%20FZE!5e0!3m2!1sen!2sae!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vikamusk Location"
                className="map-iframe"
              />

              {/* Subtle overlay disappears on hover */}
              <div className="absolute inset-0 bg-[#001f3f]/5 pointer-events-none group-hover:opacity-0 transition-opacity duration-500" />

              {/* Floating location card */}
              <div className="absolute bottom-6 left-6 lg:left-10 group-hover:-translate-y-1 transition-transform duration-500">
                <div className="bg-white/95 backdrop-blur-xl p-5 rounded-xl border border-white/30 shadow-2xl flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#001f3f] text-[#f59e0b] flex items-center justify-center shadow-lg shrink-0">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#001f3f]/40 uppercase tracking-widest mb-1">
                      Office Location
                    </p>
                    <p className="text-sm font-black text-[#001f3f] leading-tight">Ajman Free Zone</p>
                    <p className="text-xs text-[#64748b] font-medium mt-0.5">United Arab Emirates</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer breathing room */}
      <div className="h-16" />
    </div>
  );
}
