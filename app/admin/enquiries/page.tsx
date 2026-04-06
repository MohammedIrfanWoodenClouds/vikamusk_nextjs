'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Package, Calendar, ChevronDown, ChevronUp, ExternalLink, Loader2, Inbox } from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
  created_at: string;
}

export default function AdminEnquiries() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('admin_token') || '';
    setToken(t);
    if (!t) { router.push('/admin/login'); return; }

    fetch('/api/admin/enquiries', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        return r.json();
      })
      .then(data => {
        if (data) setEnquiries(data.enquiries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return iso; }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#001229', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#001229', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
            Enquiries
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            {enquiries.length} enquir{enquiries.length === 1 ? 'y' : 'ies'} received
          </p>
        </div>

        {enquiries.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center',
          }}>
            <Inbox size={48} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>No enquiries yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {enquiries.map((enq) => {
              const isOpen = expanded === enq.id;
              return (
                <div
                  key={enq.id}
                  style={{
                    background: isOpen ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isOpen ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Row header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : enq.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, flex: 1 }}>
                      {/* Avatar */}
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        color: '#f59e0b', fontWeight: 800, fontSize: '0.8rem',
                      }}>
                        {enq.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                          {enq.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Mail size={11} /> {enq.email}
                          </span>
                          {enq.product && (
                            <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Package size={11} /> {enq.product}
                            </span>
                          )}
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={11} /> {fmt(enq.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronUp size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      : <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                    }
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem', marginBottom: '1rem' }}>
                        {enq.phone && (
                          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.75rem' }}>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Phone</p>
                            <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Phone size={12} style={{ color: '#f59e0b' }} /> {enq.phone}
                            </p>
                          </div>
                        )}
                        {enq.product && (
                          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.75rem' }}>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Product Interest</p>
                            <p style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Package size={12} /> {enq.product}
                            </p>
                          </div>
                        )}
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Message</p>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {enq.message}
                        </p>
                      </div>

                      <a
                        href={`mailto:${enq.email}?subject=Re: Your Enquiry${enq.product ? ` – ${enq.product}` : ''}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.5rem 1.25rem', background: '#f59e0b', color: '#001f3f',
                          fontWeight: 700, fontSize: '0.8rem', borderRadius: '8px',
                          textDecoration: 'none', transition: 'background 0.2s',
                        }}
                      >
                        <ExternalLink size={13} /> Reply via Email
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
