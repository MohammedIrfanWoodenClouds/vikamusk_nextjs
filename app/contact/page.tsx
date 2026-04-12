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
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
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
                Connect with our specialists. From equipment
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
      <section className="bg-[#f8fafc] py-24 relative overflow-hidden">
        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,31,63,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="container-custom relative z-10">
          {/* Two-column grid: form left, details card right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 xl:gap-20 items-start">

            {/* ── Left: Form ──────────────────────────────────────────── */}
            <div>
              <AnimatedSection direction="up">
                <div className="mb-12">
                  <span className="inline-flex items-center gap-2 text-[#f59e0b] font-bold uppercase tracking-[0.35em] text-[11px] mb-4">
                    <span className="block w-6 h-px bg-[#f59e0b]/50" />
                    Contact Form
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] mb-4">Get in Touch</h2>
                  <p className="text-slate-500 text-base leading-relaxed max-w-lg">
                    Fill in the form and our specialists will respond within 24 hours.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="up" delay={0.1}>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
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
                        className="w-full h-14 bg-white border-2 border-slate-100 rounded-xl px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none shadow-sm"
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
                        className="w-full h-14 bg-white border-2 border-slate-100 rounded-xl px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none shadow-sm"
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
                        className="w-full h-14 bg-white border-2 border-slate-100 rounded-xl px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none shadow-sm"
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
                        className="w-full h-14 bg-white border-2 border-slate-100 rounded-xl px-6 text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none shadow-sm"
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
                      className="w-full p-6 bg-white border-2 border-slate-100 rounded-xl text-[#001f3f] font-medium placeholder:text-slate-300 focus:border-[#fabc22] focus:ring-0 transition-all outline-none resize-none shadow-sm"
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
                      w-full h-16 rounded-xl font-black uppercase tracking-[0.25em] text-sm transition-all duration-300
                      flex items-center justify-center gap-3
                      ${status === 'loading'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#fabc22] text-white hover:bg-[#001f3f] hover:text-white shadow-lg hover:shadow-2xl hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </AnimatedSection>
            </div>

            {/* ── Right: Contact Details Card ─────────────────────────── */}
            <AnimatedSection direction="up" delay={0.2}>
              <div className="sticky top-24">
                {/* Card */}
                <div
                  className="group relative rounded-[20px] overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
                  style={{
                    background: 'linear-gradient(145deg, #0B2C4A 0%, #0D3459 55%, #0E3A5D 100%)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 0 0 1px rgba(30,74,107,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                    padding: '48px',
                  }}
                >
                  {/* Dot grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.045] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Amber glow accent */}
                  <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#F5B400]/[0.12] blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-125 group-hover:opacity-70" />

                  {/* Bottom-left secondary glow */}
                  <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-[#0a7abf]/[0.08] blur-2xl pointer-events-none" />

                  {/* Card content */}
                  <div className="relative">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between mb-16">
                      <h3 className="text-[19px] font-semibold text-white tracking-tight">Contact Details</h3>
                      {/* Live status badge */}
                      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.6px]">Available</span>
                      </div>
                    </div>

                    {/* ── Contact Rows ── */}
                    <div className="flex flex-col">

                      {/* Hidden Temporarily: Call Our Team */}
                      {/* 
                      <div className="flex items-start gap-4 group/row">
                        <div className="w-10 h-10 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/row:bg-[#F5B400]/20 group-hover/row:border-[#F5B400]/40">
                          <Phone size={16} className="text-[#F5B400]" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#AFC3D4] uppercase tracking-[0.1em] mb-2">Call Our Team</p>
                          <a
                            href="tel:+97174044433"
                            className="text-[15px] font-medium text-white hover:text-[#F5B400] transition-colors"
                          >
                            +971 740 4433
                          </a>
                        </div>
                      </div>
                      */}

                      {/* Email */}
                      <div className="flex items-start gap-4 group/row" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                        <div className="w-10 h-10 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/row:bg-[#F5B400]/20 group-hover/row:border-[#F5B400]/40">
                          <Mail size={16} className="text-[#F5B400]" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#AFC3D4] uppercase tracking-[0.1em] mb-2">Email Us</p>
                          <a
                            href="mailto:sales@vikamusk.com"
                            className="text-[15px] font-medium text-white hover:text-[#F5B400] transition-colors break-all"
                          >
                            sales@vikamusk.com
                          </a>
                        </div>
                      </div>

                      {/* Business Hours */}
                      <div className="flex items-start gap-4 group/row" style={{ marginBottom: '1rem' }}>
                        <div className="w-10 h-10 rounded-xl bg-[#F5B400]/10 border border-[#F5B400]/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/row:bg-[#F5B400]/20 group-hover/row:border-[#F5B400]/40">
                          <Clock size={16} className="text-[#F5B400]" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#AFC3D4] uppercase tracking-[0.1em] mb-2">Business Hours</p>
                          <p className="text-[15px] font-medium text-white">Sun – Thu: 09:00 – 18:00</p>
                          <p className="text-[12px] text-[#AFC3D4] mt-0.5">Gulf Standard Time (GST)</p>
                        </div>
                      </div>

                    </div>

                    <div 
                      className="border-t border-[#1E4A6B]/80" 
                      style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} 
                    />

                    {/* ── Address ── */}
                    <div className="flex items-start gap-4 group/row">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/row:bg-white/10 group-hover/row:border-white/20">
                        <Building2 size={16} className="text-white/70" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-[#AFC3D4] uppercase tracking-[0.1em] mb-2.5">UAE Headquarters</p>
                        <p className="text-[14px] font-medium text-white/85 leading-[1.75]">
                          Vikamusk Construction Equipment FZE,<br />
                          Ajman Free Zone, Ajman,<br />
                          United Arab Emirates
                        </p>
                        {/* Navigate CTA */}
                        <a
                          href="https://maps.google.com/?q=Vikamusk+Construction+Equipment+FZE+Ajman+Free+Zone+UAE"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-5 text-[#F5B400] text-[12px] font-bold uppercase tracking-[0.5px] hover:brightness-125 transition-all group/nav"
                        >
                          Navigate to HQ
                          <ArrowUpRight
                            size={14}
                            className="transition-transform duration-200 group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5"
                          />
                        </a>
                      </div>
                    </div>

                    {/* ── Divider ── */}
                    <div className="border-t border-[#1E4A6B]/80 mt-10 mb-10" />

                    {/* Hidden Temporarily: WhatsApp Quick Connect */}
                    {/*
                    <div>
                      <p className="text-[11px] font-bold text-[#AFC3D4] uppercase tracking-[0.1em] mb-5">Quick Connect</p>
                      <a
                        href="https://wa.me/97174044433"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white/[0.04] hover:bg-[#25D366]/[0.08] border border-white/10 hover:border-[#25D366]/30 rounded-xl px-5 py-4 transition-all duration-300 group/wa"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 border border-[#25D366]/25 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/wa:bg-[#25D366]/20">
                          <svg className="w-[18px] h-[18px] text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-white group-hover/wa:text-[#25D366] transition-colors">Chat on WhatsApp</p>
                          <p className="text-[11px] text-[#AFC3D4] mt-0.5">Typically replies instantly</p>
                        </div>
                        <ArrowUpRight
                          size={15}
                          className="text-[#AFC3D4] group-hover/wa:text-[#25D366] transition-all duration-200 group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5 shrink-0"
                        />
                      </a>
                    </div>
                    */}

                    {/* Hidden Temporarily: Privacy trust line */}
                    {/*
                    <p className="text-center text-[11px] text-[#AFC3D4]/60 mt-14 pb-4 tracking-wide">
                      🔒 Your information is always kept private
                    </p>
                    */}

                  </div>
                </div>
              </div>
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

    </div>
  );
}
