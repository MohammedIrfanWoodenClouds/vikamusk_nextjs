'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderTree, Package, LayoutGrid, Briefcase,
  Mail, LogOut, Globe, Shield, ExternalLink,
  Plus, Pencil, Trash2, Loader2, X, Upload, Save,
  Star, StarOff, Search, ChevronLeft, ChevronRight,
  AlertTriangle,
} from 'lucide-react';

/* ─── Constants ─── */
const ITEMS_PER_PAGE = 15;

/* ─── Types ─── */
interface Product {
  id: string;
  main_category_id: string;
  main_category_name: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  features: string;
  specs: string;
  image: string;
  images: string;
  brochure_url: string;
  featured: number;
  sort_order: number;
}
interface Category { id: string; name: string; }

/* ─── Sidebar nav ─── */
const NAV_LINKS = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: LayoutDashboard },
  { label: 'Products',   href: '/admin/products',   icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Models',     href: '/admin/models',     icon: LayoutGrid },
  { label: 'Careers',    href: '/admin/careers',    icon: Briefcase },
  { label: 'Enquiries',  href: '/admin/enquiries',  icon: Mail },
];

/* ─── Helpers ─── */
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function parseFeatures(str: string): string[] {
  try { const arr = JSON.parse(str); return Array.isArray(arr) ? arr : []; }
  catch { return str.split('\n').filter(s => s.trim()); }
}
function parseSpecs(str: string): Record<string, string> {
  try { const obj = JSON.parse(str); return typeof obj === 'object' && !Array.isArray(obj) ? obj : {}; }
  catch {
    const result: Record<string, string> = {};
    str.split('\n').filter(s => s.includes(':')).forEach(line => {
      const [key, ...vals] = line.split(':');
      if (key.trim()) result[key.trim()] = vals.join(':').trim();
    });
    return result;
  }
}
function getDisplayImage(image: string): string {
  if (!image) return '';
  if (image.startsWith('[')) {
    try { const arr = JSON.parse(image); return arr[0] || ''; } catch {}
  }
  return image;
}

