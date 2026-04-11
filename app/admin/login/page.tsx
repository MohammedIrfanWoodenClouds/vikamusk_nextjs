'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Loader2, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const [username,      setUsername]      = useState('');
  const [password,      setPassword]      = useState('');
  const [showPassword,  setShowPassword]  = useState(false);
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);
  const [shaking,       setShaking]       = useState(false);
  const [focusedField,  setFocusedField]  = useState<'username' | 'password' | null>(null);
  const router = useRouter();

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid username or password.');
        triggerShake();
      }
    } catch {
      setError('Network error. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '12px 14px 12px 42px',
    borderRadius: 12, fontSize: 14,
    background: '#f9fafb', border: '1px solid #e5e7eb',
    color: '#111827', outline: 'none',
    transition: 'all 0.2s', boxSizing: 'border-box',
  };

  const getInputStyle = (field: 'username' | 'password'): React.CSSProperties => {
    const focused = focusedField === field;
    if (error) return {
      ...inputBase,
      background: '#fef2f2', border: '1px solid #fca5a5',
      boxShadow: focused ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
    };
    return {
      ...inputBase,
      ...(focused && { border: '1px solid #f59e0b', boxShadow: '0 0 0 3px rgba(245,158,11,0.12)', background: '#fff' }),
    };
  };

  /* ════════════════════════ Render ════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>

      {/* ── Left panel (decorative) ── */}
      <div
        style={{
          display: 'none',
          flex: '0 0 420px',
          background: 'linear-gradient(160deg, #1e3a5f 0%, #0f2236 60%, #0a1628 100%)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 44px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="lg-panel"
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(245,158,11,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(59,130,246,0.07)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div>
          <div style={{ position: 'relative', height: 32, width: 140 }}>
            <Image src="/images/logo.png" alt="Vikamusk" fill style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} sizes="140px" priority />
          </div>
        </div>

        {/* Centre text */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 20 }}>
            <ShieldCheck size={13} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f59e0b' }}>Secure Portal</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.25, margin: '0 0 12px' }}>
            Vikamusk<br />Admin Panel
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
            Manage products, careers, categories, and enquiries from one place.
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lock size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>SSL encrypted · Authorised users only</span>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Card */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

            {/* Amber accent bar */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #f59e0b 40%, #d97706 60%, transparent)' }} />

            <div style={{ padding: '32px 32px 28px' }}>

              {/* Logo (mobile / single-column) */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ position: 'relative', height: 28, width: 120 }}>
                  <Image src="/images/logo.png" alt="Vikamusk" fill style={{ objectFit: 'contain' }} sizes="120px" priority />
                </div>
              </div>

              {/* Heading */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: '#fffbeb', border: '1px solid #fde68a', marginBottom: 12 }}>
                  <ShieldCheck size={12} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d97706' }}>Admin Access</span>
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 6px', lineHeight: 1.2 }}>
                  Sign in to your account
                </h1>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Vikamusk International · Admin Panel</p>
              </div>

              {/* Error */}
              {error && (
                <div
                  className={shaking ? 'animate-shake' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 20 }}
                >
                  <span style={{ color: '#ef4444', fontSize: 14, lineHeight: 1, flexShrink: 0 }}>✕</span>
                  <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>

                {/* Username */}
                <div>
                  <label htmlFor="admin-username" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 6 }}>
                    Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: error ? '#ef4444' : focusedField === 'username' ? '#f59e0b' : '#9ca3af', pointerEvents: 'none', transition: 'color 0.2s' }} />
                    <input
                      id="admin-username"
                      type="text"
                      value={username}
                      onChange={e => { setUsername(e.target.value); setError(''); }}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      style={getInputStyle('username')}
                      placeholder="Enter your username"
                      required autoFocus autoComplete="username"
                      disabled={loading}
                    />
                  </div>
                  {error && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0 2px' }}>Check your username and try again.</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="admin-password" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: error ? '#ef4444' : focusedField === 'password' ? '#f59e0b' : '#9ca3af', pointerEvents: 'none', transition: 'color 0.2s' }} />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...getInputStyle('password'), paddingRight: 44 }}
                      placeholder="Enter your password"
                      required autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: showPassword ? '#f59e0b' : '#9ca3af', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {error && <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0 2px' }}>Check your password and try again.</p>}
                </div>

                {/* Forgot password */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotMsg(!showForgotMsg)}
                    style={{ fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: showForgotMsg ? '#f59e0b' : '#9ca3af', transition: 'color 0.15s', textDecoration: 'underline', textUnderlineOffset: 3 }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Forgot message */}
                {showForgotMsg && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <KeyRound size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                      Contact your system administrator to reset your credentials or regain access.
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !username.trim() || !password}
                  style={{
                    width: '100%', padding: '13px 0', borderRadius: 12,
                    fontWeight: 700, fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    border: 'none', cursor: loading || !username.trim() || !password ? 'not-allowed' : 'pointer',
                    background: loading || !username.trim() || !password ? '#fde68a' : '#f59e0b',
                    color: '#78350f',
                    boxShadow: loading || !username.trim() || !password ? 'none' : '0 6px 18px rgba(245,158,11,0.35)',
                    transition: 'all 0.2s',
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => { if (!loading && username.trim() && password) e.currentTarget.style.background = '#d97706'; }}
                  onMouseLeave={(e) => { if (!loading && username.trim() && password) e.currentTarget.style.background = '#f59e0b'; }}
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 32px', borderTop: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <p style={{ fontSize: 11, color: '#d1d5db', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Lock size={10} style={{ color: '#10b981' }} /> SSL encrypted · Authorised users only
              </p>
              <a
                href="/"
                style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
              >
                <ArrowLeft size={12} /> Back to website
              </a>
            </div>
          </div>

          {/* Below-card hint */}
          <p style={{ textAlign: 'center', fontSize: 11, color: '#d1d5db', marginTop: 20 }}>
            Protected area · Vikamusk International
          </p>
        </div>
      </div>

      {/* Responsive: show left panel on large screens */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
