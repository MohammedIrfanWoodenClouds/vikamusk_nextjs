import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllSubCategories, createSubCategory } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const mainCategoryId = req.nextUrl.searchParams.get('main_category_id');
    const subCategories = await getAllSubCategories(mainCategoryId || undefined);
    return NextResponse.json({ subCategories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const data = await req.json();
    if (!data.name || !data.slug || !data.main_category_id) {
      return NextResponse.json({ error: 'Name, slug, and main_category_id are required' }, { status: 400 });
    }
    const subCategory = await createSubCategory(data);
    return NextResponse.json({ subCategory }, { status: 201 });
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'A sub-category with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
