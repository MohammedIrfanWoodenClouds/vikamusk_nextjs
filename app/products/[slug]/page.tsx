export default async function ProductDetail() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Product Details</h1>
        <div className="bg-card p-8 rounded-lg border border-border">
          <p className="text-foreground/70 mb-6">
            Individual product details coming soon. Each product will feature:
          </p>
          <ul className="space-y-2 text-foreground/70 mb-8">
            <li>• High-quality product images and gallery</li>
            <li>• Complete technical specifications</li>
            <li>• Detailed product description</li>
            <li>• Pricing and availability information</li>
            <li>• Related products and accessories</li>
            <li>• Contact form for inquiries</li>
          </ul>
          <a
            href="/products"
            className="inline-block px-6 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Back to Products
          </a>
        </div>
      </div>
    </div>
  )
}
