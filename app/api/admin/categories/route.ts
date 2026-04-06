import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllMainCategories, createMainCategory } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;
  
  try {
    const categories = await getAllMainCategories();
    return NextResponse.json({ categories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const data = await req.json();
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }
    const category = await createMainCategory(data);
    return NextResponse.json({ category }, { status: 201 });
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
