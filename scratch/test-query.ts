import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Testing nested relation queries...');

  const start = Date.now();
  const { data, error } = await supabase
    .from('products')
    .select('*, main_categories(name, slug), product_models(*)')
    .eq('slug', 'electric-scissor-lift')
    .single();

  if (error) {
    console.error('Nested query failed:', error);
    return;
  }

  console.log(`Single nested query took: ${Date.now() - start}ms`);
  console.log('Product retrieved:', data.name);
  console.log('Category name:', data.main_categories?.name);
  console.log('Models count:', data.product_models?.length);
}

run().catch(console.error);
