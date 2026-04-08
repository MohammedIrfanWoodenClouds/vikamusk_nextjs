'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, MapPin, Send, Building2, Clock, CheckCircle2, AlertCircle, Loader2, Phone, Globe, ArrowUpRight, ChevronDown } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
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
        setFormData({ firstName: '', email: '', phone: '', subject: 'Construction Equipment', message: '' });
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
    <div className="bg-surface italic-none">
      {/* Hero Section */}
      <section className="relative pb-32 bg-[#001f3f] overflow-hidden" style={{ paddingTop: '200px' }}>
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001f3f]/50 to-surface" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <AnimatedSection direction="left">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[12px] mb-6 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-accent/30" />
                Get in Touch
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tighter">
                Global Edge. <br />
                <span className="text-accent">Direct Support.</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl font-medium border-l-2 border-accent/40 pl-8">
                Connect with our global network of equipment specialists. From machinery acquisition 
                to long-term maintenance, we&apos;re your dedicated industrial partner.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Main Interaction Section */}
      <section className="relative z-20 pb-32 -mt-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row bg-white rounded-2xl overflow-hidden shadow-2xl border border-border/10">
            
            {/* Left: Enquiry Form (7 Columns Equivalent) */}
            <div className="w-full lg:w-[60%] p-8 md:p-12 lg:p-16 xl:p-20">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-primary mb-3">Send us a message</h2>
                <p className="text-muted/70 text-base mb-12">Submit your enquiry below and a specialist will contact you within 24 hours.</p>

                {status === 'success' ? (
                  <div className="text-center py-20 bg-emerald-50/50 rounded-2xl border border-emerald-500/10">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-primary mb-2">Message Sent</h3>
                    <p className="text-muted/60 mb-8 max-w-xs mx-auto">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="btn-primary px-10">New Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {status === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold flex items-center gap-3 animate-shake">
                        <AlertCircle size={20} /> {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-bold text-primary/80 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text" required value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl border-2 border-surface bg-surface text-primary font-bold placeholder:text-muted/30 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-bold text-primary/80 uppercase tracking-widest ml-1">Phone Number</label>
                        <input
                          type="tel" required value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl border-2 border-surface bg-surface text-primary font-bold placeholder:text-muted/30 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300"
                          placeholder="+971 XXX XXXX"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-primary/80 uppercase tracking-widest ml-1">Work Email</label>
                      <input
                        type="email" required value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-surface bg-surface text-primary font-bold placeholder:text-muted/30 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300"
                        placeholder="email@company.com"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-primary/80 uppercase tracking-widest ml-1">Inquiry Type</label>
                      <div className="relative group">
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl border-2 border-surface bg-surface text-primary font-bold focus:outline-none focus:border-accent focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option>Construction Equipment</option>
                          <option>Material Handling / Forklifts</option>
                          <option>Access Equipment / AWP</option>
                          <option>Maintenance & Spare Parts</option>
                          <option>Rental Services</option>
                          <option>General Enquiry</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40 group-focus-within:text-accent transition-colors">
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-primary/80 uppercase tracking-widest ml-1">Message</label>
                      <textarea
                        required value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-6 py-4 rounded-xl border-2 border-surface bg-surface text-primary font-bold placeholder:text-muted/30 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300 resize-none"
                        placeholder="Please describe your requirements..."
                      />
                    </div>

                    <button
                      type="submit" disabled={status === 'loading'}
                      className="group w-full py-5 rounded-xl bg-[#001f3f] text-white font-black uppercase tracking-widest text-sm hover:bg-accent hover:text-primary transition-all duration-500 shadow-xl shadow-primary/10 flex items-center justify-center gap-4 border-2 border-transparent hover:border-primary/5"
                    >
                      {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <>Send Message <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Contact Info (5 Columns Equivalent) */}
            <div className="w-full lg:w-[40%] bg-primary/95 text-white p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-between">
              <div className="relative z-10 w-full">
                <h3 className="text-2xl font-black mb-12 flex items-center gap-4">
                  Connect Now
                  <div className="flex-1 h-[1px] bg-white/10" />
                </h3>

                <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Call Our Team</p>
                      <p className="text-xl font-black tracking-tight">+971 6 740 4433</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Email Support</p>
                      <p className="text-xl font-black tracking-tight">sales@vikamusk.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Business Hours</p>
                      <p className="text-lg font-bold">Sun – Thu: 09:00 – 18:00 GST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-12 border-t border-white/10 w-full">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black mb-2 italic">UAE Headquarters</h4>
                    <p className="text-white/50 text-sm font-medium leading-relaxed mb-4">
                      PO Box 932, Ajman Free Zone, Sheikh Rashid Bin Saeed Al Maktoum St, Ajman, UAE
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/YourMapLink" target="_blank"
                      className="inline-flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
                    >
                      NAVIGATE TO HQ <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence & Map Section */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center mb-20 animate-fade-up">
            <span className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Visit Us</span>
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">Our Global Presence</h2>
            <div className="w-16 h-1.5 bg-accent rounded-full" />
          </div>

          <div className="relative group rounded-2xl overflow-hidden border-8 border-white shadow-2xl h-[550px]">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.1!2d55.4529249!3d25.419355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5700095feacd%3A0xd5d4c8ef24f9568e!2sVikamusk%20Construction%20Equipment%20FZE!5e0!3m2!1sen!2sae!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vikamusk Location"
                className="grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
              />
              
              {/* Map Attribution Hint */}
              <div className="absolute inset-0 bg-primary/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
              
              <div className="absolute bottom-10 left-6 right-6 lg:left-12 lg:right-auto lg:w-[400px]">
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl flex items-center justify-between group-hover:translate-y-[-10px] transition-transform duration-500">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] mb-2">Office Location</p>
                    <p className="text-sm font-bold text-primary leading-tight mb-1">Ajman Free Zone</p>
                    <p className="text-xs font-medium text-muted/80">United Arab Emirates</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-[#001f3f] text-white flex items-center justify-center hover:bg-accent hover:text-primary transition-all cursor-pointer shadow-xl">
                    <MapPin size={24} />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Spacing for Footer */}
      <div className="h-24" />
    </div>
  );
}
