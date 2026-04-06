'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
