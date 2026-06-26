const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Fetching main_categories...');
  try {
    const start = Date.now();
    const { data, error } = await supabase
      .from('main_categories')
      .select('id, name, slug, image, sort_order, products(id, name, slug, sort_order)')
      .order('sort_order', { ascending: true });

    const elapsed = Date.now() - start;
    console.log(`Query took ${elapsed}ms`);

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      console.log('Success! Found categories:', data?.length);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Exception caught:', err);
  }
}

test();
