'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, ChevronRight, Loader2, Package } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import ProductCard from '@/components/ProductCard';
import { Suspense } from 'react';

export default function MainCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/categories/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.category) {
          setCategory(data.category);
          setSubCategories(data.subCategories || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><Loader2 size={32} className="animate-spin text-accent" /></div>;

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-4xl font-black text-primary mb-4">Category Not Found</h1>
          <p className="text-muted mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="btn-primary">View All Products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 lg:pt-52 pb-28 bg-primary overflow-hidden">
        {category.image && (
          <div className="absolute inset-0 opacity-15">
            {category.image.startsWith('data:') ? (
              <img src={category.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <Image src={category.image} alt="" fill className="object-cover" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/products" className="hover:text-white/70 transition-colors">Products</Link>
              <ChevronRight size={14} />
              <span className="text-white/70">{category.name}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              {category.icon && <span className="text-4xl">{category.icon}</span>}
              <h1 className="text-4xl lg:text-5xl font-black text-white">{category.name}</h1>
            </div>
            <p className="text-white/60 max-w-xl text-lg leading-relaxed">{category.description}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Explore</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">Equipment</h2>
            <p className="text-muted max-w-2xl mx-auto">
              {slug?.toLowerCase() === 'ltmg' 
                ? 'Vikamusk Construction Equipment is the Authorized Distributor of LTMG Machinery in the UAE — Operations to Middle East & India.'
                : `Browse our full range of ${category.name} available for your project.`
              }
            </p>
          </AnimatedSection>
          
          <Suspense fallback={<div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-accent" /></div>}>
            <CategoryProductsGrid categorySlug={slug} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function CategoryProductsGrid({ categorySlug }: { categorySlug: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/products?main_category=${categorySlug}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-accent" /></div>;

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-muted text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p: any, i: number) => (
        <StaggerItem key={p.id}>
          <ProductCard product={normalizeProduct(p)} index={i} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

function normalizeProduct(p: any): any {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.main_category_name || '',
    categorySlug: p.main_category_slug || '',
    shortDescription: p.short_description || '',
    image: p.image || '',
    featured: !!p.featured,
    specs: typeof p.specs === 'string' ? (() => { try { return JSON.parse(p.specs); } catch { return {}; } })() : (p.specs || {}),
  };
}
