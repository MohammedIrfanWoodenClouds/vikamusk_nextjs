import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateProductModel, deleteProductModel } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; modelId: string }> }
) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { modelId } = await params;
  try {
    const data = await req.json();
    await updateProductModel(modelId, {
      model_name: data.model_name,
      specs: Array.isArray(data.specs) ? data.specs : [],
      sort_order: data.sort_order ?? 0,
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; modelId: string }> }
) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { modelId } = await params;
  try {
    await deleteProductModel(modelId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
