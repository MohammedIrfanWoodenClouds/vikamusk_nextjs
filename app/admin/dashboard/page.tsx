'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FolderTree, Package, Briefcase, LogOut, Layers, ChevronRight, Loader2, Shield } from 'lucide-react';

interface Stats {
  categories: number;
  subCategories: number;
  products: number;
  careers: number;
}

function useAdminAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) {
      router.push('/admin/login');
      return;
    }
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
  const [stats, setStats] = useState<Stats>({ categories: 0, subCategories: 0, products: 0, careers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/admin/categories', { headers }).then(r => r.json()),
      fetch('/api/admin/subcategories', { headers }).then(r => r.json()),
      fetch('/api/admin/products', { headers }).then(r => r.json()),
      fetch('/api/admin/careers', { headers }).then(r => r.json()),
    ]).then(([cats, subs, prods, careers]) => {
      setStats({
        categories: cats.categories?.length || 0,
        subCategories: subs.subCategories?.length || 0,
        products: prods.products?.length || 0,
        careers: careers.careers?.length || 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }

  const cards = [
    { title: 'Main Categories', count: stats.categories, icon: <FolderTree size={24} />, href: '/admin/categories', color: 'from-blue-500 to-blue-600', desc: 'Manage top-level product categories' },
    { title: 'Sub Categories', count: stats.subCategories, icon: <Layers size={24} />, href: '/admin/subcategories', color: 'from-purple-500 to-purple-600', desc: 'Organize products into sub-groups' },
    { title: 'Products', count: stats.products, icon: <Package size={24} />, href: '/admin/products', color: 'from-emerald-500 to-emerald-600', desc: 'Add and manage equipment listings' },
    { title: 'Career Postings', count: stats.careers, icon: <Briefcase size={24} />, href: '/admin/careers', color: 'from-amber-500 to-amber-600', desc: 'Manage job openings and postings' },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Sidebar-style top bar */}
      <header className="bg-[#0f1d32] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Shield size={20} className="text-[#001f3f]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Vikamusk Admin</h1>
              <p className="text-white/30 text-xs">Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              View Site →
            </Link>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all text-sm font-medium">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Dashboard</h2>
          <p className="text-white/40">Manage your website content, products, and career postings.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group">
              <div className="bg-[#0f1d32] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                    {card.icon}
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {loading ? <Loader2 size={24} className="animate-spin text-white/30" /> : card.count}
                </div>
                <div className="text-white/70 font-semibold text-sm mb-1">{card.title}</div>
                <div className="text-white/30 text-xs">{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0f1d32] border border-white/5 rounded-2xl p-8">
          <h3 className="text-white font-bold text-lg mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Add Category', href: '/admin/categories', icon: <FolderTree size={18} /> },
              { label: 'Add Sub Category', href: '/admin/subcategories', icon: <Layers size={18} /> },
              { label: 'Add Product', href: '/admin/products', icon: <Package size={18} /> },
              { label: 'Add Job Posting', href: '/admin/careers', icon: <Briefcase size={18} /> },
            ].map((action) => (
              <Link key={action.label} href={action.href} className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 transition-all group">
                <span className="text-amber-500">{action.icon}</span>
                <span className="text-white/70 group-hover:text-white text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
