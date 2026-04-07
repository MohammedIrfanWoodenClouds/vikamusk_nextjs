import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getModelsByProduct, createProductModel } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    const models = await getModelsByProduct(id);
    return NextResponse.json({ models });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    const data = await req.json();
    if (!data.model_name) {
      return NextResponse.json({ error: 'model_name is required' }, { status: 400 });
    }
    const model = await createProductModel({
      product_id: id,
      model_name: data.model_name,
      specs: Array.isArray(data.specs) ? data.specs : [],
      images: Array.isArray(data.images) ? data.images : [],
      sort_order: data.sort_order ?? 0,
    });
    return NextResponse.json({ model }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
