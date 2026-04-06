'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Shield, X, Upload, Image as ImageIcon, Save, GripVertical } from 'lucide-react';

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

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCategories() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MainCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '', sort_order: 0, featured: 0 });

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } });
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
    reader.onloadend = () => { setForm(prev => ({ ...prev, image: reader.result as string })); };
    reader.readAsDataURL(file);
  };

  const openCreateForm = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', image: '', sort_order: categories.length, featured: 0 });
    setShowForm(true);
    setError('');
  };

  const openEditForm = (cat: MainCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, sort_order: cat.sort_order, featured: cat.featured || 0 });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');

    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : '/api/admin/categories';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false);
      fetchCategories();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this category? All sub-categories and products under it will also be deleted.')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch {} finally { setDeleting(null); }
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="bg-[#0f1d32] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-white font-bold text-lg">Main Categories</h1>
              <p className="text-white/30 text-xs">Manage top-level product categories</p>
            </div>
          </div>
          <button onClick={openCreateForm} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#001f3f] font-bold text-sm transition-all shadow-lg shadow-amber-500/20">
            <Plus size={18} /> Add Category
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-amber-500" /></div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center"><ImageIcon size={32} className="text-white/20" /></div>
            <p className="text-white/40 text-lg mb-2">No categories yet</p>
            <p className="text-white/20 text-sm mb-6">Create your first main category to get started.</p>
            <button onClick={openCreateForm} className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#001f3f] font-bold text-sm transition-all">
              <Plus size={16} className="inline mr-1" /> Create Category
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-[#0f1d32] border border-white/5 rounded-2xl p-5 flex items-center gap-5 hover:border-white/10 transition-all group">
                {/* Icon/Image */}
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                  {cat.image && (cat.image.startsWith('data:') || cat.image.startsWith('/')) ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <ImageIcon size={24} className="text-white/15" />
                    </div>
                  )}
                  {cat.featured === 1 && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-[#0f1d32]" title="Featured Category"></div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-base">{cat.name}</h3>
                    {cat.featured === 1 && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wide">Featured</span>}
                  </div>
                  <p className="text-white/30 text-sm truncate">{cat.description || 'No description'}</p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-xs text-emerald-400/70">{cat.product_count || 0} products</span>
                    <span className="text-xs text-white/20">slug: {cat.slug}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditForm(cat)} className="p-2.5 rounded-lg bg-white/5 hover:bg-blue-500/10 text-white/40 hover:text-blue-400 transition-all" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id} className="p-2.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all disabled:opacity-50" title="Delete">
                    {deleting === cat.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1d32] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Name *</label>
                <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value, slug: editing ? prev.slug : slugify(e.target.value) }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" placeholder="e.g. Forklifts & Reach Trucks" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Slug *</label>
                <input value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" placeholder="forklifts-reach-trucks" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm resize-none" placeholder="Brief description..." />
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={form.featured === 1}
                  onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked ? 1 : 0 }))}
                  className="w-5 h-5 rounded border-white/20 text-amber-500 focus:ring-amber-500/50 bg-[#0f1d32]"
                />
                <label htmlFor="featured-toggle" className="text-sm font-semibold text-white cursor-pointer select-none">
                  Featured Category <span className="text-white/40 font-normal text-xs ml-1">(Show on home page)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Image (optional)</label>
                <div className="flex items-center gap-4">
                  {form.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-white/10 hover:border-amber-500/30 rounded-xl cursor-pointer transition-all">
                    <Upload size={18} className="text-white/30" />
                    <span className="text-white/40 text-sm">Upload image (base64)</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {form.image && (
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, image: '' }))} className="text-red-400/60 hover:text-red-400 text-xs mt-2 transition-colors">Remove image</button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500/50 text-sm" />
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
