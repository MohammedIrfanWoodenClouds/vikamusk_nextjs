'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060f1e] p-5">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-amber-500/6 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-blue-600/5 blur-[120px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-[460px]">

        {/* Subtle outer border glow */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/12 via-white/5 to-white/3 pointer-events-none" />

        <div className="relative bg-[#0d1b2e] border border-white/10 rounded-2xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.7)]">
          {/* Top accent */}
          <div className="h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />

          <div className="px-10 pt-10 pb-8">

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative h-9 w-[150px]">
                <Image
                  src="/images/logo.png"
                  alt="Vikamusk"
                  fill
                  className="object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  sizes="150px"
                  priority
                />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <ShieldCheck size={12} className="text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Admin Access</span>
              </div>
              <h1 className="text-[22px] font-black text-white tracking-tight leading-tight">
                Sign in to your account
              </h1>
              <p className="text-white/40 text-sm mt-2">Vikamusk International · Admin Panel</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="admin-username" className="block text-[11px] font-bold text-white/50 uppercase tracking-widest">
                  Username
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    id="admin-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-amber-500/60 focus:bg-white/[0.07] transition-all"
                    placeholder="Enter your username"
                    required
                    autoFocus
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="admin-password" className="block text-[11px] font-bold text-white/50 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-amber-500/60 focus:bg-white/[0.07] transition-all"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#060f1e] font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

          </div>

          {/* Card footer */}
          <div className="px-10 py-5 border-t border-white/5 text-center space-y-3">
            <p className="text-white/25 text-xs leading-relaxed">
              Secured admin access only. Unauthorized access is strictly prohibited.
            </p>
            <a href="/" className="inline-block text-white/35 hover:text-white/70 text-xs transition-colors">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
