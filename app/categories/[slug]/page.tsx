'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, ChevronRight, Loader2, Layers } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

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
      <section className="relative py-28 bg-primary overflow-hidden">
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

      {/* Sub Categories Grid */}
      <section className="section-padding bg-surface">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Browse</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3 mb-4">Sub Categories</h2>
            <p className="text-muted max-w-xl mx-auto">Select a sub-category to view available equipment.</p>
          </AnimatedSection>

          {subCategories.length === 0 ? (
            <div className="text-center py-16">
              <Layers size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-muted text-lg">No sub-categories available yet.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subCategories.map((sc: any) => (
                <StaggerItem key={sc.id}>
                  <Link
                    href={`/categories/${slug}/${sc.slug}`}
                    className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                      {sc.image && (sc.image.startsWith('data:') || sc.image.startsWith('/')) ? (
                        sc.image.startsWith('data:') ? (
                          <img src={sc.image} alt={sc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <Image src={sc.image} alt={sc.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers size={48} className="text-gray-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">{sc.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{sc.description || 'Explore available equipment in this sub-category.'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted">{sc.product_count || 0} products</span>
                        <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:text-accent group-hover:gap-2 transition-all">
                          View <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  );
}
