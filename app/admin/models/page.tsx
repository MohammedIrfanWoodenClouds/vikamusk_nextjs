'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderTree, Package, LayoutGrid, Briefcase,
  Mail, LogOut, Globe, Shield, ExternalLink,
  Plus, Pencil, Trash2, Loader2, X, Upload, Save,
  Search, AlertTriangle, ChevronRight,
} from 'lucide-react';

/* ─── Types ─── */
interface Model {
  id: string;
  product_id: string;
  product_name: string;
  category_name: string;
  model_name: string;
  short_description: string;
  features: string;
  specs: { label: string; value: string }[];
  images: string[];
  sort_order: number;
}
interface Product { id: string; name: string; main_category_id: string; main_category_name: string; }
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

/* ─── Helpers ─── */
function parseImages(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim().startsWith('[')) {
    try { const arr = JSON.parse(val); if (Array.isArray(arr)) return arr; } catch {}
  }
  return [];
}

/* ─── Form constants ─── */
const EMPTY_FORM = {
  product_id: '',
  model_name: '',
  short_description: '',
  features: '',
  specsList: [] as { label: string; value: string }[],
  mainImage: '',
  galleryImages: '[]',
  sort_order: 0,
};

const SCISSOR_LIFT_TEMPLATE = [
  { label: '--- DIMENSIONS ---', value: '' },
  { label: 'Maximum Working Height (m)', value: '' },
  { label: 'Maximum Platform Height (m)', value: '' },
  { label: 'Safe Working Load (kg)', value: '' },
  { label: 'Extension Platform Safe Working Load (kg)', value: '' },
  { label: 'Working Platform Size (L x W x H) (m)', value: '' },
  { label: 'Overall Dimensions (L x W x H, Guardrail Folded) (m)', value: '' },
  { label: 'Platform Extension Size (m)', value: '' },
  { label: 'Minimum Ground Clearance (m)', value: '' },
  { label: '--- PERFORMANCE ---', value: '' },
  { label: 'Wheelbase (m)', value: '' },
  { label: 'Turning Radius (Inner / Outer) (m)', value: '' },
  { label: 'Lifting / Lowering Motor', value: '' },
  { label: 'Motor Power (24V)', value: '' },
  { label: 'Lifting / Lowering Speed (m/min)', value: '' },
  { label: 'Machine Driving Speed (Travel State) (km/h)', value: '' },
  { label: 'Machine Driving Speed (Lifting State) (km/h)', value: '' },
  { label: '--- BATTERY ---', value: '' },
  { label: 'Type', value: '' },
  { label: 'Battery Spec', value: '' },
  { label: 'Charger', value: '' },
  { label: 'Maximum Gradeability (%)', value: '' },
  { label: 'Maximum Allowable Angle of Work (°)', value: '' },
  { label: 'Tire Size', value: '' },
  { label: 'Controller Brand', value: '' },
  { label: 'Self-weight (kg)', value: '' },
];

