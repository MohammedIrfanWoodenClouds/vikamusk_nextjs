import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Support',
  description: 'Vikamusk provides comprehensive after-sales service, maintenance, spare parts supply, and technical support for all construction and material handling equipment.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
