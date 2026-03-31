import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products & Services',
  description: 'Explore Vikamusk\'s complete range of forklifts, scissor lifts, boom lifts, telehandlers and construction equipment. Reliable solutions for material handling and aerial work.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
