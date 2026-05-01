import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    const data = await req.json();
    if (typeof data.features === 'string') {
      try { data.features = JSON.parse(data.features); } catch {}
    }
    if (typeof data.specs === 'string') {
      try { data.specs = JSON.parse(data.specs); } catch {}
    }
    
    await updateProduct(id, data);
    const updated = await getProductById(id);
    return NextResponse.json({ product: updated });
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
