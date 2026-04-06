import { NextResponse } from 'next/server';
import { getAllProducts, getFeaturedProducts, getProductsByMainCategory, getProductsBySubCategory, getProductBySlug, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await seedDatabase();
    
    const url = new URL(req.url);
    const featured = url.searchParams.get('featured');
    const mainCategory = url.searchParams.get('main_category');
    const subCategory = url.searchParams.get('sub_category');
    const slug = url.searchParams.get('slug');

    if (slug) {
      const product = await getProductBySlug(slug);
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ product });
    }

    if (featured === 'true') {
      const products = await getFeaturedProducts();
      return NextResponse.json({ products });
    }

    if (mainCategory) {
      const products = await getProductsByMainCategory(mainCategory);
      return NextResponse.json({ products });
    }

    if (subCategory) {
      const products = await getProductsBySubCategory(subCategory);
      return NextResponse.json({ products });
    }

    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
