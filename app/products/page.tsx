import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllMainCategories, getAllProductsSummary } from '@/lib/db';
import ProductsClient from './ProductsClient';

export const revalidate = 60; // ISR every 60 seconds

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getAllMainCategories(),
    getAllProductsSummary()
  ]);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    }>
      <ProductsClient initialCategories={categories} initialProducts={products} />
    </Suspense>
  );
}
