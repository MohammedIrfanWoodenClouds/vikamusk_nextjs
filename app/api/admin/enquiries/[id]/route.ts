import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateEnquiry, deleteEnquiry } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;

  try {
    const body = await req.json();
    await updateEnquiry(id, body);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('PATCH enquiry error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  const { id } = await params;

  try {
    await deleteEnquiry(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('DELETE enquiry error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
