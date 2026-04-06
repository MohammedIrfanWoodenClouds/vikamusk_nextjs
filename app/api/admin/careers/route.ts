import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllCareers, createCareer } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const careers = await getAllCareers();
    return NextResponse.json({ careers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const data = await req.json();
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (typeof data.requirements === 'object') data.requirements = JSON.stringify(data.requirements);
    if (typeof data.benefits === 'object') data.benefits = JSON.stringify(data.benefits);
    
    const career = await createCareer(data);
    return NextResponse.json({ career }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
