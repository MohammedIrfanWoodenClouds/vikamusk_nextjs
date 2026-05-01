import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
  const { count: catCount } = await supabase.from('main_categories').select('*', { count: 'exact', head: true });
  const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: modelCount } = await supabase.from('product_models').select('*', { count: 'exact', head: true });

  console.log(`Total Categories: ${catCount}`);
  console.log(`Total Products: ${prodCount}`);
  console.log(`Total Models: ${modelCount}`);

  const { data: cats } = await supabase.from('main_categories').select('name');
  console.log('Categories:', cats.map(c => c.name).join(', '));
}

verify();
