'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderTree, Package, LayoutGrid, Briefcase,
  Mail, LogOut, Globe, Shield, ExternalLink,
  Plus, Pencil, Trash2, Loader2, X, Upload, Save,
  Image as ImageIcon, Search, Star, AlertTriangle,
} from 'lucide-react';

/* ─── Types ─── */
interface MainCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  sort_order: number;
  featured?: number;
  product_count?: number;
}

/* ─── Helpers ─── */
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
  title: string; message: string;
  onCancel: () => void; onConfirm: () => void; loading: boolean;
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

/* ═══════════════════════════════ Main Page ═══════════════════════════════ */
export default function AdminCategories() {
  const router   = useRouter();
  const pathname = usePathname();

  const [token,      setToken]      = useState<string | null>(null);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState<MainCategory | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<number | null>(null);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '', sort_order: 0, featured: 0 });

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res  = await fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const openCreateForm = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', image: '', sort_order: categories.length, featured: 0 });
    setShowForm(true); setError('');
  };

  const openEditForm = (cat: MainCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, sort_order: cat.sort_order, featured: cat.featured || 0 });
    setShowForm(true); setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true); setError('');
    try {
      const url    = editing ? `/api/admin/categories/${editing.id}` : '/api/admin/categories';
      const res    = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false); fetchCategories();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const executeDelete = async () => {
    if (!deleteConfirm || !token) return;
    setDeleting(deleteConfirm.id);
    try {
      await fetch(`/api/admin/categories/${deleteConfirm.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch {} finally { setDeleting(null); setDeleteConfirm(null); }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  /* ─── Input style vars ─── */
  const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 13, background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 6 };

  /* ════════════════════════ Render ════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      <Sidebar pathname={pathname || ''} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Categories</h1>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
              {loading ? '...' : `${filtered.length} of ${categories.length} categories`}
            </p>
          </div>
          <button
            onClick={openCreateForm}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#f59e0b', border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.3)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#d97706'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
          >
            <Plus size={16} /> Add Category
          </button>
        </header>

        <main style={{ flex: 1, padding: '24px 32px 40px' }}>

          {/* ── Search bar ── */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', maxWidth: 360, flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 36, paddingRight: search ? 36 : 14 }}
                onFocus={(e)  => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.15)'; }}
                onBlur={(e)   => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
              <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FolderTree size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>No categories yet</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Create your first category to start organising products.</p>
              <button onClick={openCreateForm} style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: '#f59e0b', border: 'none', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Plus size={15} /> Create Category
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>No matches found</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 16px' }}>No categories match "{search}"</p>
              <button onClick={() => setSearch('')} style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer' }}>Clear search</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filtered.map((cat, idx) => {
                const hasImage = cat.image && (cat.image.startsWith('data:') || cat.image.startsWith('/'));
                return (
                  <div
                    key={cat.id}
                    style={{
                      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
                      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    onClick={() => openEditForm(cat)}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e5e7eb', position: 'relative' }}>
                      {hasImage
                        ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <FolderTree size={20} style={{ color: '#9ca3af' }} />
                      }
                      {cat.featured === 1 && (
                        <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', border: '1.5px solid #fff' }} title="Featured" />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>
                          {cat.name}
                        </span>
                        {cat.featured === 1 && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
                            Featured
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>
                        {cat.description || 'No description'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', background: '#f0fdf4', padding: '2px 8px', borderRadius: 999 }}>
                          {cat.product_count || 0} products
                        </span>
                        <span style={{ fontSize: 11, color: '#d1d5db', fontFamily: 'monospace' }}>/{cat.slug}</span>
                        <span style={{ fontSize: 11, color: '#d1d5db' }}>order: {cat.sort_order}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openEditForm(cat)}
                        title="Edit"
                        style={{ padding: 8, borderRadius: 9, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: cat.id, name: cat.name })}
                        disabled={deleting === cat.id}
                        title="Delete"
                        style={{ padding: 8, borderRadius: 9, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deleting === cat.id ? 0.5 : 1 }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {deleting === cat.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteConfirm && (
        <DeleteModal
          title="Delete category?"
          message={`"${deleteConfirm.name}" and all its products will be permanently deleted. This cannot be undone.`}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={executeDelete}
          loading={!!deleting}
        />
      )}

      {/* ── Create / Edit form modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
          <div style={{ borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderTree size={17} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>{editing ? 'Edit Category' : 'New Category'}</h2>
                  {editing && <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{editing.name}</p>}
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

            {/* Form body */}
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label style={labelStyle}>Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))}
                  style={inputStyle}
                  placeholder="e.g. Forklifts & Reach Trucks"
                  required
                  onFocus={(e)  => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.12)'; }}
                  onBlur={(e)   => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Slug */}
              <div>
                <label style={labelStyle}>Slug *</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12 }}
                  placeholder="forklifts-reach-trucks"
                  required
                  onFocus={(e)  => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.12)'; }}
                  onBlur={(e)   => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                  placeholder="Short description of this category"
                  onFocus={(e)  => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.12)'; }}
                  onBlur={(e)   => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Image upload */}
              <div>
                <label style={labelStyle}>Image (optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {form.image && (
                    <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', flexShrink: 0 }}>
                      <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', border: '2px dashed #d1d5db', background: '#fff', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fff'; }}
                  >
                    <Upload size={16} style={{ color: '#9ca3af' }} />
                    <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.image && (
                  <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: 600, marginTop: 4 }}>
                    Remove image
                  </button>
                )}
              </div>

              {/* Sort order + Featured */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                    style={inputStyle}
                    onFocus={(e)  => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.12)'; }}
                    onBlur={(e)   => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Featured</label>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, featured: p.featured ? 0 : 1 }))}
                    style={{ width: '100%', padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s', ...(form.featured ? { background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706' } : { background: '#f9fafb', border: '1px solid #e5e7eb', color: '#6b7280' }) }}
                  >
                    <Star size={15} fill={form.featured ? 'currentColor' : 'none'} />
                    {form.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: '1px solid #f3f4f6', marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#fff', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ flex: 2, padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#f59e0b', border: 'none', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(245,158,11,0.3)', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#d97706'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
