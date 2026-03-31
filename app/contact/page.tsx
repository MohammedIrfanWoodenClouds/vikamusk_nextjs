'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, MapPin, Phone, Send, Building2, Clock } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    subject: 'Construction Equipment',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Get In Touch</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6">
              Contact Us
            </h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
              Here&apos;s how you can contact us for any questions or concerns about our equipment.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            <StaggerItem>
              <div className="p-8 bg-white rounded-2xl border border-border/50 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
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
              <div className="p-8 bg-white rounded-2xl border border-border/50 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl border border-border/50 p-8 lg:p-10">
                <h2 className="text-2xl font-black text-primary mb-2">Submit Your Enquiry</h2>
                <p className="text-muted text-sm mb-8">Vikamusk would love to hear your thoughts.</p>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                      <Send size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">Thank You!</h3>
                    <p className="text-muted">Your enquiry has been submitted. We&apos;ll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-primary mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-primary mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                          placeholder="+971 XXX XXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">
                        Interest Area
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                      >
                        <option>Construction Equipment</option>
                        <option>Forklifts & Reach Trucks</option>
                        <option>Aerial Work Platforms</option>
                        <option>Service & Maintenance</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value.slice(0, 500) })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none"
                        placeholder="Tell us about your requirements..."
                      />
                      <p className="text-xs text-muted mt-1">{formData.message.length} / 500</p>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4">
                      Submit Enquiry <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Map + Info */}
            <AnimatedSection direction="right">
              <div className="rounded-2xl overflow-hidden border border-border/50 h-80 lg:h-96 mb-8">
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

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">Sales Email</p>
                    <a href="mailto:sales@vikamusk.com" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                      sales@vikamusk.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">Business Hours</p>
                    <p className="text-sm font-semibold text-primary">Sunday – Thursday: 9AM – 6PM</p>
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
