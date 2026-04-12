import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <section className="relative pt-44 lg:pt-52 pb-16 bg-primary">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-white/60">Last updated: April 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="text-xl font-bold text-primary mb-3">1. Introduction</h2>
              <p className="text-muted leading-relaxed">
                Vikamusk International (&quot;Vikamusk,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting 
                your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal 
                information when you visit our website vikamusk.com or interact with our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">2. Information We Collect</h2>
              <p className="text-muted leading-relaxed mb-3">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted">
                <li><strong className="text-primary">Contact Information:</strong> Name, email address, phone number, and company name when you submit an enquiry form.</li>
                <li><strong className="text-primary">Usage Data:</strong> Pages visited, time spent on pages, browser type, device information, and IP address through analytics tools.</li>
                <li><strong className="text-primary">Communication Data:</strong> Records of correspondence when you contact us via email or the website.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted">
                <li>To respond to your enquiries and provide requested information about our products and services.</li>
                <li>To improve our website, products, and customer experience.</li>
                <li>To send you relevant communications about our equipment and services (with your consent).</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">4. Data Security</h2>
              <p className="text-muted leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">5. Third-Party Services</h2>
              <p className="text-muted leading-relaxed">
                We may use third-party services such as analytics tools (e.g., Vercel Analytics) and 
                email services to operate our website. These services may collect data as described in 
                their respective privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">6. Cookies</h2>
              <p className="text-muted leading-relaxed">
                Our website may use cookies and similar tracking technologies to enhance your browsing 
                experience. You can control cookie settings through your browser preferences.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">7. Your Rights</h2>
              <p className="text-muted leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your personal data.</li>
                <li>Withdraw consent for data processing at any time.</li>
                <li>Lodge a complaint with a data protection authority.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">8. Contact Us</h2>
              <p className="text-muted leading-relaxed">
                For any questions regarding this Privacy Policy, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-surface rounded-lg border border-border/50">
                <p className="text-sm text-primary font-semibold">Vikamusk International</p>
                <p className="text-sm text-muted">Email: <a href="mailto:sales@vikamusk.com" className="text-accent hover:underline">sales@vikamusk.com</a></p>
                <p className="text-sm text-muted">Address: Vikamusk Construction Equipment FZE, Ajman Free Zone, UAE</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-sm text-accent hover:underline font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
