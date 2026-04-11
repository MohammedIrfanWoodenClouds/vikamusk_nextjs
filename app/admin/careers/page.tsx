'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderTree, Package, LayoutGrid, Briefcase,
  Mail, LogOut, Globe, Shield, ExternalLink,
  Plus, Pencil, Trash2, Loader2, X, Save,
  Eye, EyeOff, Search, AlertTriangle, MapPin, Clock, Building2,
} from 'lucide-react';

/* ─── Types ─── */
interface Career {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  benefits: string;
  is_active: number;
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

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

/* ─── Sidebar ─── */
function Sidebar({ pathname }: { pathname: string }) {
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
function DeleteModal({ title, message, onCancel, onConfirm, loading }: {
  title: string; message: string; onCancel: () => void; onConfirm: () => void; loading: boolean;
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
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{message}</p>
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

/* ─── Type badge colours ─── */
const TYPE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  'Full-time':  { bg: '#eff6ff', color: '#3b82f6', border: '#dbeafe' },
  'Part-time':  { bg: '#f5f3ff', color: '#8b5cf6', border: '#ede9fe' },
  'Contract':   { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  'Internship': { bg: '#f0fdf4', color: '#10b981', border: '#d1fae5' },
};

/* ═══════════════════════════════ Main Page ═══════════════════════════════ */
export default function AdminCareers() {
  const router   = useRouter();
  const pathname = usePathname();

  const [token,    setToken]   = useState<string | null>(null);
  const [careers,  setCareers] = useState<Career[]>([]);
  const [loading,  setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing] = useState<Career | null>(null);
  const [saving,   setSaving]  = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error,    setError]   = useState('');
  const [search,   setSearch]  = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

  const [form, setForm] = useState({
    title: '', department: '', location: '', type: 'Full-time',
    description: '', requirements: '', benefits: '', is_active: 1,
  });

  /* ── Auth ── */
  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  /* ── Fetch ── */
  const fetchCareers = useCallback(async () => {
    if (!token) return;
    try {
      const res  = await fetch('/api/admin/careers', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setCareers(data.careers || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  /* ── Form open/close ── */
  const openCreateForm = () => {
    setEditing(null);
    setForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', benefits: '', is_active: 1 });
    setShowForm(true); setError('');
  };

  const openEditForm = (career: Career) => {
    setEditing(career);
    let reqStr = '', benStr = '';
    try { const arr = JSON.parse(career.requirements); reqStr = Array.isArray(arr) ? arr.join('\n') : career.requirements; } catch { reqStr = career.requirements; }
    try { const arr = JSON.parse(career.benefits);     benStr = Array.isArray(arr) ? arr.join('\n') : career.benefits;     } catch { benStr = career.benefits; }
    setForm({ title: career.title, department: career.department, location: career.location, type: career.type, description: career.description, requirements: reqStr, benefits: benStr, is_active: career.is_active });
    setShowForm(true); setError('');
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true); setError('');
    const payload = {
      ...form,
      requirements: JSON.stringify(form.requirements.split('\n').filter(s => s.trim())),
      benefits:     JSON.stringify(form.benefits.split('\n').filter(s => s.trim())),
    };
    try {
      const url = editing ? `/api/admin/careers/${editing.id}` : '/api/admin/careers';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false); fetchCareers();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  /* ── Delete ── */
  const executeDelete = async () => {
    if (!deleteConfirm || !token) return;
    setDeleting(deleteConfirm.id);
    try {
      await fetch(`/api/admin/careers/${deleteConfirm.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchCareers();
    } catch {} finally { setDeleting(null); setDeleteConfirm(null); }
  };

  /* ── Toggle active ── */
  const toggleActive = async (career: Career) => {
    if (!token) return;
    await fetch(`/api/admin/careers/${career.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ is_active: career.is_active ? 0 : 1 }) });
    fetchCareers();
  };

  /* ── Filtered ── */
  const filtered = useMemo(() => {
    let result = careers;
    if (filterStatus === 'active')   result = result.filter(c => c.is_active === 1);
    if (filterStatus === 'inactive') result = result.filter(c => c.is_active === 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.department || '').toLowerCase().includes(q) ||
        (c.location || '').toLowerCase().includes(q) ||
        (c.type || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [careers, filterStatus, search]);

  const activeCount   = careers.filter(c => c.is_active === 1).length;
  const inactiveCount = careers.filter(c => c.is_active === 0).length;

  /* ─── Shared input style ─── */
  const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 13, background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 6 };
  const focusAmber = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.12)'; };
  const blurReset  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; };

  /* ════════════════════════ Render ════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      <Sidebar pathname={pathname || ''} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Career Postings</h1>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
              {loading ? '...' : `${activeCount} active · ${inactiveCount} inactive`}
            </p>
          </div>
          <button
            onClick={openCreateForm}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#f59e0b', border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.3)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#d97706'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
          >
            <Plus size={16} /> Add Posting
          </button>
        </header>

        <main style={{ flex: 1, padding: '24px 32px 40px' }}>

          {/* ── Search + filter ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200, maxWidth: 360 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              <input
                type="text" placeholder="Search postings..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inp, paddingLeft: 36, paddingRight: search ? 36 : 14 }}
                onFocus={focusAmber} onBlur={blurReset}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status filter pills */}
            {(['all', 'active', 'inactive'] as const).map(status => (
              <button key={status} onClick={() => setFilterStatus(status)}
                style={{ padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', border: '1px solid', ...(filterStatus === status ? { background: '#f59e0b', borderColor: '#f59e0b', color: '#fff' } : { background: '#fff', borderColor: '#e5e7eb', color: '#6b7280' }) }}
              >
                {status === 'all' ? `All (${careers.length})` : status === 'active' ? `Active (${activeCount})` : `Inactive (${inactiveCount})`}
              </button>
            ))}
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
              <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
            </div>
          ) : careers.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Briefcase size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>No career postings yet</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Create your first job posting to start recruiting.</p>
              <button onClick={openCreateForm} style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: '#f59e0b', border: 'none', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Plus size={15} /> Create Posting
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>No matches found</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 16px' }}>Try adjusting your search or filter.</p>
              <button onClick={() => { setSearch(''); setFilterStatus('all'); }} style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer' }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {filtered.map((career) => {
                const typeStyle = TYPE_STYLE[career.type] || TYPE_STYLE['Full-time'];
                return (
                  <div
                    key={career.id}
                    style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'pointer' }}
                    onClick={() => openEditForm(career)}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {/* Icon */}
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: career.is_active ? '#f0fdf4' : '#f9fafb', border: `1px solid ${career.is_active ? '#d1fae5' : '#e5e7eb'}` }}>
                      <Briefcase size={20} style={{ color: career.is_active ? '#10b981' : '#9ca3af' }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>
                          {career.title}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: career.is_active ? '#f0fdf4' : '#fef2f2', color: career.is_active ? '#10b981' : '#ef4444', border: `1px solid ${career.is_active ? '#d1fae5' : '#fecaca'}` }}>
                          {career.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}>
                          {career.type}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 440 }}>
                        {career.description || 'No description'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        {career.department && (
                          <span style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Building2 size={11} /> {career.department}
                          </span>
                        )}
                        {career.location && (
                          <span style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={11} /> {career.location}
                          </span>
                        )}
                        {career.created_at && (
                          <span style={{ fontSize: 11, color: '#d1d5db', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={11} /> {new Date(career.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => toggleActive(career)}
                        title={career.is_active ? 'Set inactive' : 'Set active'}
                        style={{ padding: 8, borderRadius: 9, border: 'none', background: career.is_active ? '#f0fdf4' : '#f9fafb', color: career.is_active ? '#10b981' : '#9ca3af', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {career.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => openEditForm(career)}
                        title="Edit"
                        style={{ padding: 8, borderRadius: 9, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: career.id, name: career.title })}
                        disabled={deleting === career.id}
                        title="Delete"
                        style={{ padding: 8, borderRadius: 9, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deleting === career.id ? 0.5 : 1 }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {deleting === career.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
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
          title="Delete posting?"
          message={`"${deleteConfirm.name}" will be permanently deleted. This action cannot be undone.`}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={executeDelete}
          loading={!!deleting}
        />
      )}

      {/* ── Create / Edit modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
          <div style={{ borderRadius: 20, width: '100%', maxWidth: 640, maxHeight: '92vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={17} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>{editing ? 'Edit Posting' : 'New Job Posting'}</h2>
                  {editing && <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{editing.title}</p>}
                </div>
              </div>
              <button onClick={() => setShowForm(false)}
                style={{ padding: 8, borderRadius: 9, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label style={lbl}>Job Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inp} placeholder="e.g. Sales Engineer" required onFocus={focusAmber} onBlur={blurReset} />
              </div>

              {/* Department + Location + Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Department</label>
                  <input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} style={inp} placeholder="Sales" onFocus={focusAmber} onBlur={blurReset} />
                </div>
                <div>
                  <label style={lbl}>Location</label>
                  <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} style={inp} placeholder="Ajman, UAE" onFocus={focusAmber} onBlur={blurReset} />
                </div>
                <div>
                  <label style={lbl}>Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inp} onFocus={focusAmber} onBlur={blurReset}>
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} placeholder="Describe the role and responsibilities..." onFocus={focusAmber} onBlur={blurReset} />
              </div>

              {/* Requirements */}
              <div>
                <label style={lbl}>Requirements <span style={{ fontSize: 10, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9ca3af' }}>(one per line)</span></label>
                <textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }} placeholder={"3+ years experience\nBachelor's degree\nValid driving license"} onFocus={focusAmber} onBlur={blurReset} />
              </div>

              {/* Benefits */}
              <div>
                <label style={lbl}>Benefits <span style={{ fontSize: 10, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9ca3af' }}>(one per line)</span></label>
                <textarea value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }} placeholder={"Competitive salary\nHealth insurance\nAnnual leave"} onFocus={focusAmber} onBlur={blurReset} />
              </div>

              {/* Status toggle */}
              <div>
                <label style={lbl}>Status</label>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_active: p.is_active ? 0 : 1 }))}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', ...(form.is_active ? { background: '#f0fdf4', border: '1px solid #d1fae5', color: '#059669' } : { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }) }}
                >
                  {form.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  {form.is_active ? 'Active — visible to applicants' : 'Inactive — hidden from public'}
                </button>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: '1px solid #f3f4f6', marginTop: 4 }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#fff', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ flex: 2, padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#f59e0b', border: 'none', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(245,158,11,0.3)', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#d97706'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : editing ? 'Update Posting' : 'Create Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
