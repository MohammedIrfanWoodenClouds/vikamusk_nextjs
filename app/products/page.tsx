'use client'

import { useEffect, useState } from 'react'
import { sanityFetch } from '@/lib/sanity'
import { GET_ALL_PRODUCTS, GET_ALL_CATEGORIES } from '@/lib/queries'
import { Product, Category } from '@/types'
import { Hero } from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          sanityFetch<Product[]>({
            query: GET_ALL_PRODUCTS,
          }),
          sanityFetch<Category[]>({
            query: GET_ALL_CATEGORIES,
          }),
        ])

        setProducts(productsData)
        setCategories(categoriesData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.slug.current === selectedCategory
      )
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.series?.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, products])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <>
      {/* Hero Section */}
      <Hero
        subtitle="Our Catalog"
        title="Product Solutions"
        description="Browse our complete range of construction equipment and machinery"
      />

      {/* Filters and Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name, model, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-4">
                Filter by Category
              </h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-2"
              >
                <motion.button
                  variants={itemVariants}
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === null
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-primary hover:bg-slate-200'
                  }`}
                >
                  All Products
                </motion.button>

                {categories.map((category) => (
                  <motion.button
                    key={category._id}
                    variants={itemVariants}
                    onClick={() => setSelectedCategory(category.slug.current)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category.slug.current
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-primary hover:bg-slate-200'
                    }`}
                  >
                    {category.title}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Results Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? 's' : ''}
              {selectedCategory && ` in ${categories.find((c) => c.slug.current === selectedCategory)?.title}`}
            </p>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
                <p className="mt-4 text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-lg text-muted-foreground mb-4">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setSearchQuery('')
                }}
                className="px-6 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
