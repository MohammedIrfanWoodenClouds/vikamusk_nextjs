import { NextResponse } from 'next/server';
import { getAllCareers, seedDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await seedDatabase();
    const careers = await getAllCareers(true); // active only
    return NextResponse.json({ careers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
