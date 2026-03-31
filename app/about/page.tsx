import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Vikamusk | Leading Construction Equipment Provider',
  description: 'Learn about Vikamusk, a trusted provider of quality construction equipment and machinery worldwide.',
}

export default function About() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-primary mb-12">About Vikamusk</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-foreground/70">
              To provide innovative, reliable, and sustainable construction equipment solutions that empower our customers to build better, safer, and more efficient projects worldwide.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
            <p className="text-foreground/70">
              To be the world's most trusted provider of construction equipment, recognized for innovation, reliability, and commitment to customer success across all continents.
            </p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Story</h2>
          <p className="text-foreground/70 mb-4">
            Founded in 2004, Vikamusk has grown from a regional equipment provider to a global leader in construction machinery and equipment solutions. With operations in 50+ countries and a commitment to quality and innovation, we serve thousands of customers worldwide.
          </p>
          <p className="text-foreground/70">
            Our team of dedicated professionals is committed to delivering exceptional products and services that help our customers succeed.
          </p>
        </div>

        <a
          href="/"
          className="inline-block px-6 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
