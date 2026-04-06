'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatedSection } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';
import { Suspense } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  category: string;
  categorySlug: string;
  sub_category_name: string;
  sub_category_slug: string;
  main_category_name: string;
  main_category_slug: string;
  image: string;
  featured: number;
  features: string;
  specs: string;
  fullDescription: string;
}

interface MainCategory {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

function normalizeProduct(p: any): any {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.main_category_name || '',
    categorySlug: p.main_category_slug || '',
    shortDescription: p.short_description || '',
    fullDescription: p.full_description || '',
    features: typeof p.features === 'string' ? (() => { try { return JSON.parse(p.features); } catch { return []; } })() : (p.features || []),
    specs: typeof p.specs === 'string' ? (() => { try { return JSON.parse(p.specs); } catch { return {}; } })() : (p.specs || {}),
    image: p.image || '',
    featured: !!p.featured,
  };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/products').then(r => r.json()),
      fetch('/api/public/categories').then(r => r.json()),
    ]).then(([prodsData, catsData]) => {
      setProducts((prodsData.products || []).map(normalizeProduct));
      setCategories(catsData.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.categorySlug === activeCategory);
  }, [activeCategory, products]);

  const totalProducts = products.length;

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Our Equipment</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-6">Products & Services</h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
              Explore our wide range of construction equipment and material handling solutions tailored to your needs.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters + Products */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          {/* Category Filter */}
          <AnimatedSection className="mb-12">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-white text-muted hover:bg-primary/5 border border-border'
                }`}
              >
                All Products ({totalProducts})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.slug ? 'bg-primary text-white shadow-lg' : 'bg-white text-muted hover:bg-primary/5 border border-border'
                  }`}
                >
                  {cat.name} ({cat.product_count || 0})
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted text-lg">No products found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <ProductsContent />
    </Suspense>
  );
}
