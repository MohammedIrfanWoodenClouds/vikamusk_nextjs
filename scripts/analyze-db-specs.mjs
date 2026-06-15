import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyze() {
  const slugs = [
    'articulated-boomlift-electric',
    'electric-reach-trucks',
    'articulated-boomlift-diesel'
  ];

  let output = '';
  const log = (msg) => {
    output += msg + '\n';
  };

  for (const slug of slugs) {
    const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (!product) continue;

    log(`\n=== PRODUCT: ${product.name} (${slug}) ===`);
    const { data: models } = await supabase
      .from('product_models')
      .select('*')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true });
    
    // Group all labels across all models
    const labelOccurrences = {};
    models.forEach(model => {
      model.specs.forEach(spec => {
        const label = spec.label;
        if (!labelOccurrences[label]) {
          labelOccurrences[label] = [];
        }
        labelOccurrences[label].push({ model: model.model_name, value: spec.value });
      });
    });

    log(`All labels and their values across models:`);
    Object.entries(labelOccurrences).forEach(([label, occurrences]) => {
      log(`Label: "${label}"`);
      occurrences.forEach(o => {
        log(`  - ${o.model}: "${o.value}"`);
      });
    });
  }

  fs.writeFileSync('scripts/analyze-db-specs.txt', output, 'utf-8');
  console.log('Saved analyze output to scripts/analyze-db-specs.txt');
}

analyze();
