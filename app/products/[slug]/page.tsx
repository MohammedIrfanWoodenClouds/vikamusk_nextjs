import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getModelsByProduct, getRelatedProductsSummary, getAllProductsSummary } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import Loading from './loading';

export const revalidate = 60; // ISR every 60 seconds

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const [models, relatedProducts] = await Promise.all([
    getModelsByProduct(product.id),
    product.main_category_id
      ? getRelatedProductsSummary(product.main_category_id, slug, 3)
      : Promise.resolve([])
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <ProductDetailClient 
        initialProduct={product} 
        initialModels={models} 
        initialRelated={relatedProducts} 
      />
    </Suspense>
  );
}

export async function generateStaticParams() {
  const products = await getAllProductsSummary();
  return products.map((p) => ({
    slug: p.slug,
  }));
}
