import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

async function run() {
  // Dynamically import db after env is set up
  const { getProductBySlug, getModelsByProduct, getRelatedProductsSummary } = await import('../lib/db');
  
  console.log('Testing DB response times for "electric-scissor-lift"...');
  
  const startTotal = Date.now();
  
  const startProduct = Date.now();
  const product = await getProductBySlug('electric-scissor-lift');
  console.log(`getProductBySlug took: ${Date.now() - startProduct}ms`);
  
  if (!product) {
    console.log('Product not found!');
    return;
  }
  
  const startModels = Date.now();
  const models = await getModelsByProduct(product.id);
  console.log(`getModelsByProduct took: ${Date.now() - startModels}ms`);
  
  const startRelated = Date.now();
  let relatedProducts = [];
  if (product.main_category_id) {
    relatedProducts = await getRelatedProductsSummary(product.main_category_id, product.slug, 3);
  }
  console.log(`getRelatedProductsSummary took: ${Date.now() - startRelated}ms`);
  
  console.log(`Total sequential time: ${Date.now() - startTotal}ms`);
}

run().catch(console.error);
