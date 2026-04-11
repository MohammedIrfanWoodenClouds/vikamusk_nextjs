'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FolderTree, Package, Briefcase, LogOut, LayoutGrid, Loader2,
  Shield, Mail, LayoutDashboard, Plus, Clock, ExternalLink,
  ArrowUpRight, ChevronRight, Inbox, Globe,
} from 'lucide-react';

/* ─── Types ─── */
interface Stats {
  categories: number;
  products: number;
  models: number;
  careers: number;
  enquiries: number;
}
interface Enquiry {
  id: string;
  name: string;
  email: string;
  product?: string;
  created_at: string;
}
interface Product {
  id: string;
  name: string;
  created_at?: string;
}

/* ─── Auth hook ─── */
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

/* ─── Sidebar nav items ─── */
const NAV_LINKS = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: LayoutDashboard },
  { label: 'Products',   href: '/admin/products',   icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Models',     href: '/admin/models',     icon: LayoutGrid },
  { label: 'Careers',    href: '/admin/careers',    icon: Briefcase },
  { label: 'Enquiries',  href: '/admin/enquiries',  icon: Mail },
];

/* ─── Hover helpers (inline-style driven) ─── */
function cardEnter(e: React.MouseEvent<HTMLDivElement>, borderColor: string) {
  const el = e.currentTarget;
  el.style.transform   = 'translateY(-2px)';
  el.style.boxShadow   = '0 8px 28px rgba(0,0,0,0.10)';
  el.style.borderColor = borderColor;
}
function cardLeave(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.transform   = 'translateY(0)';
  el.style.boxShadow   = '0 1px 3px rgba(0,0,0,0.04)';
  el.style.borderColor = '#e5e7eb';
}
function actionEnter(e: React.MouseEvent<HTMLDivElement>, bg: string, border: string) {
  const el = e.currentTarget;
  el.style.background   = bg;
  el.style.borderColor  = border;
}
function actionLeave(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.background  = '#f9fafb';
  el.style.borderColor = '#f3f4f6';
}

