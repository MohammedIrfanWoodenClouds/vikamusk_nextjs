import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Vikamusk International for construction equipment enquiries. Office in Ajman Free Zone UAE. Email sales@vikamusk.com.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
