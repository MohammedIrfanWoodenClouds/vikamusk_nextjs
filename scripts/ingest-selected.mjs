import xlsx from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase URL or Key in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const CATEGORY_MAP = {
  'Mantall Telescopic': 'MANTALL',
  'Mantall articulated': 'MANTALL',
  'Koosen Articulated': 'KOOSEN',
  'RuntX Scissor Lift': 'RUNTX'
};

const IMAGE_MAP = {
  'mantall-telescopic': '/images/products/selected/mantall-telescopic.png',
  'mantall-articulated': '/images/products/selected/mantall-articulated.png',
  'koosen-articulated': '/images/products/selected/koosen-articulated.png',
  'runtx-scissor-lift': '/images/products/selected/runtx-scissor-lift.png'
};

async function ensureCategory(name) {
  const slug = slugify(name);
  let { data: cat } = await supabase.from('main_categories').select('*').eq('slug', slug).single();
  
  if (!cat) {
    console.log(`Creating Category: ${name}`);
    const { data: newCat, error } = await supabase.from('main_categories').insert({
      name: name,
      slug: slug,
      sort_order: 10 // after LTMG
    }).select().single();
    
    if (error) {
      console.error(`Error creating category ${name}:`, error.message);
      return null;
    }
    cat = newCat;
  }
  return cat;
}

