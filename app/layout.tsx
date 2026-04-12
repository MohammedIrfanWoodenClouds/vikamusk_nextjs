import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import PublicShell from '@/components/PublicShell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vikamusk International | Construction Equipment & Material Handling Solutions',
    template: '%s | Vikamusk International',
  },
  description: 'Vikamusk International — trusted supplier of advanced construction and material handling equipment. Diesel & Electric Forklifts, Scissor Lifts, Boom Lifts across UAE & beyond.',
  keywords: ['construction equipment', 'forklifts', 'scissor lifts', 'boom lifts', 'aerial work platforms', 'material handling', 'Vikamusk', 'UAE'],
  openGraph: {
    title: 'Vikamusk International | Construction Equipment & Material Handling',
    description: 'Trusted supplier of advanced construction and material handling solutions across UAE & beyond.',
    type: 'website',
    siteName: 'Vikamusk International',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="font-[var(--font-inter)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Vikamusk International',
              alternateName: 'Vikamusk Construction Equipment FZE',
              url: 'https://vikamusk.com',
              logo: 'https://vikamusk.com/images/logo.png',
              description: 'Trusted supplier of advanced construction and material handling solutions across UAE & beyond.',
              foundingDate: '2015',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  email: 'sales@vikamusk.com',
                  contactType: 'sales',
                },
              ],
              address: [
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Ajman Free Zone',
                  addressLocality: 'Ajman',
                  addressCountry: 'AE',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Bur Dubai',
                  addressLocality: 'Dubai',
                  addressCountry: 'AE',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Al Sajaa Industrial Area',
                  addressLocality: 'Sharjah',
                  addressCountry: 'AE',
                },
              ],
              sameAs: [],
            }),
          }}
        />
        <PublicShell>
          {children}
        </PublicShell>
        <Analytics />
      </body>
    </html>
  )
}
