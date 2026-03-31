import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Downloads & Brochures',
  description: 'Download Vikamusk company brochures, product catalogs, and technical specification sheets for construction and material handling equipment.',
};

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
