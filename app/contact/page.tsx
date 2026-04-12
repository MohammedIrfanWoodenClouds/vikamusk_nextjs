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
    fullName: '',
    email: '',
    phone: '',
    subject: 'Construction Equipment',
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
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData({ fullName: '', email: '', phone: '', subject: 'Construction Equipment', message: '' });
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

      {/* ══ CONTACT BLOCK ════════════════════════════════════════════ */}
      <section className="relative z-10 bg-[#f8fafc] pt-24 pb-32">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-start">

            {/* ── Form card ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_12px_50px_rgba(0,31,63,0.08)] p-12 md:p-14 lg:p-16">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-[#001f3f] mb-3">Send us a message - VERIFIED</h2>
                <p className="text-[#64748b]">A specialist will contact you within 24 hours.</p>
              </div>

              {status === 'success' ? (
                <div className="text-center py-16 bg-emerald-50/60 rounded-2xl border border-emerald-200/50">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-black text-[#001f3f] mb-2">Message Sent!</h3>
                  <p className="text-[#64748b] text-sm mb-8 max-w-xs mx-auto">
                    Thank you for reaching out. Our team will be in touch shortly.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn-primary px-8 text-sm">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold flex items-center gap-3 animate-shake">
                      <AlertCircle size={18} className="shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  {/* Row 1 — Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-bold text-[#001f3f] uppercase tracking-widest">
                        Full Name <span className="text-[#f59e0b]">*</span>
                      </label>
                      <input
                        type="text" required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your Name"
                        className="contact-input"
                      />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-bold text-[#001f3f] uppercase tracking-widest">
                        Phone Number <span className="text-[#f59e0b]">*</span>
                      </label>
                      <input
                        type="tel" required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 XXX XXXX"
                        className="contact-input"
                      />
                    </div>
                  </div>

                  {/* Row 2 — Email */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-[#001f3f] uppercase tracking-widest">
                      Work Email <span className="text-[#f59e0b]">*</span>
                    </label>
                    <input
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@company.com"
                      className="contact-input"
                    />
                  </div>

                  {/* Row 3 — Inquiry type */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-[#001f3f] uppercase tracking-widest">
                      Inquiry Type
                    </label>
                    <div className="relative">
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="contact-input appearance-none cursor-pointer pr-10"
                      >
                        <option>Construction Equipment</option>
                        <option>Material Handling / Forklifts</option>
                        <option>Access Equipment / AWP</option>
                        <option>Maintenance &amp; Spare Parts</option>
                        <option>Rental Services</option>
                        <option>General Enquiry</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Row 4 — Message */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-[#001f3f] uppercase tracking-widest">
                      Message <span className="text-[#f59e0b]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your requirements or questions…"
                      className="contact-input resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="group w-full py-4.5 rounded-xl font-black uppercase tracking-widest text-sm
                                 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-[#001f3f]
                                 shadow-[0_4px_20px_rgba(245,158,11,0.3)]
                                 hover:shadow-[0_10px_32px_rgba(245,158,11,0.45)] hover:-translate-y-1
                                 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                                 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                    {status === 'loading' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </>
                    )}
                  </button>

                  </div>
 
                  <p className="text-center text-xs text-[#94a3b8] mt-6">
                    By submitting you agree to our{' '}
                    <a href="/privacy" className="text-[#f59e0b] hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              )}
            </div>

            {/* ── Right column ──────────────────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Contact details card */}
              <div className="bg-[#001f3f] text-white rounded-2xl p-12 shadow-[0_12px_50px_rgba(0,31,63,0.2)]">
                <h3 className="text-lg font-black mb-7 tracking-tight">Contact Details</h3>

                <div className="space-y-7">
                  {/* Phone */}
                  <a href="tel:+97167404433" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-[#f59e0b] shrink-0 group-hover:bg-[#f59e0b] group-hover:text-[#001f3f] transition-all duration-200">
                      <Phone size={19} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                        Call Our Team
                      </p>
                      <p className="font-bold text-base group-hover:text-[#f59e0b] transition-colors">
                        +971 6 740 4433
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:sales@vikamusk.com" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-[#f59e0b] shrink-0 group-hover:bg-[#f59e0b] group-hover:text-[#001f3f] transition-all duration-200">
                      <Mail size={19} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                        Email Us
                      </p>
                      <p className="font-bold text-base group-hover:text-[#f59e0b] transition-colors">
                        sales@vikamusk.com
                      </p>
                    </div>
                  </a>

                  {/* Hours */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-[#f59e0b] shrink-0">
                      <Clock size={19} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                        Business Hours
                      </p>
                      <p className="font-semibold text-sm">Sun – Thu: 09:00 – 18:00 GST</p>
                    </div>
                  </div>
                </div>

                {/* HQ address */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#f59e0b] text-[#001f3f] flex items-center justify-center shrink-0 shadow-md shadow-[#f59e0b]/25">
                      <Building2 size={19} />
                    </div>
                    <div>
                      <p className="font-black text-sm mb-1.5">UAE Headquarters</p>
                      <p className="text-white/50 text-xs leading-relaxed mb-3">
                        PO Box 932, Ajman Free Zone,<br />
                        Sheikh Rashid Bin Saeed Al Maktoum St,<br />
                        Ajman, UAE
                      </p>
                      <a
                        href="https://maps.app.goo.gl/YourMapLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#f59e0b] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Navigate to HQ <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promise mini-cards */}
              {[
                {
                  Icon: Zap,
                  title: '24-Hour Response',
                  desc: 'Every enquiry acknowledged within one business day — guaranteed.',
                },
                {
                  Icon: Globe,
                  title: 'Global Network',
                  desc: 'Operations across UAE, India, and partner regions worldwide.',
                },
              ].map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,31,63,0.05)] hover:shadow-[0_6px_24px_rgba(0,31,63,0.09)] transition-shadow duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#001f3f] text-[#f59e0b] flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-black text-[#001f3f] text-sm mb-0.5">{title}</p>
                    <p className="text-[#64748b] text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
