import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SplashScreen from '@/components/SplashScreen'
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
  description: 'Vikamusk International — trusted supplier of advanced construction and material handling equipment. Diesel & Electric Forklifts, Scissor Lifts, Boom Lifts across UAE, India & beyond.',
  keywords: ['construction equipment', 'forklifts', 'scissor lifts', 'boom lifts', 'aerial work platforms', 'material handling', 'Vikamusk', 'UAE', 'India'],
  openGraph: {
    title: 'Vikamusk International | Construction Equipment & Material Handling',
    description: 'Trusted supplier of advanced construction and material handling solutions across UAE, India & beyond.',
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
    <html lang="en" className={inter.variable}>
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
              description: 'Trusted supplier of advanced construction and material handling solutions across UAE, India & beyond.',
              foundingDate: '2015',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  email: 'sales@vikamusk.com',
                  contactType: 'sales',
                },
                {
                  '@type': 'ContactPoint',
                  email: 'info@vikamusk.com',
                  contactType: 'customer service',
                },
              ],
              address: [
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Ajman Free Zone, Sheikh Rashid Bin Saeed Al Maktoum St',
                  addressLocality: 'Ajman',
                  addressCountry: 'AE',
                  postalCode: '932',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Shanmugham Rd, Marine Drive',
                  addressLocality: 'Kochi',
                  addressRegion: 'Kerala',
                  addressCountry: 'IN',
                  postalCode: '682031',
                },
              ],
              sameAs: [],
            }),
          }}
        />
        <SplashScreen />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
