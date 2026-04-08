import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getModelById, updateProductModel, deleteProductModel } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    const model = await getModelById(id);
    if (!model) return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    return NextResponse.json({ model });
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

    const updateData: Record<string, any> = {};
    if (data.model_name !== undefined) updateData.model_name = data.model_name;
    if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;
    if (data.product_id !== undefined) updateData.product_id = data.product_id;
    if (Array.isArray(data.images)) updateData.images = data.images;

    if (data.specs !== undefined) {
      updateData.specs = parseSpecs(data.specs);
    }

    await updateProductModel(id, updateData);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    await deleteProductModel(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function parseFeatures(str: string): string[] {
  if (typeof str !== 'string') return Array.isArray(str) ? str : [];
  try {
    const arr = JSON.parse(str);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return str.split('\n').map(s => s.trim()).filter(Boolean);
  }
}

function parseSpecs(str: any): { label: string; value: string }[] {
  if (Array.isArray(str)) return str;
  try {
    const arr = JSON.parse(str);
    if (Array.isArray(arr)) return arr;
  } catch {}
  if (typeof str !== 'string') return [];
  return str
    .split('\n')
    .filter((line: string) => line.includes(':'))
    .map((line: string) => {
      const idx = line.indexOf(':');
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((s: any) => s.label);
}
