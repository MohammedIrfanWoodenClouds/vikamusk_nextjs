export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Vikamusk Construction Equipment
        </h1>
        <p className="text-xl text-foreground/90 mb-8 max-w-2xl mx-auto">
          Leading provider of quality construction equipment and machinery worldwide.
          Modern, professional website - Currently under development.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/products"
            className="px-8 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            View Products
          </a>
          <a
            href="/about"
            className="px-8 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            About Us
          </a>
        </div>
      </div>
    </div>
  )
}
