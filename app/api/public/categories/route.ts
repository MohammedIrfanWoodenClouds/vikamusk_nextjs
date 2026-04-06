import { NextResponse } from 'next/server';
import { getNavCategories, getAllMainCategories, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await seedDatabase();
    
    const url = new URL(req.url);
    const nav = url.searchParams.get('nav');
    const featured = url.searchParams.get('featured');
    
    if (nav === 'true') {
      const categories = await getNavCategories();
      return NextResponse.json({ categories });
    }
    
    const categories = await getAllMainCategories(featured === 'true');
    return NextResponse.json({ categories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
