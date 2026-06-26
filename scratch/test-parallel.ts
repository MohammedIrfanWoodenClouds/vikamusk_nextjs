import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('--- WARMING UP CONNECTION ---');
  await supabase.from('products').select('id').limit(1);

  console.log('\n--- STEP 1: Fetching Product, Category, and Models in 1 query ---');
  const startProd = Date.now();
  const { data: product, error: prodErr } = await supabase
    .from('products')
    .select('*, main_categories(name, slug), product_models(*)')
    .eq('slug', 'electric-scissor-lift')
    .single();

  if (prodErr || !product) {
    console.error('Failed to fetch product:', prodErr);
    return;
  }
  console.log(`Product fetch took: ${Date.now() - startProd}ms`);
  console.log(`Product Name: ${product.name}`);
  console.log(`Category: ${product.main_categories?.name}`);
  console.log(`Models count: ${product.product_models?.length}`);

  console.log('\n--- STEP 2: Fetching Related Products in 1 query ---');
  const startRel = Date.now();
  const { data: related, error: relErr } = await supabase
    .from('products')
    .select('id, name, slug, short_description, image, featured, main_category_id, specs, main_categories(name, slug), product_models(model_name, sort_order)')
    .eq('main_category_id', product.main_category_id)
    .neq('slug', product.slug)
    .order('sort_order', { ascending: true })
    .limit(3);

  if (relErr) {
    console.error('Failed to fetch related:', relErr);
    return;
  }
  console.log(`Related fetch took: ${Date.now() - startRel}ms`);
  console.log(`Related count: ${related?.length}`);

  console.log(`\nTotal time with nested queries: ${Date.now() - startProd}ms`);
}

run().catch(console.error);
