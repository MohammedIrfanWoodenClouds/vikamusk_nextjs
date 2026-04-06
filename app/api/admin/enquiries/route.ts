import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllEnquiries } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const enquiries = await getAllEnquiries();
    return NextResponse.json({ enquiries });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
