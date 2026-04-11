'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderTree, Package, LayoutGrid, Briefcase,
  Mail, LogOut, Globe, Shield, ExternalLink,
  Phone, Calendar, ChevronDown, ChevronUp, Loader2, Inbox,
  Search, X, Trash2, AlertTriangle, MessageSquare,
} from 'lucide-react';

/* ─── Types ─── */
interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
  created_at: string;
}

/* ─── Sidebar nav ─── */
const NAV_LINKS = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: LayoutDashboard },
  { label: 'Products',   href: '/admin/products',   icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Models',     href: '/admin/models',     icon: LayoutGrid },
  { label: 'Careers',    href: '/admin/careers',    icon: Briefcase },
  { label: 'Enquiries',  href: '/admin/enquiries',  icon: Mail },
];

/* ─── Sidebar ─── */
function Sidebar({ pathname, enquiryCount }: { pathname: string; enquiryCount: number }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0, background: '#ffffff',
      borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', lineHeight: 1.2 }}>Vikamusk</p>
            <p style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.2 }}>Admin Panel</p>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', padding: '0 10px', marginBottom: 4 }}>Menu</p>
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10,
              fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? '#92400e' : '#6b7280',
              background: isActive ? '#fffbeb' : 'transparent', textDecoration: 'none',
              transition: 'all 0.15s', position: 'relative',
            }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#111827'; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; } }}
            >
              {isActive && <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: '0 3px 3px 0', background: '#f59e0b' }} />}
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {label === 'Enquiries' && enquiryCount > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: '#fef2f2', color: '#ef4444' }}>
                  {enquiryCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#6b7280', textDecoration: 'none', transition: 'all 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#111827'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
        >
          <Globe size={16} /><span style={{ flex: 1 }}>View Site</span>
          <ExternalLink size={12} style={{ opacity: 0.4 }} />
        </Link>
      </div>
    </aside>
  );
}

/* ─── Delete Confirm Modal ─── */
function DeleteModal({ name, onCancel, onConfirm, loading }: {
  name: string; onCancel: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.18)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={22} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Delete enquiry?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                The enquiry from <strong>{name}</strong> will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: 24 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#ef4444', border: 'none', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Avatar initials colour ─── */
const AVATAR_COLOURS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4'];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLOURS[Math.abs(h) % AVATAR_COLOURS.length];
}

