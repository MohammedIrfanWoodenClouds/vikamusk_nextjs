export default function Products() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-primary mb-12">Our Products</h1>
        <div className="bg-card p-8 rounded-lg border border-border">
          <p className="text-foreground/70 mb-4">
            Product catalog coming soon. We offer a wide range of construction equipment including:
          </p>
          <ul className="space-y-2 text-foreground/70">
            <li>• Forklifts</li>
            <li>• Excavators</li>
            <li>• Loaders</li>
            <li>• Dumpers</li>
            <li>• Rollers</li>
            <li>• Telehandlers</li>
          </ul>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
