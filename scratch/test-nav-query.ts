import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Warming up connection...');
  await supabase.from('main_categories').select('id').limit(1);

  console.log('Testing optimized getNavCategories query...');
  const start = Date.now();

  const { data: cats, error } = await supabase
    .from('main_categories')
    .select('id, name, slug, image, sort_order, products(id, name, slug, sort_order)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Query failed:', error);
    return;
  }

  const duration = Date.now() - start;
  console.log(`Query took: ${duration}ms`);
  console.log(`Categories count: ${cats?.length}`);
}

run().catch(console.error);
