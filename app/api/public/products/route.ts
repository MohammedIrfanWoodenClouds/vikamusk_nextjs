import { NextResponse } from 'next/server';
import { getAllProducts, getFeaturedProducts, getProductsByMainCategory, getProductBySlug, getModelsByProduct, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await seedDatabase();

    const url = new URL(req.url);
    const featured = url.searchParams.get('featured');
    const mainCategory = url.searchParams.get('main_category');
    const slug = url.searchParams.get('slug');

    if (slug) {
      const product = await getProductBySlug(slug);
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      const models = await getModelsByProduct(product.id);
      return NextResponse.json({ product, models });
    }

    if (featured === 'true') {
      const products = await getFeaturedProducts();
      return NextResponse.json({ products });
    }

    if (mainCategory) {
      const products = await getProductsByMainCategory(mainCategory);
      return NextResponse.json({ products });
    }

    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
