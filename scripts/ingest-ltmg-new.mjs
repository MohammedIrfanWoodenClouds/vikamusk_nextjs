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

// Map product slugs to available images
const IMAGE_MAP = {
  'electric-scissor-lift': '/images/products/electric-scissor-lift.png',
  'diesel-scissor-lift': '/images/products/diesel-scissor-lift.png',
  'telescopic-forklift': '/images/products/diesel-telehandler.png',
  'telescopic-boomlift-diesel': '/images/products/telecopic-boom-lift.png',
  'telescopic-boomlift-electric': '/images/products/telecopic-boom-lift.png',
  'articulated-boomlift-diesel': '/images/products/articulated-boom-lift.png',
  'articulated-boomlift-electric': '/images/products/articulated-boom-lift.png',
  'diesel-mini-forklift': '/images/products/diesel-mini-forklift.png',
  'electric-reach-trucks': '/images/products/reach-trucks.png',
  'electric-forklift': '/images/products/electric-forklift.png',
  'vna-forklift': '/images/products/vna-forklift.png',
  'diesel-heavy-forklift': '/images/products/diesel-heavy-forklift.png',
};

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

  const { data: cat } = await supabase.from('main_categories').select('*').eq('slug', 'ltmg').single();
  if (!cat) {
    console.error("Category 'LTMG' not found. Please create it first.");
    process.exit(1);
  }
  console.log(`Using Category: ${cat.name} (${cat.id})`);

  // Clear existing LTMG products to prevent duplicates
  console.log('Clearing existing products under LTMG...');
  const { data: existingProds } = await supabase.from('products').select('id').eq('main_category_id', cat.id);
  if (existingProds && existingProds.length > 0) {
    const prodIds = existingProds.map(p => p.id);
    await supabase.from('product_models').delete().in('product_id', prodIds);
    await supabase.from('products').delete().in('id', prodIds);
  }

  const sheetNames = workbook.SheetNames;
  let prodOrder = 0;

  for (const sheetName of sheetNames) {
    console.log(`\n--- Processing Sheet (Product): ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
    
    if (rows.length === 0) continue;

    const prodSlug = slugify(sheetName);
    const prodImage = IMAGE_MAP[prodSlug] || '';
    
    // Extract description & features from first 10 rows
    let descriptionText = '';
    let featuresArray = [];
    for (let i = 0; i < Math.min(10, rows.length); i++) {
        const cell = String(rows[i][0] || '').trim();
        if (cell.toLowerCase().includes('model') || cell.toLowerCase().includes('number')) {
            break; // reached the table
        }
        if (cell.length > 30) { 
          // Detect numbered list or just append
          if (/^\d+\./.test(cell)) {
             featuresArray.push(cell);
          } else {
             descriptionText += cell + " ";
          }
        }
    }

    // Find the Model header row
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(20, rows.length); i++) {
      const cell = String(rows[i][0] || '').trim().toLowerCase();
      if (cell === 'model' || cell.includes('model number') || cell.includes('model no')) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.log('  Could not find Model row. Skipping.');
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

    console.log(`  Found ${modelsInfo.length} models: ${modelsInfo.map(m => m.name).join(', ')}`);

    // Insert Product
    const { data: product, error: prodErr } = await supabase.from('products').insert({
      main_category_id: cat.id,
      name: sheetName.trim(),
      slug: prodSlug,
      short_description: descriptionText.substring(0, 150).trim() || `${sheetName} series`,
      full_description: descriptionText.trim(),
      features: JSON.stringify(featuresArray),
      specs: '[]', // specs at product level empty, handled in models
      image: prodImage,
      featured: prodOrder === 0 ? 1 : 0,
      sort_order: prodOrder++
    }).select().single();

    if (prodErr || !product) {
       console.error(`  Failed to create product:`, prodErr?.message);
       continue;
    }
    console.log(`  Created Product: ${product.name}`);

    // Parse specs for each model
    let modelOrder = 0;
    for (const model of modelsInfo) {
      const specsList = [];
      let currentGroup = '';

      for (let r = headerRowIndex + 1; r < rows.length; r++) {
         const row = rows[r];
         if (!row || row.length === 0) continue;
         
         const rawLabel = String(row[0] || '').trim();
         
         // Special handling for Telescopic Forklift which has a totally new section down below
         if (rawLabel.toLowerCase().includes('model')) continue;

         let specUnit = '';
         if (unitColIndex !== -1 && row[unitColIndex]) {
            const u = String(row[unitColIndex]).trim();
            if (u && u !== '-') specUnit = ` (${u})`;
         }

         const specLabel = rawLabel ? `${rawLabel}${specUnit}` : '';
         const specVal = row[model.colIndex] !== null && row[model.colIndex] !== undefined ? String(row[model.colIndex]).trim() : '';
         
         if (specLabel && !specVal) {
             // Treat as a group header if it doesn't have a specific value but others might
             const hasAnyValue = row.slice(1).some(v => v !== null && String(v).trim() !== '');
             if (!hasAnyValue) {
                specsList.push({ label: `--- ${specLabel.toUpperCase()} ---`, value: '' });
                continue;
             }
         }

         if (specLabel || specVal) {
             specsList.push({ label: specLabel, value: specVal });
         }
      }

      // Filter out trailing empty rows
      while(specsList.length > 0 && !specsList[specsList.length-1].label && !specsList[specsList.length-1].value) {
         specsList.pop();
      }

      // Clean up specs lists that just have empty values for this model
      const cleanSpecs = specsList.filter(s => s.label.startsWith('---') || s.value !== '');

      const { error: modErr } = await supabase.from('product_models').insert({
         product_id: product.id,
         model_name: model.name,
         specs: cleanSpecs,
         sort_order: modelOrder++
      });

      if (modErr) {
         console.error(`    Error adding model ${model.name}:`, modErr.message);
      } else {
         console.log(`    Added Model: ${model.name} (${cleanSpecs.length} specs)`);
      }
    }
  }

  console.log('\n✅ Import finished!');
}

run();
