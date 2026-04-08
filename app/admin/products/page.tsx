'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Pencil, Trash2, Loader2, X, Upload, Save,
  Package, Star, StarOff, LayoutGrid, ChevronDown, ChevronUp,
} from 'lucide-react';

interface ProductModel {
  id: string;
  product_id: string;
  model_name: string;
  specs: { label: string; value: string }[];
  images: string[];
  sort_order: number;
}

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

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ── Main Page ── */
export default function AdminProducts() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');

  const [form, setForm] = useState({
    main_category_id: '', name: '', slug: '', short_description: '', full_description: '',
    features: '', specs: '', image: '', images: '[]', brochure_url: '', featured: 0, sort_order: 0,
  });

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/categories', { headers }),
      ]);
      const [prodsData, catsData] = await Promise.all([prodsRes.json(), catsRes.json()]);
      setProducts(prodsData.products || []);
      setCategories(catsData.categories || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  const parseFeatures = (str: string): string[] => {
    try { const arr = JSON.parse(str); return Array.isArray(arr) ? arr : []; } catch {
      return str.split('\n').filter(s => s.trim());
    }
  };

  const parseSpecs = (str: string): Record<string, string> => {
    try { const obj = JSON.parse(str); return typeof obj === 'object' && !Array.isArray(obj) ? obj : {}; } catch {
      const result: Record<string, string> = {};
      str.split('\n').filter(s => s.includes(':')).forEach(line => {
        const [key, ...vals] = line.split(':');
        if (key.trim()) result[key.trim()] = vals.join(':').trim();
      });
      return result;
    }
  };

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
    try {
      const obj = JSON.parse(prod.specs);
      specsStr = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n');
    } catch { specsStr = prod.specs || ''; }
    setForm({ main_category_id: prod.main_category_id, name: prod.name, slug: prod.slug, short_description: prod.short_description || '', full_description: prod.full_description || '', features: featuresStr, specs: specsStr, image: prod.image || '', images: prod.images || '[]', brochure_url: prod.brochure_url || '', featured: prod.featured, sort_order: prod.sort_order });
    setShowForm(true); setError('');
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true); setError('');
    const payload = { ...form, features: JSON.stringify(parseFeatures(form.features)), specs: JSON.stringify(parseSpecs(form.specs)) };
    try {
      const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false); fetchData();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Delete this product?')) return;
    setDeleting(id);
    try { await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); fetchData(); }
    catch {} finally { setDeleting(null); }
  };

  const toggleFeatured = async (prod: Product) => {
    if (!token) return;
    await fetch(`/api/admin/products/${prod.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ featured: prod.featured ? 0 : 1 }) });
    fetchData();
  };

  const filtered = filterCat === 'all' ? products : products.filter(p => p.main_category_id === filterCat);
  let additionalImages: string[] = [];
  try { additionalImages = JSON.parse(form.images); } catch {}

  const inputCls = "w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-colors";
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const labelCls = "block text-[10px] font-semibold uppercase tracking-wider mb-2" ;
  const labelStyle = { color: 'rgba(255,255,255,0.5)' };

  return (
    <div className="min-h-screen" style={{ background: '#001229' }}>
      <header style={{ background: '#001f3f', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-white font-bold text-lg">Products</h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Manage equipment listings & models</p>
            </div>
          </div>
          <button onClick={openCreate} disabled={categories.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg"
            style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#001f3f', boxShadow: '0 4px 15px rgba(245,158,11,0.2)' }}
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {categories.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Filter:</span>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="px-4 py-2 rounded-xl text-white text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="all" style={{ background: '#001f3f' }}>All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id} style={{ background: '#001f3f' }}>{c.name}</option>)}
            </select>
          </div>
        )}

        {loading
          ? <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} /></div>
          : categories.length === 0
            ? <div className="text-center py-20">
                <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Create categories first</p>
                <Link href="/admin/categories" className="px-6 py-3 rounded-xl font-bold text-sm inline-block" style={{ background: '#f59e0b', color: '#001f3f' }}>Go to Categories</Link>
              </div>
            : filtered.length === 0
              ? <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}><Package size={32} style={{ color: 'rgba(255,255,255,0.15)' }} /></div>
                  <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>No products yet</p>
                  <button onClick={openCreate} className="px-6 py-3 rounded-xl font-bold text-sm" style={{ background: '#f59e0b', color: '#001f3f' }}><Plus size={16} className="inline mr-1" /> Add Product</button>
                </div>
              : <div className="grid gap-3">
                  {filtered.map(prod => (
                    <div key={prod.id}>
                      <div className="rounded-2xl overflow-hidden transition-all" style={{ background: '#001f3f', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {/* Product info row */}
                        <div className="p-5 flex items-center gap-5">
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-contain p-1" /> : <Package size={22} style={{ color: 'rgba(16,185,129,0.5)' }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-white font-bold text-base">{prod.name}</h3>
                              {prod.featured === 1 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>Featured</span>}
                            </div>
                            <p className="text-sm truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{prod.short_description || 'No description'}</p>
                            <p className="text-xs mt-1" style={{ color: 'rgba(96,165,250,0.7)' }}>{prod.main_category_name || 'No category'}</p>
                          </div>
                          {/* Icon actions (edit / featured / delete) */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => toggleFeatured(prod)} className="p-2.5 rounded-lg transition-all"
                              style={{ background: 'rgba(255,255,255,0.05)', color: prod.featured ? '#f59e0b' : 'rgba(255,255,255,0.3)' }}
                              title={prod.featured ? 'Unfeature' : 'Feature'}
                            >{prod.featured ? <Star size={16} /> : <StarOff size={16} />}</button>
                            <button onClick={() => openEdit(prod)} className="p-2.5 rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }} title="Edit"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(prod.id)} disabled={deleting === prod.id} className="p-2.5 rounded-lg transition-all disabled:opacity-50" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }} title="Delete">
                              {deleting === prod.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
        }
      </main>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ background: '#001f3f', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg transition-all" style={{ color: 'rgba(255,255,255,0.4)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>{error}</div>}

              <div>
                <label className={labelCls} style={labelStyle}>Category *</label>
                <select value={form.main_category_id} onChange={e => setForm(p => ({ ...p, main_category_id: e.target.value }))}
                  className={inputCls} style={inputStyle} required
                >
                  <option value="" disabled style={{ background: '#001f3f' }}>Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id} style={{ background: '#001f3f' }}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={labelStyle}>Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))}
                    className={inputCls} style={inputStyle} placeholder="Product name" required />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Slug *</label>
                  <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className={inputCls} style={inputStyle} required />
                </div>
              </div>

              <div>
                <label className={labelCls} style={labelStyle}>Short Description</label>
                <input value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} className={inputCls} style={inputStyle} placeholder="Brief one-liner" />
              </div>

              {/* Main image */}
              <div>
                <label className={labelCls} style={labelStyle}>Main Image</label>
                <div className="flex items-center gap-4">
                  {form.image && <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}><img src={form.image} alt="" className="w-full h-full object-contain p-1" /></div>}
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all" style={{ border: '2px dashed rgba(255,255,255,0.1)' }}>
                    <Upload size={18} style={{ color: 'rgba(255,255,255,0.3)' }} /><span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Upload main image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {form.image && <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))} className="text-xs mt-2" style={{ color: 'rgba(239,68,68,0.6)' }}>Remove image</button>}
              </div>



              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={labelStyle}>Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>Featured</label>
                  <button type="button" onClick={() => setForm(p => ({ ...p, featured: p.featured ? 0 : 1 }))}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    style={form.featured ? { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    {form.featured ? <Star size={16} /> : <StarOff size={16} />}
                    {form.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
                >Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#001f3f' }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
