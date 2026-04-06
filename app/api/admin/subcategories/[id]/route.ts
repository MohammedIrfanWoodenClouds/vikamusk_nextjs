import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getSubCategoryById, updateSubCategory, deleteSubCategory } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    const subCategory = await getSubCategoryById(id);
    if (!subCategory) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ subCategory });
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
    await updateSubCategory(id, data);
    const updated = await getSubCategoryById(id);
    return NextResponse.json({ subCategory: updated });
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'A sub-category with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    await deleteSubCategory(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
