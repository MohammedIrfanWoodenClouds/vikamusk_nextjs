'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, X, Save, Briefcase, Eye, EyeOff } from 'lucide-react';

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

export default function AdminCareers() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Career | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '', department: '', location: '', type: 'Full-time',
    description: '', requirements: '', benefits: '', is_active: 1,
  });

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  const fetchCareers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/careers', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setCareers(data.careers || []);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const openCreateForm = () => {
    setEditing(null);
    setForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', benefits: '', is_active: 1 });
    setShowForm(true);
    setError('');
  };

  const openEditForm = (career: Career) => {
    setEditing(career);
    let reqStr = '', benStr = '';
    try { const arr = JSON.parse(career.requirements); reqStr = Array.isArray(arr) ? arr.join('\n') : career.requirements; } catch { reqStr = career.requirements; }
    try { const arr = JSON.parse(career.benefits); benStr = Array.isArray(arr) ? arr.join('\n') : career.benefits; } catch { benStr = career.benefits; }
    setForm({ title: career.title, department: career.department, location: career.location, type: career.type, description: career.description, requirements: reqStr, benefits: benStr, is_active: career.is_active });
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
      requirements: JSON.stringify(form.requirements.split('\n').filter(s => s.trim())),
      benefits: JSON.stringify(form.benefits.split('\n').filter(s => s.trim())),
    };

    try {
      const url = editing ? `/api/admin/careers/${editing.id}` : '/api/admin/careers';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setShowForm(false);
      fetchCareers();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this career posting permanently?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/careers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchCareers();
    } catch {} finally { setDeleting(null); }
  };

  const toggleActive = async (career: Career) => {
    if (!token) return;
    await fetch(`/api/admin/careers/${career.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_active: career.is_active ? 0 : 1 }),
    });
    fetchCareers();
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <header className="bg-[#0f1d32] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="text-white font-bold text-lg">Career Postings</h1>
              <p className="text-white/30 text-xs">Manage job openings</p>
            </div>
          </div>
          <button onClick={openCreateForm} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#001f3f] font-bold text-sm transition-all shadow-lg shadow-amber-500/20">
            <Plus size={18} /> Add Posting
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-amber-500" /></div>
        ) : careers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center"><Briefcase size={32} className="text-white/20" /></div>
            <p className="text-white/40 text-lg mb-2">No career postings yet</p>
            <button onClick={openCreateForm} className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#001f3f] font-bold text-sm transition-all"><Plus size={16} className="inline mr-1" /> Create Posting</button>
          </div>
        ) : (
          <div className="grid gap-4">
            {careers.map(career => (
              <div key={career.id} className="bg-[#0f1d32] border border-white/5 rounded-2xl p-5 flex items-center gap-5 hover:border-white/10 transition-all group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${career.is_active ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                  <Briefcase size={22} className={career.is_active ? 'text-emerald-400/70' : 'text-white/20'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-base">{career.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${career.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {career.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-white/30 text-sm truncate">{career.description || 'No description'}</p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-xs text-blue-400/70">{career.department}</span>
                    <span className="text-xs text-purple-400/70">{career.location}</span>
                    <span className="text-xs text-amber-400/70">{career.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleActive(career)} className={`p-2.5 rounded-lg bg-white/5 transition-all ${career.is_active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-white/40 hover:bg-emerald-500/10 hover:text-emerald-400'}`} title="Toggle Active">
                    {career.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => openEditForm(career)} className="p-2.5 rounded-lg bg-white/5 hover:bg-blue-500/10 text-white/40 hover:text-blue-400 transition-all"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(career.id)} disabled={deleting === career.id} className="p-2.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all disabled:opacity-50">
                    {deleting === career.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Posting' : 'New Posting'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Job Title *</label>
                <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" placeholder="e.g. Sales Engineer" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Department</label>
                  <input value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" placeholder="Sales" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Location</label>
                  <input value={form.location} onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm" placeholder="Ajman, UAE" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Type</label>
                  <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-amber-500/50">
                    <option value="Full-time" className="bg-[#0f1d32]">Full-time</option>
                    <option value="Part-time" className="bg-[#0f1d32]">Part-time</option>
                    <option value="Contract" className="bg-[#0f1d32]">Contract</option>
                    <option value="Internship" className="bg-[#0f1d32]">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm resize-none" placeholder="Job description..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Requirements (one per line)</label>
                <textarea value={form.requirements} onChange={e => setForm(prev => ({ ...prev, requirements: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm resize-none font-mono" placeholder={"3+ years experience\nBachelor's degree\nValid driving license"} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Benefits (one per line)</label>
                <textarea value={form.benefits} onChange={e => setForm(prev => ({ ...prev, benefits: e.target.value }))} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-amber-500/50 text-sm resize-none font-mono" placeholder={"Competitive salary\nHealth insurance\nAnnual leave"} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Status</label>
                <button type="button" onClick={() => setForm(prev => ({ ...prev, is_active: prev.is_active ? 0 : 1 }))} className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${form.is_active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                  {form.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  {form.is_active ? 'Active (visible to public)' : 'Inactive (hidden)'}
                </button>
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
