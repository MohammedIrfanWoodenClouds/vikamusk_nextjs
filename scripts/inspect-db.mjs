import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
  const slugs = [
    'articulated-boomlift-electric',
    'electric-reach-trucks',
    'articulated-boomlift-diesel'
  ];

  let output = '';
  const log = (msg) => {
    output += msg + '\n';
    console.log(msg);
  };

  for (const slug of slugs) {
    log(`\n=========================================`);
    log(`PRODUCT: ${slug}`);
    log(`=========================================`);

    const { data: product, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (prodErr) {
      log(`Error fetching product ${slug}: ${prodErr.message}`);
      continue;
    }

    log(`ID: ${product.id}`);
    log(`Name: ${product.name}`);

    const { data: models, error: modErr } = await supabase
      .from('product_models')
      .select('*')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true });

    if (modErr) {
      log(`Error fetching models for ${slug}: ${modErr.message}`);
      continue;
    }

    log(`Models found: ${models.map(m => m.model_name).join(', ')}`);

    for (const model of models) {
      log(`\n--- Model: ${model.model_name} (ID: ${model.id}) ---`);
      log(JSON.stringify(model.specs, null, 2));
    }
  }

  fs.writeFileSync('scripts/inspect-db.txt', output, 'utf-8');
  console.log('Saved to scripts/inspect-db.txt');
}

inspect();
