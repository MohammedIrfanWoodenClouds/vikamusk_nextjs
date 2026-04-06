import xlsx from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fbwyljchzdatcjebmvoa.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZid3lsamNoemRhdGNqZWJtdm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTQ2MjgsImV4cCI6MjA5MTA3MDYyOH0.GU_MP0kAyP3yVKuDDEZqeZxZbVewq5CspLt0KNKYmt8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function run() {
  const filePath = 'C:\\Users\\moham\\Downloads\\PRODUCT DATA SHTEET.xlsx';
  console.log(`Loading Excel file: ${filePath}`);
  
  let workbook;
  try {
    workbook = xlsx.readFile(filePath);
  } catch (err) {
    console.error('Failed to read Excel file:', err.message);
    return;
  }

  const sheetNames = workbook.SheetNames;
  let orderCat = 0;

  for (const sheetName of sheetNames) {
    console.log(`\n--- Processing Category: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    // Use header: 1 to get a 2D array of rows
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
    
    if (rows.length === 0) {
      console.log('  Empty sheet, skipping.');
      continue;
    }

    // 1. Description from first few rows
    let categoryDescription = '';
    for (let i = 0; i < Math.min(5, rows.length); i++) {
        const cell = String(rows[i][0] || '').trim();
        if (cell.length > 20) { 
          categoryDescription = cell;
          break;
        }
    }

    // 2. Insert Category
    const categoryName = sheetName.trim();
    const categorySlug = slugify(categoryName);
    
    // Check if category exists
    let { data: cat } = await supabase.from('main_categories').select('*').eq('slug', categorySlug).single();
    if (!cat) {
      const { data: newCat, error } = await supabase.from('main_categories').insert({
        name: categoryName,
        slug: categorySlug,
        description: categoryDescription,
        sort_order: orderCat++
      }).select().single();
      
      if (error) {
        console.error(`  Error creating category ${categoryName}:`, error.message);
        continue;
      }
      cat = newCat;
      console.log(`  Created Category: ${cat.name}`);
    } else {
      console.log(`  Category already exists: ${cat.name}`);
    }

    // 3. Find the Model header row
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(15, rows.length); i++) {
      const cell = String(rows[i][0] || '').trim().toLowerCase();
      if (cell.includes('model') || cell.includes('number') || cell.includes('type')) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      // Default to row 1 if not found explicitly
      headerRowIndex = 1;
    }

    const headerRow = rows[headerRowIndex];
    if (!headerRow) {
      console.log('  Could not find header row. Skipping items.');
      continue;
    }

    // Identify columns that contain product models
    const products = []; // Array of { name, colIndex }
    let unitColIndex = -1;

    for (let c = 1; c < headerRow.length; c++) {
      const val = String(headerRow[c] || '').trim();
      if (val.toLowerCase() === 'unit' || val.toLowerCase() === 'dimensions' || val === '') {
        if (val.toLowerCase() === 'unit') unitColIndex = c;
        continue;
      }
      products.push({ name: val, slug: slugify(val), colIndex: c, specs: {} });
    }

    if (products.length === 0) {
      console.log('  No products found in header row.');
      continue;
    }

    console.log(`  Found ${products.length} products: ${products.map(p => p.name).join(', ')}`);

    // 4. Extract Specifications
    for (let r = headerRowIndex + 1; r < rows.length; r++) {
      const row = rows[r];
      // Skip empty rows
      if (!row || row.length === 0) continue;
      
      const specName = String(row[0] || '').trim();
      if (!specName) continue; // Spec name is empty

      let specUnit = '';
      if (unitColIndex !== -1 && row[unitColIndex]) {
        specUnit = ` (${String(row[unitColIndex]).trim()})`;
      }

      const fullSpecName = `${specName}${specUnit}`;

      for (const product of products) {
        const specVal = row[product.colIndex];
        if (specVal !== undefined && specVal !== null && specVal !== '') {
          product.specs[fullSpecName] = String(specVal).trim();
        }
      }
    }

    // 5. Insert Products
    let prodOrder = 0;
    for (const p of products) {
      const { data: existingProd } = await supabase.from('products').select('*').eq('slug', p.slug).single();
      
      if (!existingProd) {
        const { error } = await supabase.from('products').insert({
          main_category_id: cat.id,
          name: p.name,
          slug: p.slug,
          full_description: categoryDescription, // Copying category description to product as per typical UI needs
          specs: JSON.stringify(p.specs),
          sort_order: prodOrder++
        });
        
        if (error) {
          console.error(`    Error creating product ${p.name}:`, error.message);
        } else {
          console.log(`    Created Product: ${p.name} with ${Object.keys(p.specs).length} specs`);
        }
      } else {
        // Update specs if exists
        const { error } = await supabase.from('products').update({
          specs: JSON.stringify(p.specs),
          main_category_id: cat.id
        }).eq('id', existingProd.id);
        
        if (error) {
          console.error(`    Error updating product ${p.name}:`, error.message);
        } else {
          console.log(`    Updated Product: ${p.name}`);
        }
      }
    }
  }

  console.log('\n✅ All data ingestion completed.');
}

run();
