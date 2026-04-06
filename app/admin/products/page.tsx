'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, X, Upload, Save, Package, Star, StarOff } from 'lucide-react';

interface Product {
  id: number;
  sub_category_id: number;
  sub_category_name: string;
  sub_category_slug: string;
  main_category_name: string;
  main_category_slug: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  features: string;
  specs: string;
  image: string;
  featured: number;
  sort_order: number;
}

interface SubCategory { id: number; name: string; main_category_name: string; }

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminProducts() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [filterSub, setFilterSub] = useState<string>('all');

  const [form, setForm] = useState({
    sub_category_id: 0, name: '', slug: '', short_description: '', full_description: '',
    features: '', specs: '', image: '', featured: 0, sort_order: 0,
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
      const [prodsRes, subsRes] = await Promise.all([
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/subcategories', { headers }),
      ]);
      const prodsData = await prodsRes.json();
      const subsData = await subsRes.json();
      setProducts(prodsData.products || []);
      setSubCategories(subsData.subCategories || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setForm(prev => ({ ...prev, image: reader.result as string })); };
    reader.readAsDataURL(file);
  };

  const parseFeatures = (str: string): string[] => {
    try { const arr = JSON.parse(str); return Array.isArray(arr) ? arr : []; } catch { return str.split('\n').filter(s => s.trim()); }
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

  const openCreateForm = () => {
    setEditing(null);
    setForm({ sub_category_id: subCategories[0]?.id || 0, name: '', slug: '', short_description: '', full_description: '', features: '', specs: '', image: '', featured: 0, sort_order: 0 });
    setShowForm(true);
    setError('');
  };

  const openEditForm = (prod: Product) => {
    setEditing(prod);
    let featuresStr = '';
    let specsStr = '';
    try { const arr = JSON.parse(prod.features); featuresStr = Array.isArray(arr) ? arr.join('\n') : prod.features; } catch { featuresStr = prod.features; }
    try {
      const obj = JSON.parse(prod.specs);
      specsStr = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n');
    } catch { specsStr = prod.specs; }

    setForm({ sub_category_id: prod.sub_category_id, name: prod.name, slug: prod.slug, short_description: prod.short_description, full_description: prod.full_description, features: featuresStr, specs: specsStr, image: prod.image, featured: prod.featured, sort_order: prod.sort_order });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      features: JSON.stringify(parseFeatures(form.features)),
      specs: JSON.stringify(parseSpecs(form.specs)),
    };

    try {
      const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false);
      fetchData();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this product permanently?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch {} finally { setDeleting(null); }
  };

  const toggleFeatured = async (prod: Product) => {
    if (!token) return;
    await fetch(`/api/admin/products/${prod.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ featured: prod.featured ? 0 : 1 }),
    });
    fetchData();
  };

  const filtered = filterSub === 'all' ? products : products.filter(p => p.sub_category_id === parseInt(filterSub));

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <header className="bg-[#0f1d32] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="text-white font-bold text-lg">Products</h1>
              <p className="text-white/30 text-xs">Manage equipment listings</p>
            </div>
          </div>
          <button onClick={openCreateForm} disabled={subCategories.length === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#001f3f] font-bold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter */}
        {subCategories.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-white/40 text-sm">Filter:</span>
            <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/50">
              <option value="all" className="bg-[#0f1d32]">All Sub Categories</option>
              {subCategories.map(sc => <option key={sc.id} value={sc.id} className="bg-[#0f1d32]">{sc.main_category_name} → {sc.name}</option>)}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-amber-500" /></div>
        ) : subCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg mb-2">Create sub-categories first</p>
            <Link href="/admin/subcategories" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#001f3f] font-bold text-sm transition-all inline-block">Go to Sub Categories</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center"><Package size={32} className="text-white/20" /></div>
            <p className="text-white/40 text-lg mb-2">No products yet</p>
            <button onClick={openCreateForm} className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#001f3f] font-bold text-sm transition-all"><Plus size={16} className="inline mr-1" /> Add Product</button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(prod => (
              <div key={prod.id} className="bg-[#0f1d32] border border-white/5 rounded-2xl p-5 flex items-center gap-5 hover:border-white/10 transition-all group">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {prod.image && (prod.image.startsWith('data:') || prod.image.startsWith('/')) ? (
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Package size={22} className="text-emerald-400/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-base">{prod.name}</h3>
                    {prod.featured === 1 && <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase">Featured</span>}
                  </div>
                  <p className="text-white/30 text-sm truncate">{prod.short_description || 'No description'}</p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-xs text-purple-400/70">{prod.main_category_name} → {prod.sub_category_name}</span>
                    <span className="text-xs text-white/20">slug: {prod.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleFeatured(prod)} className={`p-2.5 rounded-lg bg-white/5 transition-all ${prod.featured ? 'text-amber-400 hover:bg-amber-500/10' : 'text-white/40 hover:bg-amber-500/10 hover:text-amber-400'}`} title="Toggle Featured">
                    {prod.featured ? <Star size={16} /> : <StarOff size={16} />}
                  </button>
                  <button onClick={() => openEditForm(prod)} className="p-2.5 rounded-lg bg-white/5 hover:bg-blue-500/10 text-white/40 hover:text-blue-400 transition-all"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(prod.id)} disabled={deleting === prod.id} className="p-2.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all disabled:opacity-50">
                    {deleting === prod.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1d32] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sub Category *</label>
                <select value={form.sub_category_id} onChange={e => setForm(prev => ({ ...prev, sub_category_id: parseInt(e.target.value) }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/50" required>
                  <option value={0} disabled className="bg-[#0f1d32]">Select sub-category</option>
                  {subCategories.map(sc => <option key={sc.id} value={sc.id} className="bg-[#0f1d32]">{sc.main_category_name} → {sc.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Name *</label>
                  <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value, slug: editing ? prev.slug : slugify(e.target.value) }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" placeholder="Product name" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Slug *</label>
                  <input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Short Description</label>
                <input value={form.short_description} onChange={e => setForm(prev => ({ ...prev, short_description: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" placeholder="Brief one-liner description" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Full Description</label>
                <textarea value={form.full_description} onChange={e => setForm(prev => ({ ...prev, full_description: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm resize-none" placeholder="Detailed product description..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Features (one per line)</label>
                <textarea value={form.features} onChange={e => setForm(prev => ({ ...prev, features: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm resize-none font-mono" placeholder={"Feature 1\nFeature 2\nFeature 3"} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Specs (Key: Value, one per line)</label>
                <textarea value={form.specs} onChange={e => setForm(prev => ({ ...prev, specs: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm resize-none font-mono" placeholder={"Capacity: 3,000 kg\nEngine: Diesel\nDrive: 4WD"} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Product Image</label>
                <div className="flex items-center gap-4">
                  {form.image && <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0"><img src={form.image} alt="Preview" className="w-full h-full object-contain p-1" /></div>}
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-white/10 hover:border-amber-500/30 rounded-xl cursor-pointer transition-all">
                    <Upload size={18} className="text-white/30" /><span className="text-white/40 text-sm">Upload image (base64)</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {form.image && <button type="button" onClick={() => setForm(prev => ({ ...prev, image: '' }))} className="text-red-400/60 hover:text-red-400 text-xs mt-2">Remove image</button>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500/50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Featured</label>
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, featured: prev.featured ? 0 : 1 }))} className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${form.featured ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    {form.featured ? <Star size={16} /> : <StarOff size={16} />}
                    {form.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-medium text-sm transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#001f3f] font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
