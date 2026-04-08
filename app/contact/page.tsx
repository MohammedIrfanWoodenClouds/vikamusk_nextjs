'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, MapPin, Send, Building2, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
      setErrorMsg('Network error. Please try again or email us directly at sales@vikamusk.com');
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pb-28 bg-primary overflow-hidden" style={{ paddingTop: '160px' }}>
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center">
            <span className="text-sm font-bold text-accent uppercase tracking-wider block mb-4">Get In Touch</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
              Contact Us
            </h1>
            <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-2xl" style={{ marginBottom: '3rem' }}>
              Have questions about our equipment? Reach out and our team will get back to you promptly.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
            <StaggerItem>
              <div className="p-6 lg:p-8 bg-white rounded-2xl border border-gray-200 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Building2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">Vikamusk Construction Equipment</h3>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-4">UAE HEAD OFFICE</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-muted flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted">PO Box 932, Ajman Free Zone, Sheikh Rashid Bin Saeed Al Maktoum St, Ajman, UAE</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-muted flex-shrink-0" />
                    <a href="mailto:sales@vikamusk.com" className="text-sm text-accent hover:underline">sales@vikamusk.com</a>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-6 lg:p-8 bg-white rounded-2xl border border-gray-200 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Building2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">Vikamusk International</h3>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-4">INDIA OFFICE</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-muted flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted">PO 682031, Shanmugham Rd, Marine Drive, Kochi, Ernakulam, Kerala, India</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-muted flex-shrink-0" />
                    <a href="mailto:info@vikamusk.com" className="text-sm text-accent hover:underline">info@vikamusk.com</a>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-10 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Submit Your Enquiry</h2>
                <p className="text-gray-500 text-sm mb-8">We&apos;d love to hear from you. Fill in the form below.</p>

                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-muted mb-6">Your enquiry has been submitted. We&apos;ll get back to you shortly.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-outline text-sm"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status === 'error' && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all"
                          placeholder="+971 XXX XXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Interest Area
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all appearance-none"
                      >
                        <option>Construction Equipment</option>
                        <option>Forklifts & Reach Trucks</option>
                        <option>Aerial Work Platforms</option>
                        <option>Service & Maintenance</option>
                        <option>Spare Parts</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value.slice(0, 500) })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all resize-none"
                        placeholder="Tell us about your requirements..."
                      />
                      <p className="text-xs text-muted mt-1 text-right">{formData.message.length}/500</p>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          Submit Enquiry <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Map + Info */}
            <AnimatedSection direction="right">
              <div className="rounded-2xl overflow-hidden border border-border/50 h-72 lg:h-96 mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.1!2d55.4529249!3d25.419355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5700095feacd%3A0xd5d4c8ef24f9568e!2sVikamusk%20Construction%20Equipment%20FZE!5e0!3m2!1sen!2sae!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vikamusk Location"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted uppercase tracking-wider">Sales Email</p>
                    <a href="mailto:sales@vikamusk.com" className="text-sm font-semibold text-primary hover:text-accent transition-colors truncate block">
                      sales@vikamusk.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted uppercase tracking-wider">Business Hours</p>
                    <p className="text-sm font-semibold text-primary">Sun – Thu: 9AM – 6PM (GST)</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
