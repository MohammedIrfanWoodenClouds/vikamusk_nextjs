'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SplashScreen />
      <Navbar />

      <main className="min-h-screen overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
