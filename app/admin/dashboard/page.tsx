'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FolderTree, Package, Briefcase, LogOut, Layers, ChevronRight, Loader2, Shield, Mail } from 'lucide-react';

interface Stats {
  categories: number;
  products: number;
  careers: number;
  enquiries: number;
}

function useAdminAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
    setLoading(false);
  }, [router]);

  const logout = async () => {
    localStorage.removeItem('admin_token');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return { token, loading, logout };
}

export default function AdminDashboard() {
  const { token, loading: authLoading, logout } = useAdminAuth();
  const [stats, setStats] = useState<Stats>({ categories: 0, products: 0, careers: 0, enquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/admin/categories', { headers }).then(r => r.json()),
      fetch('/api/admin/products', { headers }).then(r => r.json()),
      fetch('/api/admin/careers', { headers }).then(r => r.json()),
      fetch('/api/admin/enquiries', { headers }).then(r => r.json()).catch(() => ({ enquiries: [] })),
    ]).then(([cats, prods, careers, enqs]) => {
      setStats({
        categories: cats.categories?.length || 0,
        products: prods.products?.length || 0,
        careers: careers.careers?.length || 0,
        enquiries: enqs.enquiries?.length || 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001229]">
        <Loader2 size={32} className="animate-spin text-[#f59e0b]" />
      </div>
    );
  }

  const cards = [
    { title: 'Categories', count: stats.categories, icon: <FolderTree size={24} />, href: '/admin/categories', color: 'from-blue-500 to-blue-600', desc: 'Top-level product categories' },
    { title: 'Products', count: stats.products, icon: <Package size={24} />, href: '/admin/products', color: 'from-emerald-500 to-emerald-600', desc: 'Equipment listings & models' },
    { title: 'Career Postings', count: stats.careers, icon: <Briefcase size={24} />, href: '/admin/careers', color: 'from-amber-500 to-amber-600', desc: 'Job openings and postings' },
    { title: 'Enquiries', count: stats.enquiries, icon: <Mail size={24} />, href: '/admin/enquiries', color: 'from-rose-500 to-rose-600', desc: 'Product & contact submissions' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#001229' }}>
      {/* Header */}
      <header style={{ background: '#001f3f', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f59e0b' }}>
              <Shield size={20} style={{ color: '#001f3f' }} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Vikamusk Admin</h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
              View Site →
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Manage your website content, products, and career postings.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group">
              <div
                className="rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: '#001f3f', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                    {card.icon}
                  </div>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {loading ? <Loader2 size={20} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} /> : card.count}
                </div>
                <div className="font-semibold text-sm text-white mb-1">{card.title}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl p-8" style={{ background: '#001f3f', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-bold text-lg mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Add Category', href: '/admin/categories', icon: <FolderTree size={18} /> },
              { label: 'Add Product', href: '/admin/products', icon: <Package size={18} /> },
              { label: 'Add Job Posting', href: '/admin/careers', icon: <Briefcase size={18} /> },
              { label: 'View Enquiries', href: '/admin/enquiries', icon: <Mail size={18} /> },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all group"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span style={{ color: '#f59e0b' }}>{action.icon}</span>
                <span className="text-sm font-medium transition-colors group-hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
