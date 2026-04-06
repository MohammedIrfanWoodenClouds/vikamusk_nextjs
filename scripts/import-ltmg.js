/**
 * LTMG Product Data Import Script
 * ─────────────────────────────────
 * Reads "PRODUCT DATA SHTEET.xlsx" and imports all data into MongoDB:
 *   • 1 Main Category: "LTMG"
 *   • 12 Sub Categories (one per Excel sheet)
 *   • N Products (one per model column in each sheet)
 *
 * Usage: node scripts/import-ltmg.js
 */

const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');
const path = require('path');

// ─── Config ───
const EXCEL_PATH = path.resolve('C:\\Users\\moham\\Downloads\\PRODUCT DATA SHTEET.xlsx');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  throw new Error('Please configure MONGODB_URI in the .env file');
}
const DB_NAME = 'vikamusk_db';

// Map subcategory slugs to available images in /public/images/products/
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

// ─── Helpers ───
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Determines whether a row at index `r` is a genuine model header
 * (defining product models) vs. an engine/motor "Model" spec row.
 *
 * Heuristic: The real model row appears near the top of the sheet (row ≤ 10)
 * OR follows a blank section break (2+ blank rows before it after row 30).
 * Deep-in-sheet "Model" rows that are adjacent to other spec rows are engine specs.
 */
function isProductModelRow(raw, r) {
  // If it's in the first 10 rows it's always a product model row
  if (r <= 10) return true;

  // For rows deeper in the sheet, check if there's a large gap of blank rows before it
  // (indicating a separate table/section, like in Telescopic Forklift sheet)
  let blankCount = 0;
  for (let i = r - 1; i >= Math.max(0, r - 50); i--) {
    const row = raw[i];
    if (!row || row.every(cell => cell === '')) {
      blankCount++;
    } else {
      break;
    }
  }

  // If there are 5+ blank rows before this "Model" row, it's a new product section
  if (blankCount >= 5) return true;

  // Otherwise it's probably an engine model spec row
  return false;
}

/**
 * Per-sheet overrides for sheets with known special structure.
 * Returns the manually specified model definitions, or null to use auto-detection.
 */
function getSheetOverrides(sheetName) {
  const overrides = {
    // Telescopic Forklift: two separate product tables at rows 3 and 83
    'TELESCOPIC FORKLIFT': [
      { row: 3, models: [{ name: 'FT40', colIdx: 2 }, { name: 'FT50', colIdx: 3 }], endRow: 32 },
      { row: 83, models: [{ name: 'FT30', colIdx: 2 }], endRow: 114 },
    ],
    // Diesel Mini Forklift: only FD30 is a product, the "ISUZU" row is engine brand
    'DIESEL MINI FORKLIFT': [
      { row: 4, models: [{ name: 'FD30', colIdx: 2 }], endRow: 999 },
    ],
  };
  return overrides[sheetName] || null;
}

/**
 * Parse a single sheet into a subcategory + array of products.
 */
