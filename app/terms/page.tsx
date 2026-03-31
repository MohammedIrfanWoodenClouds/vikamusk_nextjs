import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <section className="py-24 lg:py-28 bg-primary">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-white/60">Last updated: April 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="text-xl font-bold text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted leading-relaxed">
                By accessing and using the Vikamusk International website (vikamusk.com), you accept and 
                agree to be bound by these Terms of Service. If you do not agree to these terms, please 
                do not use our website.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">2. Use of Website</h2>
              <p className="text-muted leading-relaxed mb-3">You agree to use this website only for lawful purposes and in a way that does not:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted">
                <li>Infringe the rights of, or restrict or inhibit the use of this website by any third party.</li>
                <li>Violate any applicable local, national, or international law or regulation.</li>
                <li>Attempt to gain unauthorized access to any part of the website or its systems.</li>
                <li>Introduce any viruses, malware, or other harmful material.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">3. Intellectual Property</h2>
              <p className="text-muted leading-relaxed">
                All content on this website, including but not limited to text, graphics, logos, images, 
                product specifications, and software, is the property of Vikamusk International or its 
                content suppliers and is protected by intellectual property laws. You may not reproduce, 
                distribute, or create derivative works from this content without our written permission.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">4. Product Information</h2>
              <p className="text-muted leading-relaxed">
                While we strive to ensure the accuracy of product information, specifications, and images 
                on this website, we do not warrant that all information is error-free. Product specifications 
                may vary. Contact our sales team for the most up-to-date and accurate product information 
                before making purchasing decisions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">5. Enquiries & Communications</h2>
              <p className="text-muted leading-relaxed">
                When you submit an enquiry through our contact form, you consent to us contacting you 
                regarding your request. We will use your information in accordance with our{' '}
                <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">6. Limitation of Liability</h2>
              <p className="text-muted leading-relaxed">
                Vikamusk International shall not be liable for any direct, indirect, incidental, or 
                consequential damages arising out of or in connection with the use of this website. 
                This website and its content are provided &quot;as is&quot; without any warranties of any kind.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">7. External Links</h2>
              <p className="text-muted leading-relaxed">
                This website may contain links to third-party websites. These links are provided for 
                your convenience only. Vikamusk International does not endorse or assume responsibility 
                for the content or practices of any linked websites.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">8. Changes to Terms</h2>
              <p className="text-muted leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be 
                effective immediately upon posting to this website. Your continued use of the website 
                following any changes constitutes acceptance of those changes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">9. Governing Law</h2>
              <p className="text-muted leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws 
                of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction 
                of the courts of the UAE.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-3">10. Contact</h2>
              <p className="text-muted leading-relaxed">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="mt-3 p-4 bg-surface rounded-lg border border-border/50">
                <p className="text-sm text-primary font-semibold">Vikamusk International</p>
                <p className="text-sm text-muted">Email: <a href="mailto:info@vikamusk.com" className="text-accent hover:underline">info@vikamusk.com</a></p>
                <p className="text-sm text-muted">Address: PO Box 932, Ajman Free Zone, UAE</p>
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
