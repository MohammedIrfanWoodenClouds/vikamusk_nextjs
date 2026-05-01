import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllModels, createProductModel } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const models = await getAllModels();
    return NextResponse.json({ models });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.authenticated) return auth.error!;

  try {
    const data = await req.json();
    if (!data.product_id || !data.model_name) {
      return NextResponse.json({ error: 'product_id and model_name are required' }, { status: 400 });
    }

    const specs = parseSpecs(data.specs || '');
    const features = parseFeatures(data.features || '');

    const model = await createProductModel({
      product_id: data.product_id,
      model_name: data.model_name,
      short_description: data.short_description || '',
      features,
      specs,
      images: Array.isArray(data.images) ? data.images : [],
      sort_order: data.sort_order ?? 0,
    });

    return NextResponse.json({ model }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function parseFeatures(str: string): string[] {
  try {
    const arr = JSON.parse(str);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return str.split('\n').map(s => s.trim()).filter(Boolean);
  }
}

function parseSpecs(str: string): { label: string; value: string }[] {
  if (Array.isArray(str)) return str;
  try {
    const arr = JSON.parse(str);
    if (Array.isArray(arr)) return arr;
  } catch {}
  return str
    .split('\n')
    .filter(line => line.includes(':'))
    .map(line => {
      const idx = line.indexOf(':');
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter(s => s.label);
}
