import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Founded in 2015, Vikamusk International is a trusted supplier of advanced construction and material handling solutions across UAE, India, China and beyond.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
