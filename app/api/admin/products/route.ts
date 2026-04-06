import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllProducts, createProduct } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const subCategoryId = req.nextUrl.searchParams.get('sub_category_id');
    const products = await getAllProducts(subCategoryId || undefined);
    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const data = await req.json();
    if (!data.name || !data.slug || !data.sub_category_id) {
      return NextResponse.json({ error: 'Name, slug, and sub_category_id are required' }, { status: 400 });
    }
    // Ensure features and specs are JSON strings
    if (typeof data.features === 'object') data.features = JSON.stringify(data.features);
    if (typeof data.specs === 'object') data.specs = JSON.stringify(data.specs);
    
    const product = await createProduct(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