function parseSheet(ws, sheetName) {
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  if (!raw.length) return null;

  // 1. Get title & description
  const title = String(raw[0]?.[0] || sheetName).trim();
  const slug = slugify(title);

  // Find description (usually row 2, a long text paragraph)
  let description = '';
  for (let r = 1; r <= 3; r++) {
    const cellVal = String(raw[r]?.[0] || '').trim();
    if (cellVal.length > 60) {
      description = cellVal;
      break;
    }
  }

  // Extract features from description
  const features = [];
  if (description) {
    const featureLines = description.split(/\r?\n/).filter(l => l.trim());
    for (const line of featureLines) {
      const cleaned = line.replace(/^\d+[.)]\s*/, '').trim();
      if (cleaned.length > 10 && cleaned.length < 300) {
        features.push(cleaned);
      }
    }
  }

  const products = [];

  // 2. Check for manual overrides
  const overrides = getSheetOverrides(sheetName);

  if (overrides) {
    // Use manual overrides
    for (const section of overrides) {
      const modelRow = raw[section.row];
      if (!modelRow) continue;

      // Detect if this section has a UNIT column
      const col1Val = String(modelRow[1] || '').trim().toLowerCase();
      const hasUnitCol = ['unit', 'units', '-', ''].includes(col1Val);

      for (const { name: modelName, colIdx } of section.models) {
        const specs = {};
        const endRow = Math.min(section.endRow, raw.length);

        for (let r = section.row + 1; r < endRow; r++) {
          const row = raw[r];
          if (!row || row.every(cell => cell === '')) continue;

          const specKey = String(row[0] || '').trim();
          if (!specKey) continue;

          const specVal = String(row[colIdx] || '').trim();
          const headerWords = ['dimensions', 'performance', 'battery', 'power', 'engine', 'measure', 'productivity', 'fuel tank capacity'];
          if (headerWords.includes(specKey.toLowerCase()) && !specVal) continue;

          const unit = hasUnitCol ? String(row[1] || '').trim() : '';

          if (specVal) {
            const displayUnit = unit && unit !== '-' && !specVal.includes(unit) ? ` ${unit}` : '';
            specs[specKey] = `${specVal}${displayUnit}`;
          }
        }

        const shortDesc = Object.entries(specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' | ');

        products.push({
          modelName,
          slug: slugify(modelName),
          shortDescription: shortDesc || `${title} - ${modelName}`,
          fullDescription: description || `${title} ${modelName} specification sheet.`,
          features,
          specs,
        });
      }
    }

    return { title, slug, description, products };
  }

  // 3. Auto-detect model rows
  const modelSections = [];
  for (let r = 0; r < raw.length; r++) {
    const firstCell = String(raw[r]?.[0] || '').trim().toLowerCase();
    if (firstCell === 'model' || firstCell === 'model no.' || firstCell === 'model no' || firstCell === 'model number') {
      if (isProductModelRow(raw, r)) {
        modelSections.push(r);
      }
    }
  }

  if (modelSections.length === 0) {
    console.log(`  ⚠ No model row found in "${sheetName}", skipping.`);
    return { title, slug, description, products: [] };
  }

  for (let sec = 0; sec < modelSections.length; sec++) {
    const modelRowIdx = modelSections[sec];
    const modelRow = raw[modelRowIdx];
    const nextSectionEnd = sec < modelSections.length - 1 ? modelSections[sec + 1] : raw.length;

    // Find model names and their column indices
    const modelEntries = []; // { name, colIdx }

    // Check if col 1 is a unit label or a model name
    const col1Val = String(modelRow[1] || '').trim().toLowerCase();
    const unitLabels = ['unit', 'units', '-', ''];

    if (unitLabels.includes(col1Val)) {
      // Layout A: col 0 = label, col 1 = unit, models from col 2+
      for (let c = 2; c < modelRow.length; c++) {
        const name = String(modelRow[c] || '').trim();
        if (name) modelEntries.push({ name, colIdx: c });
      }
    } else {
      // Layout B: col 0 = "Model", col 1+ are model names
      for (let c = 1; c < modelRow.length; c++) {
        const name = String(modelRow[c] || '').trim();
        if (name) modelEntries.push({ name, colIdx: c });
      }
    }

    if (modelEntries.length === 0) {
      console.log(`  ⚠ No models found in section at row ${modelRowIdx}`);
      continue;
    }

    // Build specs for each model
    for (const { name: modelName, colIdx } of modelEntries) {
      const specs = {};

      for (let r = modelRowIdx + 1; r < nextSectionEnd; r++) {
        const row = raw[r];
        if (!row || row.every(cell => cell === '')) continue;

        const specKey = String(row[0] || '').trim();
        if (!specKey) continue;

        // Skip "Model" rows that appear as engine model specs
        if (specKey.toLowerCase() === 'model') {
          specs['Engine Model'] = String(row[colIdx] || '').trim();
          continue;
        }

        const specVal = String(row[colIdx] || '').trim();
        if (!specVal && !String(row[1] || '').trim()) continue;

        const headerWords = ['dimensions', 'performance', 'battery', 'power', 'engine', 'measure', 'productivity', 'fuel tank capacity'];
        if (headerWords.includes(specKey.toLowerCase()) && !specVal) continue;

        const unit = unitLabels.includes(col1Val) ? String(row[1] || '').trim() : '';

        let value = specVal;
        if (!value && colIdx === 1) {
          value = String(row[1] || '').trim();
        }

        if (value) {
          const displayUnit = unit && unit !== '-' && !value.includes(unit) ? ` ${unit}` : '';
          specs[specKey] = `${value}${displayUnit}`;
        }
      }

      const shortDesc = Object.entries(specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' | ');

      products.push({
        modelName,
        slug: slugify(modelName),
        shortDescription: shortDesc || `${title} - ${modelName}`,
        fullDescription: description || `${title} ${modelName} specification sheet.`,
        features,
        specs,
      });
    }
  }

  return { title, slug, description, products };
}

