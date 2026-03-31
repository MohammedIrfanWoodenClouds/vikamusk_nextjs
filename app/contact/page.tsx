import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Vikamusk | Get in Touch',
  description: 'Contact Vikamusk for inquiries about our construction equipment and services.',
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-primary mb-8 text-center">Contact Us</h1>
        
        <div className="bg-card p-8 rounded-lg border border-border mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-primary mb-2">Email</h3>
              <p className="text-foreground/70">contact@vikamusk.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Phone</h3>
              <p className="text-foreground/70">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Address</h3>
              <p className="text-foreground/70">123 Industrial Ave, Global City</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Hours</h3>
              <p className="text-foreground/70">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-8 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Contact Form</h2>
          <p className="text-foreground/70 mb-4">
            Contact form integration coming soon. Please use the email or phone details above to reach us.
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