/* ─── Sidebar component ─── */
function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0, background: '#ffffff',
      borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {/* Brand */}
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

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', padding: '0 10px', marginBottom: 4 }}>Menu</p>
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, fontSize: 13,
              fontWeight: isActive ? 600 : 500, color: isActive ? '#92400e' : '#6b7280',
              background: isActive ? '#fffbeb' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s', position: 'relative',
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

      {/* Bottom */}
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
function DeleteModal({
  title, message, onCancel, onConfirm, loading,
}: {
  title: string; message: string;
  onCancel: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}>
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
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer' }}>
            Cancel
          </button>
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
export default function AdminProducts() {
  const router   = useRouter();
  const pathname = usePathname();

  const [token,      setToken]      = useState<string | null>(null);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState<Product | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [error,      setError]      = useState('');

  /* Filters */
  const [filterCat,      setFilterCat]      = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [search,         setSearch]         = useState('');
  const [currentPage,    setCurrentPage]    = useState(1);

  /* Bulk select */
  const [selectedIds,       setSelectedIds]       = useState<Set<string>>(new Set());
  const [bulkDeleting,      setBulkDeleting]       = useState(false);
  const [deleteConfirm,     setDeleteConfirm]     = useState<{ id: string; name: string } | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    main_category_id: '', name: '', slug: '', short_description: '', full_description: '',
    features: '', specs: '', image: '', images: '[]', brochure_url: '', featured: 0, sort_order: 0,
  });

  /* ── Auth ── */
  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch('/api/admin/products',   { headers }),
        fetch('/api/admin/categories', { headers }),
      ]);
      const [prodsData, catsData] = await Promise.all([prodsRes.json(), catsRes.json()]);
      setProducts(prodsData.products   || []);
      setCategories(catsData.categories || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Image handlers ── */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be < 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let current: string[] = [];
    try { current = JSON.parse(form.images); } catch {}
    let loaded = 0;
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        current.push(reader.result as string);
        loaded++;
        if (loaded === files.length) setForm(prev => ({ ...prev, images: JSON.stringify(current) }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (idx: number) => {
    let imgs: string[] = [];
    try { imgs = JSON.parse(form.images); } catch {}
    imgs.splice(idx, 1);
    setForm(prev => ({ ...prev, images: JSON.stringify(imgs) }));
  };

  /* ── Form open/close ── */
  const openCreate = () => {
    setEditing(null);
    setForm({ main_category_id: categories[0]?.id || '', name: '', slug: '', short_description: '', full_description: '', features: '', specs: '', image: '', images: '[]', brochure_url: '', featured: 0, sort_order: 0 });
    setShowForm(true); setError('');
  };

  const openEdit = (prod: Product) => {
    setEditing(prod);
    let featuresStr = '';
    let specsStr = '';
    try { const arr = JSON.parse(prod.features); featuresStr = Array.isArray(arr) ? arr.join('\n') : prod.features || ''; } catch { featuresStr = prod.features || ''; }
    try { const obj = JSON.parse(prod.specs); specsStr = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n'); } catch { specsStr = prod.specs || ''; }

    let mainImg  = '';
    let extraImgs = '[]';
    if (prod.image && prod.image.startsWith('[')) {
      try {
        const arr = JSON.parse(prod.image);
        if (arr.length > 0) { mainImg = arr[0]; extraImgs = JSON.stringify(arr.slice(1)); }
      } catch { mainImg = prod.image; }
    } else { mainImg = prod.image || ''; }

    setForm({ main_category_id: prod.main_category_id, name: prod.name, slug: prod.slug, short_description: prod.short_description || '', full_description: prod.full_description || '', features: featuresStr, specs: specsStr, image: mainImg, images: extraImgs, brochure_url: prod.brochure_url || '', featured: prod.featured, sort_order: prod.sort_order });
    setShowForm(true); setError('');
  };

  /* ── Save ── */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true); setError('');

    let extraImgs: string[] = [];
    try { extraImgs = JSON.parse(form.images); } catch {}
    const allImages = form.image ? [form.image, ...extraImgs] : extraImgs;
    const finalImageToken = allImages.length === 0 ? '' : allImages.length === 1 ? allImages[0] : JSON.stringify(allImages);
    const payload = { ...form, image: finalImageToken, features: JSON.stringify(parseFeatures(form.features)), specs: JSON.stringify(parseSpecs(form.specs)) };
    // @ts-ignore
    delete payload.images;

    try {
      const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products';
      const res  = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false); fetchData();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  /* ── Delete single ── */
  const confirmDelete = (prod: Product) => setDeleteConfirm({ id: prod.id, name: prod.name });

  const executeDelete = async () => {
    if (!deleteConfirm || !token) return;
    setDeleting(deleteConfirm.id);
    try {
      await fetch(`/api/admin/products/${deleteConfirm.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch {} finally { setDeleting(null); setDeleteConfirm(null); }
  };

  /* ── Bulk delete ── */
  const executeBulkDelete = async () => {
    if (!token) return;
    setBulkDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        )
      );
      setSelectedIds(new Set());
      fetchData();
    } catch {} finally { setBulkDeleting(false); setBulkDeleteConfirm(false); }
  };

  /* ── Featured toggle ── */
  const toggleFeatured = async (prod: Product) => {
    if (!token) return;
    await fetch(`/api/admin/products/${prod.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ featured: prod.featured ? 0 : 1 }) });
    fetchData();
  };

  /* ── Selection helpers ── */
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Filtered + paginated ── */
  const filtered = useMemo(() => {
    let result = filterCat === 'all' ? products : products.filter(p => p.main_category_id === filterCat);
    if (filterFeatured === 'featured')     result = result.filter(p => p.featured === 1);
    if (filterFeatured === 'not-featured') result = result.filter(p => p.featured !== 1);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q) ||
        (p.main_category_name || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, filterCat, filterFeatured, search]);

  // Reset to page 1 whenever filters change
  const prevFilterKey = filterCat + filterFeatured + search;
  const [lastFilterKey, setLastFilterKey] = useState(prevFilterKey);
  if (prevFilterKey !== lastFilterKey) { setCurrentPage(1); setLastFilterKey(prevFilterKey); }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const allPageSelected = paginated.length > 0 && paginated.every(p => selectedIds.has(p.id));
  const someSelected    = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds(prev => { const next = new Set(prev); paginated.forEach(p => next.delete(p.id)); return next; });
    } else {
      setSelectedIds(prev => { const next = new Set(prev); paginated.forEach(p => next.add(p.id)); return next; });
    }
  };

  let additionalImages: string[] = [];
  try { additionalImages = JSON.parse(form.images); } catch {}

  /* ─── Form input styles (light modal) ─── */
  const inputCls   = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors";
  const inputStyle: React.CSSProperties = { background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' };
  const labelCls   = "block text-[10px] font-semibold uppercase tracking-wider mb-2";
  const labelStyle: React.CSSProperties = { color: '#6b7280' };

  /* ─── SELECT style helper ─── */
  const filterSelect: React.CSSProperties = {
    padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500,
    background: '#fff', border: '1px solid #e5e7eb', color: '#374151',
    cursor: 'pointer', outline: 'none',
  };

  /* ════════════════════════ Render ════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      <Sidebar pathname={pathname || ''} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Products</h1>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
                {loading ? '...' : `${filtered.length} of ${products.length} products`}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            disabled={categories.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#f59e0b', border: 'none', color: '#fff', cursor: categories.length === 0 ? 'not-allowed' : 'pointer', opacity: categories.length === 0 ? 0.5 : 1, boxShadow: '0 4px 12px rgba(245,158,11,0.3)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { if (categories.length > 0) e.currentTarget.style.background = '#d97706'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
          >
            <Plus size={16} /> Add Product
          </button>
        </header>

        <main style={{ flex: 1, padding: '24px 32px 40px' }}>

          {/* ── Search + Filters bar ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200, maxWidth: 360 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 10, fontSize: 13, background: '#fff', border: '1px solid #e5e7eb', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(245,158,11,0.15)'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2 }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category filter */}
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={filterSelect}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            {/* Featured filter */}
            <select value={filterFeatured} onChange={e => setFilterFeatured(e.target.value)} style={filterSelect}>
              <option value="all">All Products</option>
              <option value="featured">Featured only</option>
              <option value="not-featured">Not featured</option>
            </select>

            {/* Clear filters */}
            {(filterCat !== 'all' || filterFeatured !== 'all' || search) && (
              <button
                onClick={() => { setFilterCat('all'); setFilterFeatured('all'); setSearch(''); }}
                style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer' }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* ── Bulk action bar ── */}
          {someSelected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 12, background: '#fffbeb', border: '1px solid #fde68a', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>
                {selectedIds.size} product{selectedIds.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setBulkDeleteConfirm(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <Trash2 size={13} /> Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid #d1d5db', color: '#6b7280', cursor: 'pointer' }}
              >
                Deselect all
              </button>
            </div>
          )}

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
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>Create categories first</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>You need at least one category before adding products.</p>
              <Link href="/admin/categories" style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: '#f59e0b', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>
                Go to Categories
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Package size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
                {search || filterCat !== 'all' || filterFeatured !== 'all' ? 'No products match your filters' : 'No products yet'}
              </p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
                {search || filterCat !== 'all' || filterFeatured !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first product to get started.'}
              </p>
              {!(search || filterCat !== 'all' || filterFeatured !== 'all') && (
                <button onClick={openCreate} style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: '#f59e0b', border: 'none', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={15} /> Add Product
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ── Table ── */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '40px 64px 1fr 160px 90px 110px', gap: 0, padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#f59e0b' }}
                    />
                  </div>
                  <div />
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Product</div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af' }}>Category</div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', textAlign: 'center' }}>Featured</div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', textAlign: 'right' }}>Actions</div>
                </div>

                {/* Rows */}
                {paginated.map((prod, idx) => {
                  const isSelected = selectedIds.has(prod.id);
                  const dispImg    = getDisplayImage(prod.image);
                  return (
                    <div
                      key={prod.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 64px 1fr 160px 90px 110px',
                        gap: 0,
                        padding: '12px 16px',
                        borderBottom: idx < paginated.length - 1 ? '1px solid #f3f4f6' : 'none',
                        alignItems: 'center',
                        background: isSelected ? '#fffbeb' : idx % 2 === 0 ? '#fff' : '#fafafa',
                        transition: 'background 0.1s',
                        cursor: 'pointer',
                      }}
                      onClick={() => openEdit(prod)}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f0f9ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? '#fffbeb' : idx % 2 === 0 ? '#fff' : '#fafafa'; }}
                    >
                      {/* Checkbox */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { e.stopPropagation(); toggleSelect(prod.id); }}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(prod.id)} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#f59e0b' }} />
                      </div>

                      {/* Thumbnail */}
                      <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {dispImg
                          ? <img src={dispImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                          : <Package size={18} style={{ color: '#d1d5db' }} />
                        }
                      </div>

                      {/* Name + desc */}
                      <div style={{ paddingLeft: 12, paddingRight: 12, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 340 }}>
                            {prod.name}
                          </p>
                          {prod.featured === 1 && (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', whiteSpace: 'nowrap' }}>
                              Featured
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 360 }}>
                          {prod.short_description || 'No description'}
                        </p>
                      </div>

                      {/* Category */}
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#3b82f6', background: '#eff6ff', padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 150 }}>
                          {prod.main_category_name || '—'}
                        </span>
                      </div>

                      {/* Featured toggle */}
                      <div style={{ textAlign: 'center' }} onClick={e => { e.stopPropagation(); toggleFeatured(prod); }}>
                        <button
                          style={{ padding: '6px', borderRadius: 8, border: 'none', background: prod.featured ? '#fffbeb' : '#f3f4f6', color: prod.featured ? '#f59e0b' : '#d1d5db', cursor: 'pointer', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          title={prod.featured ? 'Remove from featured' : 'Mark as featured'}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          {prod.featured ? <Star size={16} /> : <StarOff size={16} />}
                        </button>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openEdit(prod)}
                          title="Edit product"
                          style={{ padding: '7px', borderRadius: 8, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => confirmDelete(prod)}
                          disabled={deleting === prod.id}
                          title="Delete product"
                          style={{ padding: '7px', borderRadius: 8, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deleting === prod.id ? 0.5 : 1 }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          {deleting === prod.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: '#fff', border: '1px solid #e5e7eb', color: '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const page = totalPages <= 7 ? i + 1 : i < 3 ? i + 1 : i === 3 ? currentPage : totalPages - 2 + (i - 4);
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{ width: 34, height: 34, borderRadius: 9, fontSize: 13, fontWeight: 600, background: currentPage === page ? '#f59e0b' : '#fff', border: '1px solid #e5e7eb', color: currentPage === page ? '#fff' : '#374151', cursor: 'pointer' }}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: '#fff', border: '1px solid #e5e7eb', color: '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Delete single confirm modal ── */}
      {deleteConfirm && (
        <DeleteModal
          title="Delete product?"
          message={`"${deleteConfirm.name}" will be permanently deleted. This action cannot be undone.`}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={executeDelete}
          loading={!!deleting}
        />
      )}

      {/* ── Bulk delete confirm modal ── */}
      {bulkDeleteConfirm && (
        <DeleteModal
          title={`Delete ${selectedIds.size} products?`}
          message={`All ${selectedIds.size} selected products will be permanently deleted. This cannot be undone.`}
          onCancel={() => setBulkDeleteConfirm(false)}
          onConfirm={executeBulkDelete}
          loading={bulkDeleting}
        />
      )}

      {/* ── Create / Edit form modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
          <div style={{ borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '92vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6', background: '#ffffff', position: 'sticky', top: 0, zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>{editing ? 'Edit Product' : 'New Product'}</h2>
                  {editing && <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{editing.name}</p>}
                </div>
              </div>
              <button onClick={() => setShowForm(false)} style={{ padding: 8, borderRadius: 9, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; }}
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              {/* Category */}
              <div>
                <label className={labelCls} style={labelStyle}>Category *</label>
                <select value={form.main_category_id} onChange={e => setForm(p => ({ ...p, main_category_id: e.target.value }))} className={inputCls} style={inputStyle} required>
                  <option value="" disabled>Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Name + Slug */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className={labelCls} style={labelStyle}>Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))} className={inputCls} style={inputStyle} placeholder="Product name" required />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Slug *</label>
                  <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className={inputCls} style={inputStyle} required />
                </div>
              </div>

              {/* Descriptions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                <div>
                  <label className={labelCls} style={labelStyle}>Short Description</label>
                  <input value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} className={inputCls} style={inputStyle} placeholder="Brief one-liner (shown below product title)" />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Full Description (Overview)</label>
                  <textarea rows={4} value={form.full_description} onChange={e => setForm(p => ({ ...p, full_description: e.target.value }))} className={inputCls} style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }} placeholder="Detailed product overview (shown in Overview tab)" />
                </div>
              </div>

              {/* Main image */}
              <div>
                <label className={labelCls} style={labelStyle}>Main Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {form.image && (
                    <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', flexShrink: 0 }}>
                      <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                    </div>
                  )}
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', border: '2px dashed #d1d5db', background: '#fff', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fff'; }}
                  >
                    <Upload size={16} style={{ color: '#9ca3af' }} />
                    <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Upload main image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.image && (
                  <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: 600 }}>
                    Remove image
                  </button>
                )}
              </div>

              {/* Gallery images */}
              <div>
                <label className={labelCls} style={labelStyle}>Gallery Images (Optional)</label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px 16px', borderRadius: 12, cursor: 'pointer', border: '2px dashed #d1d5db', background: '#fff', marginBottom: 10, transition: 'all 0.15s', boxSizing: 'border-box' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fff'; }}
                >
                  <Upload size={16} style={{ color: '#9ca3af' }} />
                  <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Upload additional images</span>
                  <input type="file" accept="image/*" onChange={handleAdditionalImages} style={{ display: 'none' }} multiple />
                </label>
                {additionalImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                    {additionalImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                        <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(idx)}
                          style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 6, background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort order + Featured */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className={labelCls} style={labelStyle}>Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Featured</label>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, featured: p.featured ? 0 : 1 }))}
                    style={{ width: '100%', padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s', ...(form.featured ? { background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706' } : { background: '#f9fafb', border: '1px solid #e5e7eb', color: '#6b7280' }) }}
                  >
                    {form.featured ? <Star size={15} /> : <StarOff size={15} />}
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
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