// ─── Main ───
async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║       LTMG Product Import Script                ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // 1. Read Excel
  console.log(`📄 Reading: ${EXCEL_PATH}`);
  const wb = XLSX.readFile(EXCEL_PATH);
  console.log(`   Found ${wb.SheetNames.length} sheets: ${wb.SheetNames.join(', ')}\n`);

  // 2. Connect to MongoDB
  console.log(`🔌 Connecting to MongoDB...`);
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`   Connected to: ${DB_NAME}\n`);

  // 3. Create or find the "LTMG" main category
  const mainCatCollection = db.collection('main_categories');
  const subCatCollection = db.collection('sub_categories');
  const productsCollection = db.collection('products');

  let ltmgCat = await mainCatCollection.findOne({ slug: 'ltmg' });
  if (ltmgCat) {
    console.log(`✅ Main category "LTMG" already exists (id: ${ltmgCat._id})`);
    
    // Clean up old subcategories and products under LTMG
    const existingSubs = await subCatCollection.find({ main_category_id: ltmgCat._id.toString() }).toArray();
    const subIds = existingSubs.map(s => s._id.toString());
    if (subIds.length > 0) {
      const delProducts = await productsCollection.deleteMany({ sub_category_id: { $in: subIds } });
      console.log(`   🗑 Cleaned ${delProducts.deletedCount} old products`);
    }
    const delSubs = await subCatCollection.deleteMany({ main_category_id: ltmgCat._id.toString() });
    console.log(`   🗑 Cleaned ${delSubs.deletedCount} old subcategories\n`);
  } else {
    const result = await mainCatCollection.insertOne({
      name: 'LTMG',
      slug: 'ltmg',
      description: 'LTMG Construction Equipment — Scissor Lifts, Boom Lifts, Forklifts, Telehandlers and more.',
      icon: '🏗️',
      image: '/images/products/electric-scissor-lift.png',
      sort_order: 0,
    });
    ltmgCat = { _id: result.insertedId };
    console.log(`✅ Created main category "LTMG" (id: ${ltmgCat._id})\n`);
  }

  const mainCatId = ltmgCat._id.toString();

  // 4. Process each sheet
  let totalSubCategories = 0;
  let totalProducts = 0;

  for (let i = 0; i < wb.SheetNames.length; i++) {
    const sheetName = wb.SheetNames[i];
    const ws = wb.Sheets[sheetName];

    console.log(`━━━ Sheet ${i + 1}/${wb.SheetNames.length}: "${sheetName}" ━━━`);

    const parsed = parseSheet(ws, sheetName);
    if (!parsed) {
      console.log(`  ⚠ Could not parse, skipping.\n`);
      continue;
    }

    // Create subcategory
    const subImage = IMAGE_MAP[parsed.slug] || '';
    const subResult = await subCatCollection.insertOne({
      main_category_id: mainCatId,
      name: parsed.title,
      slug: parsed.slug,
      description: parsed.description.substring(0, 500),
      image: subImage,
      sort_order: i,
    });
    const subCatId = subResult.insertedId.toString();
    totalSubCategories++;
    console.log(`  📁 Sub-category: "${parsed.title}" (${parsed.products.length} products) ${subImage ? '🖼️' : '⚠️ no image'}`);

    // Create products
    for (let p = 0; p < parsed.products.length; p++) {
      const prod = parsed.products[p];
      const productImage = subImage;

      await productsCollection.insertOne({
        sub_category_id: subCatId,
        name: `${parsed.title} - ${prod.modelName}`,
        slug: `${parsed.slug}-${prod.slug}`,
        short_description: prod.shortDescription,
        full_description: prod.fullDescription,
        features: JSON.stringify(prod.features),
        specs: JSON.stringify(prod.specs),
        image: productImage,
        featured: p === 0 ? 1 : 0,
        sort_order: p,
      });
      totalProducts++;
      console.log(`     📦 ${prod.modelName} — ${Object.keys(prod.specs).length} specs`);
    }
    console.log('');
  }

  // 5. Summary
  console.log('╔══════════════════════════════════════════════════╗');
  console.log(`║  ✅ Import Complete!                             ║`);
  console.log(`║  Main Category: LTMG                            ║`);
  console.log(`║  Sub Categories: ${String(totalSubCategories).padEnd(32)}║`);
  console.log(`║  Products: ${String(totalProducts).padEnd(37)}║`);
  console.log('╚══════════════════════════════════════════════════╝');

  await client.close();
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