/* ═══════════════════════════════ Component ═══════════════════════════════ */
export default function AdminDashboard() {
  const { token, loading: authLoading, logout } = useAdminAuth();
  const pathname = usePathname();

  const [stats, setStats]               = useState<Stats>({ categories: 0, products: 0, models: 0, careers: 0, enquiries: 0 });
  const [recentEnquiries, setRecentEnq] = useState<Enquiry[]>([]);
  const [recentProducts,  setRecentProd]= useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/admin/categories', { headers }).then(r => r.json()),
      fetch('/api/admin/products',   { headers }).then(r => r.json()),
      fetch('/api/admin/models',     { headers }).then(r => r.json()),
      fetch('/api/admin/careers',    { headers }).then(r => r.json()),
      fetch('/api/admin/enquiries',  { headers }).then(r => r.json()).catch(() => ({ enquiries: [] })),
    ]).then(([cats, prods, mods, careers, enqs]) => {
      setStats({
        categories: cats.categories?.length  || 0,
        products:   prods.products?.length   || 0,
        models:     mods.models?.length      || 0,
        careers:    careers.careers?.length  || 0,
        enquiries:  enqs.enquiries?.length   || 0,
      });
      setRecentEnq(
        [...(enqs.enquiries || [])]
          .sort((a: Enquiry, b: Enquiry) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4),
      );
      setRecentProd(
        [...(prods.products || [])]
          .sort((a: Product, b: Product) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 2),
      );
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  /* ── Loading screen ── */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }

  /* ── Data ── */
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const statCards = [
    { title: 'Categories',      count: stats.categories, icon: FolderTree,     href: '/admin/categories', color: '#3b82f6', bg: '#eff6ff', desc: 'Product categories' },
    { title: 'Products',        count: stats.products,   icon: Package,        href: '/admin/products',   color: '#10b981', bg: '#f0fdf4', desc: 'Equipment listings' },
    { title: 'Models',          count: stats.models,     icon: LayoutGrid,     href: '/admin/models',     color: '#8b5cf6', bg: '#f5f3ff', desc: 'Product variants' },
    { title: 'Career Postings', count: stats.careers,    icon: Briefcase,      href: '/admin/careers',    color: '#f59e0b', bg: '#fffbeb', desc: 'Job openings' },
    { title: 'Enquiries',       count: stats.enquiries,  icon: Mail,           href: '/admin/enquiries',  color: '#ef4444', bg: '#fef2f2', desc: 'Contact submissions' },
  ];

  const quickActions = [
    { label: 'Add Category',   href: '/admin/categories', icon: FolderTree, color: '#3b82f6', bg: '#eff6ff', hoverBorder: '#93c5fd' },
    { label: 'Add Product',    href: '/admin/products',   icon: Package,    color: '#10b981', bg: '#f0fdf4', hoverBorder: '#6ee7b7' },
    { label: 'Add Model',      href: '/admin/models',     icon: LayoutGrid, color: '#8b5cf6', bg: '#f5f3ff', hoverBorder: '#c4b5fd' },
    { label: 'Post a Job',     href: '/admin/careers',    icon: Briefcase,  color: '#f59e0b', bg: '#fffbeb', hoverBorder: '#fcd34d' },
    { label: 'View Enquiries', href: '/admin/enquiries',  icon: Mail,       color: '#ef4444', bg: '#fef2f2', hoverBorder: '#fca5a5' },
  ];

  /* Build activity feed: blend enquiries + products */
  const activityFeed = [
    ...recentEnquiries.map(e => ({
      id:    `enq-${e.id}`,
      label: <>New enquiry from <strong>{e.name}</strong></>,
      sub:   e.product || e.email,
      date:  e.created_at,
      icon:  Mail,
      bg:    '#fef2f2',
      color: '#ef4444',
    })),
    ...recentProducts.map(p => ({
      id:    `prod-${p.id}`,
      label: <>Product added: <strong>{p.name}</strong></>,
      sub:   'Equipment catalogue',
      date:  p.created_at || '',
      icon:  Package,
      bg:    '#f0fdf4',
      color: '#10b981',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const hasActivity = activityFeed.length > 0;

  /* ═══════════════════════ Render ═══════════════════════ */
  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>

      {/* ──────────────── Sidebar ──────────────── */}
      <aside
        style={{
          width: 232,
          flexShrink: 0,
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Shield size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', lineHeight: 1.2 }}>Vikamusk</p>
              <p style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.2 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', padding: '0 10px', marginBottom: 4 }}>
            Menu
          </p>
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#92400e' : '#6b7280',
                  background: isActive ? '#fffbeb' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: '0 3px 3px 0', background: '#f59e0b',
                  }} />
                )}
                <Icon size={16} />
                <span style={{ flex: 1 }}>{label}</span>
                {label === 'Enquiries' && stats.enquiries > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 6px',
                    borderRadius: 999, background: '#fef2f2', color: '#ef4444',
                  }}>
                    {stats.enquiries}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: view site + logout */}
        <div style={{ padding: '10px 10px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10,
              fontSize: 13, fontWeight: 500, color: '#6b7280',
              textDecoration: 'none', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#111827'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
          >
            <Globe size={16} />
            <span style={{ flex: 1 }}>View Site</span>
            <ExternalLink size={12} style={{ opacity: 0.4 }} />
          </Link>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10,
              fontSize: 13, fontWeight: 500, color: '#6b7280',
              background: 'transparent', border: 'none', cursor: 'pointer',
              width: '100%', textAlign: 'left', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ──────────────── Main area ──────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>Dashboard</h1>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0', lineHeight: 1 }}>{today}</p>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#16a34a',
            background: '#f0fdf4', border: '1px solid #dcfce7',
            padding: '5px 12px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            System Online
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 32px 40px' }}>

          {/* ── Stat cards ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 18,
            marginBottom: 28,
          }}>
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 18,
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => cardEnter(e, card.color)}
                    onMouseLeave={cardLeave}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: card.bg, color: card.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={21} />
                      </div>
                      <ArrowUpRight size={15} style={{ color: '#d1d5db', marginTop: 2 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#111827', lineHeight: 1, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
                      {loading
                        ? <Loader2 size={20} style={{ color: '#d1d5db', animation: 'spin 1s linear infinite' }} />
                        : card.count
                      }
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 2 }}>{card.title}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{card.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Bottom row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

            {/* Recent Activity */}
            <div style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={15} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Recent Activity</span>
                </div>
                <Link href="/admin/enquiries" style={{
                  fontSize: 11, fontWeight: 600, color: '#9ca3af', textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#d97706'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
                >
                  View all →
                </Link>
              </div>

              <div style={{ padding: 20 }}>
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                    <Loader2 size={20} style={{ color: '#d1d5db' }} className="animate-spin" />
                  </div>
                ) : !hasActivity ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 10px',
                    }}>
                      <Inbox size={21} style={{ color: '#9ca3af' }} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', margin: '0 0 4px' }}>No recent activity yet</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Activity will appear here as data is added</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {activityFeed.map((item) => {
                      const Icon = item.icon;
                      const dateStr = item.date
                        ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : '—';
                      return (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: item.bg, color: item.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginTop: 1,
                          }}>
                            <Icon size={14} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, color: '#374151', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.label}
                            </p>
                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.sub}
                            </p>
                          </div>
                          <span style={{ fontSize: 11, color: '#d1d5db', flexShrink: 0, paddingTop: 2 }}>{dateStr}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={15} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Quick Actions</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
                      <div
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '12px 14px', borderRadius: 12,
                          background: '#f9fafb', border: '1px solid #f3f4f6',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => actionEnter(e, action.bg, action.hoverBorder)}
                        onMouseLeave={actionLeave}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: action.bg, color: action.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={17} />
                        </div>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#374151' }}>{action.label}</span>
                        <ChevronRight size={15} style={{ color: '#d1d5db' }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