/* ═══════════════════════════════ Main Page ═══════════════════════════════ */
export default function AdminModels() {
  const router   = useRouter();
  const pathname = usePathname();

  const [token,     setToken]     = useState<string | null>(null);
  const [models,    setModels]    = useState<Model[]>([]);
  const [products,  setProducts]  = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState<Model | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');
  const [deleteConfirm,     setDeleteConfirm]     = useState<{ id: string; name: string } | null>(null);
  const [selectedIds,       setSelectedIds]       = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkDeleting,      setBulkDeleting]      = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

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
      const [modelsRes, prodsRes, catsRes] = await Promise.all([
        fetch('/api/admin/models',   { headers }),
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/categories', { headers }),
      ]);
      const [modelsData, prodsData, catsData] = await Promise.all([
        modelsRes.json(), prodsRes.json(), catsRes.json()
      ]);
      setModels((modelsData.models || []).map((m: any) => ({ ...m, images: parseImages(m.images) })));
      setProducts(prodsData.products || []);
      setCategories(catsData.categories || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Spec helpers ── */
  const parseFeatures = (str: string): string[] => {
    try { const a = JSON.parse(str); return Array.isArray(a) ? a : []; }
    catch { return str.split('\n').map(s => s.trim()).filter(Boolean); }
  };

  const handleSpecChange = (idx: number, field: 'label' | 'value', val: string) => {
    const list = [...form.specsList];
    list[idx] = { ...list[idx], [field]: val };
    setForm({ ...form, specsList: list });
  };
  const addSpecRow    = () => setForm({ ...form, specsList: [...form.specsList, { label: '', value: '' }] });
  const removeSpecRow = (idx: number) => { const l = [...form.specsList]; l.splice(idx, 1); setForm({ ...form, specsList: l }); };
  const loadTemplate  = () => setForm(p => ({ ...p, specsList: SCISSOR_LIFT_TEMPLATE.map(r => ({ ...r })) }));

  /* ── Image helpers ── */
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(p => ({ ...p, mainImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let current: string[] = [];
    try { current = JSON.parse(form.galleryImages); } catch {}
    let loaded = 0;
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        current.push(reader.result as string);
        loaded++;
        if (loaded === files.length) setForm(p => ({ ...p, galleryImages: JSON.stringify(current) }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeGalleryImage = (idx: number) => {
    let imgs: string[] = [];
    try { imgs = JSON.parse(form.galleryImages); } catch {}
    imgs.splice(idx, 1);
    setForm(p => ({ ...p, galleryImages: JSON.stringify(imgs) }));
  };

  /* ── Form open/close ── */
  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, product_id: products[0]?.id || '' });
    setShowForm(true); setError('');
  };

  const openEdit = (model: Model) => {
    setEditing(model);
    let imgs: string[] = [];
    if (Array.isArray(model.images)) imgs = model.images;
    else if (typeof model.images === 'string') { try { imgs = JSON.parse(model.images); } catch {} }
    const [mainImage, ...rest] = imgs;
    let featuresStr = '';
    try { const a = JSON.parse(model.features || '[]'); featuresStr = Array.isArray(a) ? a.join('\n') : ''; } catch {}
    setForm({
      product_id: model.product_id,
      model_name: model.model_name,
      short_description: model.short_description || '',
      features: featuresStr,
      specsList: Array.isArray(model.specs) ? model.specs : [],
      mainImage: mainImage || '',
      galleryImages: JSON.stringify(rest),
      sort_order: model.sort_order,
    });
    setShowForm(true); setError('');
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true); setError('');
    let galleryImgs: string[] = [];
    try { galleryImgs = JSON.parse(form.galleryImages); } catch {}
    const allImages = [...(form.mainImage ? [form.mainImage] : []), ...galleryImgs];
    const payload = {
      product_id: form.product_id,
      model_name: form.model_name,
      short_description: form.short_description,
      features: JSON.stringify(parseFeatures(form.features)),
      specs: form.specsList,
      images: allImages,
      sort_order: form.sort_order,
    };
    try {
      const url = editing ? `/api/admin/models/${editing.id}` : '/api/admin/models';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false); fetchData();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  /* ── Delete ── */
  const executeDelete = async () => {
    if (!deleteConfirm || !token) return;
    setDeleting(deleteConfirm.id);
    try {
      await fetch(`/api/admin/models/${deleteConfirm.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
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
          fetch(`/api/admin/models/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        )
      );
      setSelectedIds(new Set());
      fetchData();
    } catch {} finally { setBulkDeleting(false); setBulkDeleteConfirm(false); }
  };

  /* ── Selection helpers ── */
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (filtered.length > 0 && filtered.every(m => selectedIds.has(m.id))) {
      setSelectedIds(prev => { const next = new Set(prev); filtered.forEach(m => next.delete(m.id)); return next; });
    } else {
      setSelectedIds(prev => { const next = new Set(prev); filtered.forEach(m => next.add(m.id)); return next; });
    }
  };

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    let result = models;
    
    // 1. Category Filter
    if (filterCategory !== 'all') {
      const productIdsInCat = products
        .filter(p => p.main_category_id === filterCategory)
        .map(p => p.id);
      result = result.filter(m => productIdsInCat.includes(m.product_id));
    }

    // 2. Product Filter
    if (filterProduct !== 'all') {
      result = result.filter(m => m.product_id === filterProduct);
    }

    // 3. Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.model_name.toLowerCase().includes(q) ||
        (m.product_name || '').toLowerCase().includes(q) ||
        (m.category_name || '').toLowerCase().includes(q) ||
        (m.short_description || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [models, products, filterCategory, filterProduct, search]);

  // Derived products for the filter dropdown (filtered by category)
  const productsForFilter = useMemo(() => {
    if (filterCategory === 'all') return products;
    return products.filter(p => p.main_category_id === filterCategory);
  }, [products, filterCategory]);

  let galleryImages: string[] = [];
  try { galleryImages = JSON.parse(form.galleryImages); } catch {}

  /* ─── Shared light input style ─── */
  const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 13, background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 6 };
  const filterSelect: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: '#fff', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer', outline: 'none' };

  const focusAmber = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#f59e0b';
    e.currentTarget.style.boxShadow   = '0 0 0 2px rgba(245,158,11,0.12)';
  };
  const blurReset = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#e5e7eb';
    e.currentTarget.style.boxShadow   = 'none';
  };

  /* ════════════════════════ Render ════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      <Sidebar pathname={pathname || ''} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Models</h1>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
              {loading ? '...' : `${filtered.length} of ${models.length} models`}
            </p>
          </div>
          <button
            onClick={openCreate}
            disabled={products.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#f59e0b', border: 'none', color: '#fff', cursor: products.length === 0 ? 'not-allowed' : 'pointer', opacity: products.length === 0 ? 0.5 : 1, boxShadow: '0 4px 12px rgba(245,158,11,0.3)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { if (products.length > 0) e.currentTarget.style.background = '#d97706'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b'; }}
          >
            <Plus size={16} /> Add Model
          </button>
        </header>

        <main style={{ flex: 1, padding: '24px 32px 40px' }}>

          {/* ── Search + filter ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200, maxWidth: 360 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inp, paddingLeft: 36, paddingRight: search ? 36 : 14 }}
                onFocus={focusAmber}
                onBlur={blurReset}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setFilterProduct('all'); }} style={filterSelect}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} style={filterSelect}>
              <option value="all">All Products</option>
              {productsForFilter.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {(filterCategory !== 'all' || filterProduct !== 'all' || search) && (
              <button onClick={() => { setFilterCategory('all'); setFilterProduct('all'); setSearch(''); }} style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer' }}>
                Clear filters
              </button>
            )}
          </div>

          {/* ── Bulk action bar ── */}
          {selectedIds.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 12, background: '#fffbeb', border: '1px solid #fde68a', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>
                {selectedIds.size} model{selectedIds.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setBulkDeleteConfirm(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <Trash2 size={13} /> Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer' }}
              >
                <X size={13} /> Clear
              </button>
            </div>
          )}

          {/* ── Content ── */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
              <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Package size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>Create products first</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>You need at least one product before adding models.</p>
              <Link href="/admin/products" style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: '#f59e0b', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>
                Go to Products
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <LayoutGrid size={28} style={{ color: '#d1d5db' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
                {search || filterProduct !== 'all' ? 'No models match your filters' : 'No models yet'}
              </p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
                {search || filterProduct !== 'all' ? 'Try adjusting your search or filter.' : 'Add your first model to get started.'}
              </p>
              {!(search || filterProduct !== 'all') && (
                <button onClick={openCreate} style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: '#f59e0b', border: 'none', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={15} /> Add Model
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {/* Select-all row */}
              {filtered.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 18px', borderRadius: 10, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && filtered.every(m => selectedIds.has(m.id))}
                    onChange={toggleSelectAll}
                    style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#f59e0b' }}
                  />
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Select all {filtered.length} models</span>
                </div>
              )}

              {filtered.map((model) => {
                const thumb    = (model.images || [])[0];
                const specCount = (model.specs || []).length;
                const imgCount  = (model.images || []).length;
                const isSelected = selectedIds.has(model.id);
                return (
                  <div
                    key={model.id}
                    style={{ background: isSelected ? '#fffbeb' : '#fff', border: `1px solid ${isSelected ? '#fde68a' : '#e5e7eb'}`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'pointer' }}
                    onClick={() => openEdit(model)}
                    onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; } }}
                  >
                    {/* Checkbox */}
                    <div onClick={e => { e.stopPropagation(); toggleSelect(model.id); }} style={{ flexShrink: 0 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(model.id)}
                        style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#f59e0b' }}
                      />
                    </div>

                    {/* Thumbnail */}
                    <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e5e7eb' }}>
                      {thumb
                        ? <img src={thumb} alt={model.model_name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                        : <LayoutGrid size={20} style={{ color: '#9ca3af' }} />
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                          {model.model_name}
                        </span>
                        {specCount > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#eff6ff', color: '#3b82f6', border: '1px solid #dbeafe' }}>
                            {specCount} specs
                          </span>
                        )}
                        {imgCount > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#f0fdf4', color: '#10b981', border: '1px solid #d1fae5' }}>
                            {imgCount} image{imgCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 420 }}>
                        {model.short_description || 'No description'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af' }}>
                        {model.category_name && <span style={{ color: '#6b7280', fontWeight: 500 }}>{model.category_name}</span>}
                        {model.category_name && <ChevronRight size={11} />}
                        <span style={{ color: '#374151', fontWeight: 600 }}>{model.product_name}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openEdit(model)}
                        title="Edit"
                        style={{ padding: 8, borderRadius: 9, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: model.id, name: model.model_name })}
                        disabled={deleting === model.id}
                        title="Delete"
                        style={{ padding: 8, borderRadius: 9, border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deleting === model.id ? 0.5 : 1 }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {deleting === model.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
          title="Delete model?"
          message={`"${deleteConfirm.name}" will be permanently deleted. This action cannot be undone.`}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={executeDelete}
          loading={!!deleting}
        />
      )}

      {/* ── Bulk delete confirm ── */}
      {bulkDeleteConfirm && (
        <DeleteModal
          title={`Delete ${selectedIds.size} model${selectedIds.size !== 1 ? 's' : ''}?`}
          message={`${selectedIds.size} model${selectedIds.size !== 1 ? 's' : ''} will be permanently deleted. This action cannot be undone.`}
          onCancel={() => setBulkDeleteConfirm(false)}
          onConfirm={executeBulkDelete}
          loading={bulkDeleting}
        />
      )}

      {/* ── Create / Edit modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
          <div style={{ borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '92vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LayoutGrid size={17} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>{editing ? 'Edit Model' : 'New Model'}</h2>
                  {editing && <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{editing.model_name}</p>}
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
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              {/* Product selector */}
              <div>
                <label style={lbl}>Product *</label>
                <select value={form.product_id} onChange={e => setForm(p => ({ ...p, product_id: e.target.value }))} style={inp} required onFocus={focusAmber} onBlur={blurReset}>
                  <option value="" disabled>Select product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.main_category_name ? `${p.main_category_name} → ` : ''}{p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model name + Sort order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 14 }}>
                <div>
                  <label style={lbl}>Model Name *</label>
                  <input value={form.model_name} onChange={e => setForm(p => ({ ...p, model_name: e.target.value }))} style={inp} placeholder="e.g. VM-1500, ES1932E" required onFocus={focusAmber} onBlur={blurReset} />
                </div>
                <div>
                  <label style={lbl}>Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} style={inp} onFocus={focusAmber} onBlur={blurReset} />
                </div>
              </div>

              {/* Short description */}
              <div>
                <label style={lbl}>Short Description</label>
                <input value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} style={inp} placeholder="Brief one-liner about this model" onFocus={focusAmber} onBlur={blurReset} />
              </div>

              {/* Features */}
              <div>
                <label style={lbl}>Features (one per line)</label>
                <textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }} placeholder={'Heavy duty lift system\nFull hydraulic control\nSafety certified'} onFocus={focusAmber} onBlur={blurReset} />
              </div>

              {/* Specs table */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280' }}>Specifications Table</span>
                  <button type="button" onClick={loadTemplate}
                    style={{ fontSize: 11, padding: '4px 10px', borderRadius: 7, background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fef3c7'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fffbeb'; }}
                  >
                    Load Template
                  </button>
                </div>

                <div style={{ padding: 12 }}>
                  {form.specsList.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: '0 8px', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', paddingLeft: 4 }}>Label / Spec Name</span>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', paddingLeft: 4 }}>Value</span>
                      <span />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto', paddingRight: 2 }}>
                    {form.specsList.map((row, idx) => {
                      const isHeader = row.label.startsWith('---');
                      return (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8, alignItems: 'center' }}>
                          <input value={row.label} onChange={e => handleSpecChange(idx, 'label', e.target.value)}
                            style={{ ...inp, padding: '7px 10px', fontSize: 12, background: isHeader ? '#fffbeb' : '#f9fafb', fontWeight: isHeader ? 700 : 400, color: isHeader ? '#92400e' : '#111827' }}
                            placeholder="Spec label" onFocus={focusAmber} onBlur={blurReset} />
                          <input value={row.value} onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                            style={{ ...inp, padding: '7px 10px', fontSize: 12 }}
                            placeholder={isHeader ? 'Leave blank for headers' : 'Value'} onFocus={focusAmber} onBlur={blurReset} />
                          <button type="button" onClick={() => removeSpecRow(idx)}
                            style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" onClick={addSpecRow}
                    style={{ marginTop: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: '1.5px dashed #d1d5db', background: '#fff', color: '#6b7280', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#d97706'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280'; }}
                  >
                    <Plus size={13} /> Add Row
                  </button>
                </div>
              </div>

              {/* Main image */}
              <div>
                <label style={lbl}>Main Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {form.mainImage && (
                    <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', flexShrink: 0 }}>
                      <img src={form.mainImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                    </div>
                  )}
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', border: '2px dashed #d1d5db', background: '#fff', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fff'; }}
                  >
                    <Upload size={16} style={{ color: '#9ca3af' }} />
                    <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Upload main image</span>
                    <input type="file" accept="image/*" onChange={handleMainImage} style={{ display: 'none' }} />
                  </label>
                </div>
                {form.mainImage && (
                  <button type="button" onClick={() => setForm(p => ({ ...p, mainImage: '' }))} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: 600, marginTop: 4 }}>
                    Remove image
                  </button>
                )}
              </div>

              {/* Gallery images */}
              <div>
                <label style={lbl}>Gallery Images</label>
                {galleryImages.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    {galleryImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 60, height: 60, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }} />
                        <button type="button" onClick={() => removeGalleryImage(idx)}
                          style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: 5, background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', borderRadius: 12, cursor: 'pointer', border: '2px dashed #d1d5db', background: '#fff', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fff'; }}
                >
                  <Upload size={16} style={{ color: '#9ca3af' }} />
                  <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Add gallery images (multi-select)</span>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryImages} style={{ display: 'none' }} />
                </label>
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
                  {saving ? 'Saving...' : editing ? 'Update Model' : 'Create Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
