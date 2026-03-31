import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Vikamusk International — explore career opportunities in construction equipment, engineering, and material handling across UAE and India.',
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
