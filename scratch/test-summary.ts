import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const { getAllProductsSummary } = await import('../lib/db');
  
  console.log('Testing getAllProductsSummary...');
  const start = Date.now();
  const products = await getAllProductsSummary();
  console.log(`getAllProductsSummary took: ${Date.now() - start}ms`);
  console.log(`Total products returned: ${products.length}`);
  if (products.length > 0) {
    console.log('Sample slugs:', products.slice(0, 5).map(p => p.slug));
  }
}

run().catch(console.error);
