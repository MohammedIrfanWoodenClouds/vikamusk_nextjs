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

      <main 
        className={`min-h-screen overflow-x-hidden ${pathname === '/' ? 'pt-0' : 'pt-[160px] lg:pt-[160px]'}`}
      >
        {children}
      </main>
      <div className={pathname === '/' ? '' : 'mt-16 lg:mt-24'}>
        <Footer />
      </div>
    </>
  );
}
