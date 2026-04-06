'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Loader2 } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';

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

export default function SubCategoryPage() {
  const { slug, subSlug } = useParams<{ slug: string; subSlug: string }>();
  const [subCategory, setSubCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/subcategories/${subSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.subCategory) {
          setSubCategory(data.subCategory);
          setProducts((data.products || []).map(normalizeProduct));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [subSlug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><Loader2 size={32} className="animate-spin text-accent" /></div>;

  if (!subCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-4xl font-black text-primary mb-4">Sub-Category Not Found</h1>
          <p className="text-muted mb-6">The sub-category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="btn-primary">View All Products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 bg-primary overflow-hidden">
        {subCategory.image && (
          <div className="absolute inset-0 opacity-15">
            {subCategory.image.startsWith('data:') ? (
              <img src={subCategory.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <Image src={subCategory.image} alt="" fill className="object-cover" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/products" className="hover:text-white/70 transition-colors">Products</Link>
              <ChevronRight size={14} />
              <Link href={`/categories/${subCategory.main_category_slug}`} className="hover:text-white/70 transition-colors">{subCategory.main_category_name}</Link>
              <ChevronRight size={14} />
              <span className="text-white/70">{subCategory.name}</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">{subCategory.name}</h1>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">
              {subCategory.description || `Browse ${subCategory.name} products from Vikamusk International.`}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-accent uppercase tracking-wider">Equipment</span>
                <h2 className="text-3xl font-black text-primary mt-2">{products.length} Products</h2>
              </div>
              <Link href={`/categories/${slug}`} className="btn-outline text-sm py-2.5 px-5 hidden sm:inline-flex">
                ← Back to {subCategory.main_category_name}
              </Link>
            </div>
          </AnimatedSection>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg mb-4">No products in this sub-category yet.</p>
              <Link href="/products" className="btn-primary">Browse All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