/* ═══════════════════════════════ Main Page ═══════════════════════════════ */
export default function AdminEnquiries() {
  const router   = useRouter();
  const pathname = usePathname();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [token,     setToken]     = useState('');
  const [search,    setSearch]    = useState('');
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('admin_token') || '';
    setToken(t);
    if (!t) { router.push('/admin/login'); return; }

    fetch('/api/admin/enquiries', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null; } return r.json(); })
      .then(data => { if (data) setEnquiries(data.enquiries || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const executeDelete = async () => {
    if (!deleteConfirm || !token) return;
    setDeleting(deleteConfirm.id);
    try {
      await fetch(`/api/admin/enquiries/${deleteConfirm.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setEnquiries(prev => prev.filter(e => e.id !== deleteConfirm.id));
      if (expanded === deleteConfirm.id) setExpanded(null);
    } catch {} finally { setDeleting(null); setDeleteConfirm(null); }
  };

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return iso; }
  };

  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return iso; }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return enquiries;
    const q = search.toLowerCase();
    return enquiries.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.product || '').toLowerCase().includes(q) ||
      (e.message || '').toLowerCase().includes(q)
    );
  }, [enquiries, search]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
        <Sidebar pathname={pathname || ''} enquiryCount={0} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
        </div>
      </div>
    );
  }

  /* ════════════════════════ Render ════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      <Sidebar pathname={pathname || ''} enquiryCount={enquiries.length} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Enquiries</h1>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
              {enquiries.length} enquir{enquiries.length === 1 ? 'y' : 'ies'} received
            </p>
          </div>
          {/* Stats pill */}
          {enquiries.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '5px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Mail size={12} /> {enquiries.length} total
              </div>
            </div>
          )}
        </header>

        <main style={{ flex: 1, padding: '24px 32px 40px' }}>

          {/* ── Search ── */}
          {enquiries.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ position: 'relative', maxWidth: 380 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                <input
                  type="text" placeholder="Search by name, email, product…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: 36, paddingRight: search ? 36 : 14, paddingTop: 9, paddingBottom: 9, borderRadius: 10, fontSize: 13, background: '#fff', border: '1px solid #e5e7eb', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.12)'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2, display: 'flex' }}>
                    <X size={13} />
                  </button>
                )}
              </div>
              {search && (
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
                </p>
              )}
            </div>
          )}

          {/* ── Empty state ── */}
          {enquiries.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Inbox size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>No enquiries yet</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Enquiries submitted through your website will appear here.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', margin: '0 0 8px' }}>No results for "{search}"</p>
              <button onClick={() => setSearch('')} style={{ fontSize: 13, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear search</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((enq) => {
                const isOpen  = expanded === enq.id;
                const color   = avatarColor(enq.name);
                const initial = enq.name.charAt(0).toUpperCase();

                return (
                  <div
                    key={enq.id}
                    style={{
                      background: '#fff', borderRadius: 16, overflow: 'hidden',
                      border: `1px solid ${isOpen ? '#fde68a' : '#e5e7eb'}`,
                      boxShadow: isOpen ? '0 4px 16px rgba(245,158,11,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* ── Collapsed row ── */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 14, cursor: 'pointer' }}
                      onClick={() => setExpanded(isOpen ? null : enq.id)}
                    >
                      {/* Avatar */}
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color, fontWeight: 800, fontSize: 15, border: `1.5px solid ${color}30` }}>
                        {initial}
                      </div>

                      {/* Name + meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{enq.name}</span>
                          {enq.product && (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                              {enq.product}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Mail size={11} style={{ color: '#9ca3af' }} /> {enq.email}
                          </span>
                          {enq.phone && (
                            <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Phone size={11} style={{ color: '#9ca3af' }} /> {enq.phone}
                            </span>
                          )}
                          <span style={{ fontSize: 11, color: '#d1d5db', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                            <Calendar size={11} /> {fmtDate(enq.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Chevron + delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setDeleteConfirm({ id: enq.id, name: enq.name })}
                          disabled={deleting === enq.id}
                          title="Delete enquiry"
                          style={{ padding: 7, borderRadius: 8, border: 'none', background: '#f9fafb', color: '#d1d5db', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deleting === enq.id ? 0.5 : 1 }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#d1d5db'; }}
                        >
                          {deleting === enq.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                        <button
                          onClick={() => setExpanded(isOpen ? null : enq.id)}
                          style={{ padding: 7, borderRadius: 8, border: 'none', background: isOpen ? '#fffbeb' : '#f9fafb', color: isOpen ? '#f59e0b' : '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* ── Expanded panel ── */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>

                        {/* Detail chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '16px 18px 12px' }}>
                          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px' }}>
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', margin: '0 0 3px' }}>Email</p>
                            <a href={`mailto:${enq.email}`} style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Mail size={12} /> {enq.email}
                            </a>
                          </div>
                          {enq.phone && (
                            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px' }}>
                              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', margin: '0 0 3px' }}>Phone</p>
                              <a href={`tel:${enq.phone}`} style={{ fontSize: 13, fontWeight: 600, color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Phone size={12} style={{ color: '#f59e0b' }} /> {enq.phone}
                              </a>
                            </div>
                          )}
                          {enq.product && (
                            <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 14px' }}>
                              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', margin: '0 0 3px' }}>Product Interest</p>
                              <p style={{ fontSize: 13, fontWeight: 600, color: '#d97706', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Package size={12} /> {enq.product}
                              </p>
                            </div>
                          )}
                          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px' }}>
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', margin: '0 0 3px' }}>Received</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Calendar size={12} style={{ color: '#9ca3af' }} /> {fmt(enq.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Message */}
                        <div style={{ margin: '0 18px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px' }}>
                          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <MessageSquare size={11} /> Message
                          </p>
                          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {enq.message || <span style={{ color: '#d1d5db', fontStyle: 'italic' }}>No message provided.</span>}
                          </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 10, padding: '0 18px 16px' }}>
                          <a
                            href={`mailto:${enq.email}?subject=Re: Your Enquiry${enq.product ? ` – ${enq.product}` : ''}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 10px rgba(245,158,11,0.25)', transition: 'background 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#d97706'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
                          >
                            <Mail size={14} /> Reply via Email
                          </a>
                          {enq.phone && (
                            <a
                              href={`tel:${enq.phone}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13, borderRadius: 10, textDecoration: 'none', border: '1px solid #e5e7eb', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                            >
                              <Phone size={14} style={{ color: '#f59e0b' }} /> Call
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ── Delete confirm ── */}
      {deleteConfirm && (
        <DeleteModal
          name={deleteConfirm.name}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={executeDelete}
          loading={!!deleting}
        />
      )}
    </div>
  );
}
