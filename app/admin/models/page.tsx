'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Pencil, Trash2, Loader2, X, Upload, Save,
  Package, LayoutGrid, ChevronDown, Star, StarOff,
} from 'lucide-react';

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

interface Product { id: string; name: string; main_category_name: string; }

function slugifyModel(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

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

export default function AdminModels() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Model | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [modelsRes, prodsRes] = await Promise.all([
        fetch('/api/admin/models', { headers }),
        fetch('/api/admin/products', { headers }),
      ]);
      const [modelsData, prodsData] = await Promise.all([modelsRes.json(), prodsRes.json()]);
      setModels(modelsData.models || []);
      setProducts(prodsData.products || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Helpers ── */
  const parseFeatures = (str: string): string[] => {
    try { const a = JSON.parse(str); return Array.isArray(a) ? a : []; }
    catch { return str.split('\n').map(s => s.trim()).filter(Boolean); }
  };

  const handleSpecChange = (idx: number, field: 'label' | 'value', val: string) => {
    const list = [...form.specsList];
    list[idx] = { ...list[idx], [field]: val };
    setForm({ ...form, specsList: list });
  };

  const addSpecRow = () => setForm({ ...form, specsList: [...form.specsList, { label: '', value: '' }] });
  
  const removeSpecRow = (idx: number) => {
    const list = [...form.specsList];
    list.splice(idx, 1);
    setForm({ ...form, specsList: list });
  };

  const loadTemplate = () => {
    setForm(p => ({
      ...p,
      specsList: [
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
      ]
    }));
  };

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
    const imgs = Array.isArray(model.images) ? model.images : [];
    const [mainImage, ...rest] = imgs;
    let featuresStr = '';
    try { const a = JSON.parse(model.features || '[]'); featuresStr = Array.isArray(a) ? a.join('\n') : ''; }
    catch { featuresStr = ''; }
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
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false);
      fetchData();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Delete this model?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/models/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch {} finally { setDeleting(null); }
  };

  /* ── Derived state ── */
  const filtered = filterProduct === 'all' ? models : models.filter(m => m.product_id === filterProduct);
  let galleryImages: string[] = [];
  try { galleryImages = JSON.parse(form.galleryImages); } catch {}

  const inputCls = 'w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-colors';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const labelCls = 'block text-[10px] font-semibold uppercase tracking-wider mb-2';
  const labelStyle = { color: 'rgba(255,255,255,0.5)' };

  return (
    <div className="min-h-screen" style={{ background: '#001229' }}>
      {/* Header */}
      <header style={{ background: '#001f3f', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-white font-bold text-lg">Models</h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Manage product variants & specifications</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            disabled={products.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg"
            style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#001f3f', boxShadow: '0 4px 15px rgba(245,158,11,0.2)' }}
          >
            <Plus size={18} /> Add Model
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter */}
        {products.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Filter by product:</span>
            <select
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="px-4 py-2 rounded-xl text-white text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="all" style={{ background: '#001f3f' }}>All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.id} style={{ background: '#001f3f' }}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Create products first</p>
            <Link href="/admin/products" className="px-6 py-3 rounded-xl font-bold text-sm inline-block" style={{ background: '#f59e0b', color: '#001f3f' }}>Go to Products</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <LayoutGrid size={32} style={{ color: 'rgba(255,255,255,0.15)' }} />
            </div>
            <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>No models yet</p>
            <button onClick={openCreate} className="px-6 py-3 rounded-xl font-bold text-sm" style={{ background: '#f59e0b', color: '#001f3f' }}>
              <Plus size={16} className="inline mr-1" /> Add Model
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(model => {
              const thumb = (model.images || [])[0];
              return (
                <div key={model.id} className="rounded-2xl p-5 flex items-center gap-5 transition-all group" style={{ background: '#001f3f', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {thumb
                      ? <img src={thumb} alt={model.model_name} className="w-full h-full object-contain p-1" />
                      : <LayoutGrid size={22} style={{ color: 'rgba(96,165,250,0.4)' }} />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-base">{model.model_name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
                        {(model.specs || []).length} specs
                      </span>
                      {(model.images || []).length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399' }}>
                          {model.images.length} image{model.images.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {model.short_description || 'No description'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(96,165,250,0.7)' }}>
                      {model.category_name && <span className="mr-2">{model.category_name} →</span>}
                      {model.product_name}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(model)} className="p-2.5 rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(model.id)} disabled={deleting === model.id} className="p-2.5 rounded-lg transition-all disabled:opacity-50" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }} title="Delete">
                      {deleting === model.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Create / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ background: '#001f3f', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 sticky top-0 z-10" style={{ background: '#001f3f', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Model' : 'New Model'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg transition-all" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              {/* Product selector */}
              <div>
                <label className={labelCls} style={labelStyle}>Product *</label>
                <select
                  value={form.product_id}
                  onChange={e => setForm(p => ({ ...p, product_id: e.target.value }))}
                  className={inputCls} style={inputStyle} required
                >
                  <option value="" disabled style={{ background: '#001f3f' }}>Select product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} style={{ background: '#001f3f' }}>
                      {p.main_category_name ? `${p.main_category_name} → ` : ''}{p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model name */}
              <div>
                <label className={labelCls} style={labelStyle}>Model Name *</label>
                <input
                  value={form.model_name}
                  onChange={e => setForm(p => ({ ...p, model_name: e.target.value }))}
                  className={inputCls} style={inputStyle}
                  placeholder="e.g. VM-1500, ES1932E, 3T Diesel"
                  required
                />
              </div>

              {/* Short description */}
              <div>
                <label className={labelCls} style={labelStyle}>Short Description</label>
                <input
                  value={form.short_description}
                  onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))}
                  className={inputCls} style={inputStyle}
                  placeholder="Brief one-liner about this model"
                />
              </div>

              {/* Features */}
              <div>
                <label className={labelCls} style={labelStyle}>Features (one per line)</label>
                <textarea
                  value={form.features}
                  onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
                  rows={4}
                  className={`${inputCls} resize-none font-mono`} style={inputStyle}
                  placeholder={'Heavy duty lift system\nFull hydraulic control\nSafety certified'}
                />
              </div>

              {/* Specs Table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelCls} style={{ ...labelStyle, marginBottom: 0 }}>Specifications Table</label>
                  <button type="button" onClick={loadTemplate}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 font-bold hover:bg-amber-500/20 transition-all border border-amber-500/20">
                    Load Scissor Lift Template
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex gap-2">
                     <div className="flex-1 text-[10px] uppercase font-bold text-white/30">Label / Spec Name</div>
                     <div className="flex-1 text-[10px] uppercase font-bold text-white/30">Value</div>
                     <div className="w-[38px]"></div>
                  </div>
                  {form.specsList.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                       <input value={row.label} onChange={e => handleSpecChange(idx, 'label', e.target.value)}
                         className={inputCls} style={{...inputStyle, padding: '8px 12px', fontSize: '12px'}} placeholder="e.g. Dimensions" />
                       <input value={row.value} onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                         className={inputCls} style={{...inputStyle, padding: '8px 12px', fontSize: '12px'}} placeholder="Value (leave blank for group headers)" />
                       <button type="button" onClick={() => removeSpecRow(idx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0">
                         <X size={14} />
                       </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addSpecRow}
                  className="text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all"
                  style={{ border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                  <Plus size={12} /> Add Row
                </button>
              </div>

              {/* Main image */}
              <div>
                <label className={labelCls} style={labelStyle}>Main Image</label>
                <div className="flex items-center gap-4">
                  {form.mainImage && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <img src={form.mainImage} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all" style={{ border: '2px dashed rgba(255,255,255,0.1)' }}>
                    <Upload size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Upload main image</span>
                    <input type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
                  </label>
                </div>
                {form.mainImage && (
                  <button type="button" onClick={() => setForm(p => ({ ...p, mainImage: '' }))} className="text-xs mt-2" style={{ color: 'rgba(239,68,68,0.6)' }}>
                    Remove image
                  </button>
                )}
              </div>

              {/* Gallery images */}
              <div>
                <label className={labelCls} style={labelStyle}>Gallery Images (additional)</label>
                {galleryImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden group" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <img src={img} alt="" className="w-full h-full object-contain p-1" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: 'rgba(239,68,68,0.6)' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all" style={{ border: '2px dashed rgba(255,255,255,0.08)' }}>
                  <Upload size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Add gallery images (multi-select)</span>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryImages} className="hidden" />
                </label>
              </div>

              {/* Sort order */}
              <div>
                <label className={labelCls} style={labelStyle}>Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                  className={inputCls} style={inputStyle}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)', color: '#001f3f' }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
