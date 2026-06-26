import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Get the actual product's category ID
  const { data: product } = await supabase
    .from('products')
    .select('main_category_id')
    .eq('slug', 'electric-scissor-lift')
    .single();

  if (!product || !product.main_category_id) {
    console.error('Test product or its category ID not found');
    return;
  }

  const categoryId = product.main_category_id;
  console.log(`Testing related products query for category ID: ${categoryId}`);

  const start = Date.now();
  // Fetch products with their category and models in one query
  const { data: prods, error } = await supabase
    .from('products')
    .select('id, name, slug, short_description, image, featured, main_category_id, specs, main_categories(name, slug), product_models(model_name, sort_order)')
    .eq('main_category_id', categoryId)
    .neq('slug', 'electric-scissor-lift')
    .limit(3);

  if (error) {
    console.error('Related query failed:', error);
    return;
  }

  console.log(`Related query took: ${Date.now() - start}ms`);
  console.log('Results returned:', prods?.length);
  if (prods && prods[0]) {
    console.log('First related product name:', prods[0].name);
    console.log('First related product category name:', (prods[0].main_categories as any)?.name);
    console.log('First related product models count:', (prods[0].product_models as any)?.length);
  }
}

run().catch(console.error);
