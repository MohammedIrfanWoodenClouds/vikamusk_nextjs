import { NextResponse } from 'next/server';
import { getMainCategoryBySlug, getAllSubCategories, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await seedDatabase();
    const { slug } = await params;
    
    const category = await getMainCategoryBySlug(slug);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    
    const catObj = category as any;
    const subCategories = await getAllSubCategories(catObj.id);
    
    return NextResponse.json({ category, subCategories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
