import { NextResponse } from 'next/server';
import { getSubCategoryBySlug, getProductsBySubCategory, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await seedDatabase();
    const { slug } = await params;
    
    const subCategory = await getSubCategoryBySlug(slug);
    if (!subCategory) return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 });
    
    const products = await getProductsBySubCategory(slug);
    
    return NextResponse.json({ subCategory, products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
