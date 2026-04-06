import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCareerById, updateCareer, deleteCareer } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    const career = await getCareerById(id);
    if (!career) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ career });
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
    if (typeof data.requirements === 'object') data.requirements = JSON.stringify(data.requirements);
    if (typeof data.benefits === 'object') data.benefits = JSON.stringify(data.benefits);
    
    await updateCareer(id, data);
    const updated = await getCareerById(id);
    return NextResponse.json({ career: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;
  try {
    await deleteCareer(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
