import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllProducts, createProduct } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const mainCategoryId = req.nextUrl.searchParams.get('main_category_id');
    const products = await getAllProducts(mainCategoryId || undefined);
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
    if (!data.name || !data.slug || !data.main_category_id) {
      return NextResponse.json({ error: 'Name, slug, and main_category_id are required' }, { status: 400 });
    }
    // Ensure features and specs are handled as objects for jsonb
    if (typeof data.features === 'string') {
      try { data.features = JSON.parse(data.features); } catch {}
    }
    if (typeof data.specs === 'string') {
      try { data.specs = JSON.parse(data.specs); } catch {}
    }
    
    const product = await createProduct(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
