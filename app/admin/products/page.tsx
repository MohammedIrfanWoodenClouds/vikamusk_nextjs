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

/* ── Models Panel ── */
function ModelsEditor({ productId, token }: { productId: string; token: string }) {
  const [models, setModels] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/models`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setModels(data.models || []);
    } finally { setLoading(false); }
  }, [productId, token]);

  useEffect(() => { fetchModels(); }, [fetchModels]);

  const addModel = async () => {
    if (!newModelName.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${productId}/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ model_name: newModelName.trim(), specs: [], sort_order: models.length }),
      });
      setNewModelName('');
      fetchModels();
    } finally { setSaving(false); }
  };

  const deleteModel = async (modelId: string) => {
    if (!confirm('Delete this model?')) return;
    await fetch(`/api/admin/products/${productId}/models/${modelId}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    fetchModels();
  };

  const updateSpec = (model: ProductModel, idx: number, field: 'label' | 'value', val: string) => {
    const specs = (model.specs || []).map((s, i) => i === idx ? { ...s, [field]: val } : s);
    setModels(prev => prev.map(m => m.id === model.id ? { ...m, specs } : m));
  };

  const addSpec = (model: ProductModel) => {
    const specs = [...(model.specs || []), { label: '', value: '' }];
    setModels(prev => prev.map(m => m.id === model.id ? { ...m, specs } : m));
  };

  const removeSpec = async (model: ProductModel, idx: number) => {
    const specs = (model.specs || []).filter((_, i) => i !== idx);
    setModels(prev => prev.map(m => m.id === model.id ? { ...m, specs } : m));
    await fetch(`/api/admin/products/${productId}/models/${model.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ specs }),
    });
  };

  const saveSpecs = async (model: ProductModel) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${productId}/models/${model.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ specs: model.specs || [] }),
      });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="py-4 flex justify-center"><Loader2 size={18} className="animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newModelName}
          onChange={e => setNewModelName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addModel()}
          placeholder="Model name (e.g. VM-1500, Model A, 3T Diesel)"
          className="flex-1 px-3 py-2 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        <button onClick={addModel} disabled={saving || !newModelName.trim()}
          className="px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center gap-1.5 transition-all"
          style={{ background: '#f59e0b', color: '#001f3f' }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
        </button>
      </div>

      {models.length === 0
        ? <p className="text-xs italic py-2" style={{ color: 'rgba(255,255,255,0.3)' }}>No models yet. Add one above.</p>
        : models.map(model => (
          <div key={model.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              onClick={() => setExpandedModel(expandedModel === model.id ? null : model.id)}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid size={14} style={{ color: '#f59e0b' }} />
                <span className="text-white font-bold text-sm">{model.model_name}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>({(model.specs || []).length} specs)</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); deleteModel(model.id); }}
                  className="p-1.5 rounded-lg transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}
                ><Trash2 size={13} /></button>
                {expandedModel === model.id ? <ChevronUp size={14} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />}
              </div>
            </div>

            {expandedModel === model.id && (
              <div className="p-4 space-y-2.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-[10px] uppercase tracking-wider font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Spec Rows</p>
                {(model.specs || []).map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input value={spec.label} onChange={e => updateSpec(model, idx, 'label', e.target.value)}
                      placeholder="Label (e.g. Capacity)" className="flex-1 px-3 py-2 rounded-lg text-white placeholder-white/20 text-xs focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <input value={spec.value} onChange={e => updateSpec(model, idx, 'value', e.target.value)}
                      placeholder="Value (e.g. 1,500 kg)" className="flex-1 px-3 py-2 rounded-lg text-white placeholder-white/20 text-xs focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <button onClick={() => removeSpec(model, idx)} className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button onClick={() => addSpec(model)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all"
                    style={{ border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                  ><Plus size={12} /> Add Row</button>
                  <button onClick={() => saveSpecs(model)} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all disabled:opacity-50"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                  >{saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Specs</button>
                </div>
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
}

/* ── Main Page ── */
export default function AdminProducts() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showModels, setShowModels] = useState<string | null>(null);
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
                      <div className="rounded-2xl p-5 flex items-center gap-5 transition-all group" style={{ background: '#001f3f', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-contain p-1" /> : <Package size={22} style={{ color: 'rgba(16,185,129,0.5)' }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-bold text-base">{prod.name}</h3>
                            {prod.featured === 1 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>Featured</span>}
                          </div>
                          <p className="text-sm truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{prod.short_description || 'No description'}</p>
                          <p className="text-xs mt-1" style={{ color: 'rgba(96,165,250,0.7)' }}>{prod.sub_category_name || prod.main_category_name || 'No category'}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setShowModels(showModels === prod.id ? null : prod.id)}
                            className="p-2.5 rounded-lg transition-all"
                            style={{ background: showModels === prod.id ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.05)', color: showModels === prod.id ? '#60a5fa' : 'rgba(255,255,255,0.4)' }}
                            title="Manage Models"
                          ><LayoutGrid size={16} /></button>
                          <button onClick={() => toggleFeatured(prod)} className="p-2.5 rounded-lg transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)', color: prod.featured ? '#f59e0b' : 'rgba(255,255,255,0.4)' }}
                          >{prod.featured ? <Star size={16} /> : <StarOff size={16} />}</button>
                          <button onClick={() => openEdit(prod)} className="p-2.5 rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(prod.id)} disabled={deleting === prod.id} className="p-2.5 rounded-lg transition-all disabled:opacity-50" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                            {deleting === prod.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Models panel */}
                      {showModels === prod.id && token && (
                        <div className="mt-1.5 rounded-2xl p-5" style={{ background: 'rgba(0,31,63,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center gap-2 mb-4">
                            <LayoutGrid size={15} style={{ color: '#60a5fa' }} />
                            <h4 className="text-white font-bold text-sm">Product Models & Spec Table</h4>
                            <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.25)' }}>— Adds variants to the comparison table on the product page</span>
                          </div>
                          <ModelsEditor productId={prod.id} token={token} />
                        </div>
                      )}
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

              <div>
                <label className={labelCls} style={labelStyle}>Full Description</label>
                <textarea value={form.full_description} onChange={e => setForm(p => ({ ...p, full_description: e.target.value }))} rows={4}
                  className={`${inputCls} resize-none`} style={inputStyle} placeholder="Detailed product description..." />
              </div>

              <div>
                <label className={labelCls} style={labelStyle}>Features (one per line)</label>
                <textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} rows={4}
                  className={`${inputCls} resize-none font-mono`} style={inputStyle} placeholder={"Heavy duty lift system\nFull hydraulic control\nSafety certified"} />
              </div>

              <div>
                <label className={labelCls} style={labelStyle}>General Specs (Key: Value, one per line)</label>
                <textarea value={form.specs} onChange={e => setForm(p => ({ ...p, specs: e.target.value }))} rows={4}
                  className={`${inputCls} resize-none font-mono`} style={inputStyle} placeholder={"Capacity: 3,000 kg\nEngine: Diesel\nMax Height: 6m"} />
                <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>For multi-model comparison tables, use the Models panel after saving.</p>
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

              {/* Additional images */}
              <div>
                <label className={labelCls} style={labelStyle}>Gallery Images (additional)</label>
                {additionalImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {additionalImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden group" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <img src={img} alt="" className="w-full h-full object-contain p-1" />
                        <button type="button" onClick={() => removeAdditionalImage(idx)}
                          className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: 'rgba(239,68,68,0.6)' }}
                        ><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all" style={{ border: '2px dashed rgba(255,255,255,0.08)' }}>
                  <Upload size={16} style={{ color: 'rgba(255,255,255,0.3)' }} /><span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Add gallery images (multi-select)</span>
                  <input type="file" accept="image/*" multiple onChange={handleAdditionalImages} className="hidden" />
                </label>
              </div>

              {/* Brochure URL */}
              <div>
                <label className={labelCls} style={labelStyle}>Brochure / Download URL (optional)</label>
                <input value={form.brochure_url} onChange={e => setForm(p => ({ ...p, brochure_url: e.target.value }))}
                  className={inputCls} style={inputStyle} placeholder="https://... or /files/product-brochure.pdf" />
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
