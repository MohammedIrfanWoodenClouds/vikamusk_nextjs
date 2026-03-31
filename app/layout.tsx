import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
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
