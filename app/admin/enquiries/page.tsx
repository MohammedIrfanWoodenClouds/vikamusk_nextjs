'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderTree, Package, LayoutGrid, Briefcase,
  Mail, LogOut, Globe, Shield, ExternalLink,
  Phone, Calendar, ChevronDown, ChevronUp, Loader2, Inbox,
  Search, X, Trash2, AlertTriangle, MessageSquare,
  Building2, MapPin, Tag, CheckCircle2, Circle, Clock, Filter, ChevronRight
} from 'lucide-react';

/* ─── Types ─── */
interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  location?: string;
  subject?: string;
  product?: string;
  message: string;
  is_contacted: boolean;
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
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
  const [filterType, setFilterType] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      const res = await fetch(`/api/admin/enquiries/${deleteConfirm.id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        setEnquiries(prev => prev.filter(e => e.id !== deleteConfirm.id));
        if (expanded === deleteConfirm.id) setExpanded(null);
      }
    } catch {} finally { setDeleting(null); setDeleteConfirm(null); }
  };

  const toggleContacted = async (enq: Enquiry) => {
    if (!token) return;
    const newStatus = !enq.is_contacted;
    setUpdatingId(enq.id);
    try {
      const res = await fetch(`/api/admin/enquiries/${enq.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ is_contacted: newStatus })
      });
      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === enq.id ? { ...e, is_contacted: newStatus } : e));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
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
    let result = enquiries;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.company_name || '').toLowerCase().includes(q) ||
        (e.subject || '').toLowerCase().includes(q) ||
        (e.message || '').toLowerCase().includes(q)
      );
    }

    // Date filter
    const now = new Date();
    if (filterType === 'today') {
      result = result.filter(e => {
        const d = new Date(e.created_at);
        return d.toDateString() === now.toDateString();
      });
    } else if (filterType === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      result = result.filter(e => new Date(e.created_at) >= weekAgo);
    } else if (filterType === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      result = result.filter(e => new Date(e.created_at) >= monthAgo);
    } else if (filterType === 'custom' && dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);
      result = result.filter(e => {
        const d = new Date(e.created_at);
        return d >= start && d <= end;
      });
    }

    return result;
  }, [enquiries, search, filterType, dateRange]);

  const stats = useMemo(() => {
    const total = enquiries.length;
    const contacted = enquiries.filter(e => e.is_contacted).length;
    const pending = total - contacted;
    return { total, contacted, pending };
  }, [enquiries]);

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
      <Sidebar pathname={pathname || ''} enquiryCount={stats.pending} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Enquiries</h1>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
              Lead Management & Customer Queries
            </p>
          </div>
          {/* Stats pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '6px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} /> {stats.pending} Pending
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} /> {stats.contacted} Contacted
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px 32px 40px' }}>

          {/* ── Filters & Search ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 300 }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    <input
                    type="text" placeholder="Search name, company, subject, email..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', paddingLeft: 38, paddingRight: search ? 36 : 14, paddingTop: 10, paddingBottom: 10, borderRadius: 12, fontSize: 13, background: '#fff', border: '1px solid #e5e7eb', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.08)'; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    {search && (
                    <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2, display: 'flex' }}>
                        <X size={14} />
                    </button>
                    )}
                </div>

                <div style={{ display: 'flex', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 3, gap: 2 }}>
                    {(['all', 'today', 'week', 'month', 'custom'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            style={{
                                padding: '6px 14px', borderRadius: 9, fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                background: filterType === t ? '#111827' : 'transparent',
                                color: filterType === t ? '#fff' : '#6b7280',
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {filterType === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', maxWidth: 'fit-content', alignSelf: 'flex-end' }}>
                    <Calendar size={14} style={{ color: '#9ca3af' }} />
                    <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} style={{ border: 'none', background: 'none', fontSize: 12, color: '#111827', outline: 'none' }} />
                    <span style={{ color: '#9ca3af', fontSize: 12 }}>to</span>
                    <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} style={{ border: 'none', background: 'none', fontSize: 12, color: '#111827', outline: 'none' }} />
                    <button onClick={() => setDateRange({start: '', end: ''})} style={{ background: 'none', border: 'none', color: '#9ca3af', padding: 4, cursor: 'pointer' }}><X size={12}/></button>
                </div>
            )}
          </div>

          {/* ── Empty state ── */}
          {stats.total === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Inbox size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>No enquiries yet</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Submissions from your website will appear here automatically.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', margin: '0 0 8px' }}>No results match your criteria</p>
              <button onClick={() => { setSearch(''); setFilterType('all'); }} style={{ fontSize: 13, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reset all filters</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                      boxShadow: isOpen ? '0 10px 25px -5px rgba(0,0,0,0.04)' : '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* ── Header Row ── */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 16, cursor: 'pointer' }}
                      onClick={() => setExpanded(isOpen ? null : enq.id)}
                    >
                      {/* Avatar */}
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color, fontWeight: 800, fontSize: 16, border: `1.5px solid ${color}20` }}>
                        {initial}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{enq.name}</span>
                          
                          {enq.is_contacted ? (
                            <span style={{ fontSize: 9, fontWeight: 800, color: '#059669', background: '#f0fdf4', padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase', tracking: '0.05em' }}>Contacted</span>
                          ) : (
                            <span style={{ fontSize: 9, fontWeight: 800, color: '#d97706', background: '#fffbeb', padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase', tracking: '0.05em' }}>New Lead</span>
                          )}

                          {enq.subject && (
                             <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1' }} />
                                {enq.subject}
                             </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{enq.email}</span>
                          {enq.company_name && (
                             <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Building2 size={13} style={{ color: '#94a3b8' }} /> {enq.company_name}
                             </span>
                          )}
                          <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                             <Calendar size={13} /> {fmtDate(enq.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                         <button
                           onClick={() => toggleContacted(enq)}
                           disabled={updatingId === enq.id}
                           title={enq.is_contacted ? "Mark as pending" : "Mark as contacted"}
                           style={{
                             width: 32, height: 32, borderRadius: 10, border: '1px solid #e5e7eb',
                             background: enq.is_contacted ? '#f0fdf4' : '#fff',
                             color: enq.is_contacted ? '#059669' : '#d1d5db',
                             cursor: 'pointer', transition: 'all 0.2s',
                             display: 'flex', alignItems: 'center', justifyContent: 'center'
                           }}
                           onMouseEnter={(e) => { 
                             if (!enq.is_contacted) { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669'; }
                           }}
                           onMouseLeave={(e) => { 
                             if (!enq.is_contacted) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#d1d5db'; }
                           }}
                         >
                           {updatingId === enq.id ? <Loader2 size={14} className="animate-spin" /> : enq.is_contacted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                         </button>

                         <button
                           onClick={() => setDeleteConfirm({ id: enq.id, name: enq.name })}
                           title="Delete enquiry"
                           style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: '#f9fafb', color: '#d1d5db', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                           onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#d1d5db'; }}
                         >
                           <Trash2 size={15} />
                         </button>
                         
                         <ChevronRight size={18} style={{ color: '#cbd5e1', transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>

                    {/* ── Details Panel ── */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid #f3f4f6', background: '#fafbfc', padding: '24px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                            <div style={{ background: '#fff', padding: 14, borderRadius: 14, border: '1px solid #e5e7eb' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: 6 }}>Direct Contact</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <a href={`mailto:${enq.email}`} style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Mail size={13} /> {enq.email}
                                    </a>
                                    {enq.phone && (
                                        <a href={`tel:${enq.phone}`} style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Phone size={13} style={{ color: '#d97706' }} /> {enq.phone}
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div style={{ background: '#fff', padding: 14, borderRadius: 14, border: '1px solid #e5e7eb' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: 6 }}>Organization Details</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div style={{ fontSize: 13, color: '#1f2937', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Building2 size={13} style={{ color: '#64748b' }} /> {enq.company_name || 'Individual'}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <MapPin size={13} style={{ color: '#ef4444' }} /> {enq.location || 'Not provided'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#fff', padding: 14, borderRadius: 14, border: '1px solid #e5e7eb' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: 6 }}>Request Metadata</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div style={{ fontSize: 13, color: '#1f2937', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Tag size={13} style={{ color: '#f59e0b' }} /> {enq.subject || enq.product || 'General Enquiry'}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Clock size={12} /> {fmt(enq.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e5e7eb', marginBottom: 24 }}>
                             <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <MessageSquare size={13} /> Customer Message
                             </p>
                             <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                                {enq.message || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No message provided.</span>}
                             </p>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <a
                                href={`mailto:${enq.email}?subject=Re: Your Enquiry – Vikamusk International`}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                                    background: '#111827', color: '#fff', fontWeight: 700, fontSize: 13,
                                    borderRadius: 12, textDecoration: 'none', transition: '0.2s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#111827'; }}
                            >
                                <Mail size={14} /> Send Reply
                            </a>
                            <button
                                onClick={() => toggleContacted(enq)}
                                disabled={updatingId === enq.id}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                                    background: '#fff', color: '#111827', fontWeight: 700, fontSize: 13,
                                    borderRadius: 12, border: '1px solid #e5e7eb', cursor: 'pointer', transition: '0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                            >
                                {updatingId === enq.id ? <Loader2 size={14} className="animate-spin" /> : enq.is_contacted ? <X size={14} /> : <CheckCircle2 size={14} />}
                                {enq.is_contacted ? 'Undo Contacted' : 'Mark as Contacted'}
                            </button>
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

      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
}
