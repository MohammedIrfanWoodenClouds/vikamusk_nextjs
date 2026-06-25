import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getModelsByProduct, getRelatedProductsSummary } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import Loading from './loading';

export const revalidate = 60; // ISR every 60 seconds

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const models = await getModelsByProduct(product.id);
  
  let relatedProducts: any[] = [];
  if (product.main_category_id) {
    relatedProducts = await getRelatedProductsSummary(product.main_category_id, slug, 3);
  }

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