async function run() {
  const filePath = 'C:\\Users\\moham\\Downloads\\PRODUCT DATA SHTEET.xlsx';
  console.log(`Loading Excel file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error("File not found!");
    process.exit(1);
  }

  let workbook;
  try {
    workbook = xlsx.readFile(filePath);
  } catch (err) {
    console.error('Failed to read Excel file:', err.message);
    return;
  }

  const sheetNames = workbook.SheetNames;
  const targetSheets = Object.keys(CATEGORY_MAP);
  const targetCategoryNames = [...new Set(Object.values(CATEGORY_MAP))];

  console.log(`Cleaning up existing data for categories: ${targetCategoryNames.join(', ')}...`);
  const { data: targetCats } = await supabase.from('main_categories').select('id').in('name', targetCategoryNames);
  if (targetCats && targetCats.length > 0) {
    const catIds = targetCats.map(c => c.id);
    const { data: prodsToDelete } = await supabase.from('products').select('id').in('main_category_id', catIds);
    if (prodsToDelete && prodsToDelete.length > 0) {
      const pIds = prodsToDelete.map(p => p.id);
      await supabase.from('product_models').delete().in('product_id', pIds);
      await supabase.from('products').delete().in('id', pIds);
      console.log(`  Deleted ${pIds.length} products and their models.`);
    }
  }

  for (const sheetName of sheetNames) {
    if (!targetSheets.includes(sheetName)) continue;

    console.log(`\n--- Processing Selected Sheet: ${sheetName} ---`);
    const categoryName = CATEGORY_MAP[sheetName];
    const cat = await ensureCategory(categoryName);
    if (!cat) continue;

    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
    
    if (rows.length === 0) continue;

    const prodSlug = slugify(sheetName);
    const prodImage = IMAGE_MAP[prodSlug] || '';
    
    // Row 0 is often the Product Name
    const productName = (rows[0] && rows[0][0]) ? String(rows[0][0]).trim() : sheetName;

    // Extract features from Row 2
    let descriptionText = '';
    let featuresArray = [];
    
    // Check Row 2 specifically as it seemed to contain features in my inspection
    const row2Cell = rows[2] ? String(rows[2][0] || '').trim() : '';
    if (row2Cell) {
        // Features are often bulleted or numbered
        if (row2Cell.includes('*') || row2Cell.includes('\r\n') || /^\d+\./.test(row2Cell)) {
            featuresArray = row2Cell.split(/\r?\n|\*/).map(f => f.trim()).filter(f => f.length > 5);
            descriptionText = row2Cell.split(/\r?\n/)[0]; // Use first line as description
        } else {
            descriptionText = row2Cell;
        }
    }

    // Find the Model/Specification header row
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(20, rows.length); i++) {
      const cell = String(rows[i][0] || '').trim().toLowerCase();
      if (cell === 'model' || cell.includes('model number') || cell.includes('model no') || cell === 'specification') {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.log('  Could not find header row (Model/Specification). Skipping.');
      continue;
    }

    const headerRow = rows[headerRowIndex];
    if (!headerRow) continue;

    // Identify models (columns)
    const modelsInfo = [];
    let unitColIndex = -1;

    for (let c = 1; c < headerRow.length; c++) {
      const val = String(headerRow[c] || '').trim();
      if (!val) continue;
      if (val.toLowerCase() === 'unit' || val === '-') {
        unitColIndex = c;
        continue;
      }
      modelsInfo.push({ name: val, colIndex: c });
    }

    if (modelsInfo.length === 0) {
      console.log('  No models found in header row.');
      continue;
    }

    console.log(`  Category: ${categoryName}, Product: ${productName}, Models: ${modelsInfo.length}`);

    // Create or Update Product
    let { data: existingProd } = await supabase.from('products').select('*').eq('slug', prodSlug).single();
    let product;

    if (!existingProd) {
      const { data: newProd, error: prodErr } = await supabase.from('products').insert({
        main_category_id: cat.id,
        name: productName,
        slug: prodSlug,
        short_description: descriptionText.substring(0, 150).trim() || `${sheetName} series`,
        full_description: descriptionText.trim(),
        features: JSON.stringify(featuresArray),
        specs: '[]',
        image: prodImage,
        sort_order: 0
      }).select().single();

      if (prodErr) {
        console.error(`  Failed to create product:`, prodErr.message);
        continue;
      }
      product = newProd;
    } else {
      const { data: updatedProd, error: prodErr } = await supabase.from('products').update({
        main_category_id: cat.id,
        name: productName,
        short_description: descriptionText.substring(0, 150).trim() || `${sheetName} series`,
        full_description: descriptionText.trim(),
        features: JSON.stringify(featuresArray),
        image: prodImage
      }).eq('id', existingProd.id).select().single();
      
      if (prodErr) {
        console.error(`  Failed to update product:`, prodErr.message);
        continue;
      }
      product = updatedProd;
    }

    // Clear existing models for this product to prevent duplicates
    await supabase.from('product_models').delete().eq('product_id', product.id);

    // Parse specs for each model
    let modelOrder = 0;
    for (const model of modelsInfo) {
      const specsList = [];

      for (let r = headerRowIndex + 1; r < rows.length; r++) {
         const row = rows[r];
         if (!row || row.length === 0) continue;
         
         const rawLabel = String(row[0] || '').trim();
         if (!rawLabel) continue;

         let specUnit = '';
         if (unitColIndex !== -1 && row[unitColIndex]) {
            const u = String(row[unitColIndex]).trim();
            if (u && u !== '-') specUnit = ` (${u})`;
         }

         const specLabel = `${rawLabel}${specUnit}`;
         const specVal = row[model.colIndex] !== null && row[model.colIndex] !== undefined ? String(row[model.colIndex]).trim() : '';
         
         if (specVal !== '') {
             specsList.push({ label: specLabel, value: specVal });
         } else {
             // Check if it's a header (no values in any model column)
             const hasAnyValue = modelsInfo.some(m => row[m.colIndex] !== null && String(row[m.colIndex]).trim() !== '');
             if (!hasAnyValue) {
                specsList.push({ label: `--- ${specLabel.toUpperCase()} ---`, value: '' });
             }
         }
      }

      const { error: modErr } = await supabase.from('product_models').insert({
         product_id: product.id,
         model_name: model.name,
         specs: specsList,
         features: featuresArray, // Assigning same features to models as well for easier display
         sort_order: modelOrder++
      });

      if (modErr) {
         console.error(`    Error adding model ${model.name}:`, modErr.message);
      } else {
         console.log(`    Added Model: ${model.name} (${specsList.length} specs)`);
      }
    }
  }

  console.log('\n✅ Selected products ingestion finished!');
}

run();
