import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const publicImagesDir = 'e:\\Personal\\vikamusk-website\\public\\images\\products';

async function updateImages() {
  console.log('Fetching categories to assign images...');
  const { data: categories, error: catError } = await supabase.from('main_categories').select('*');
  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }

  for (const cat of categories) {
    const imageName = `${cat.slug}.png`;
    const imagePath = path.join(publicImagesDir, imageName);
    
    let dbImagePath = '';
    // Check if the image file exists in the public directory
    if (fs.existsSync(imagePath)) {
      dbImagePath = `/images/products/${imageName}`;
      console.log(`Found image for category ${cat.name}: ${dbImagePath}`);
      
      // Update Category if image is empty
      if (!cat.image || cat.image === '') {
        await supabase.from('main_categories').update({ image: dbImagePath }).eq('id', cat.id);
        console.log(`  -> Updated Category: ${cat.name}`);
      }

      // Update Products in this category if their image is empty
      const { data: products } = await supabase.from('products').select('*').eq('main_category_id', cat.id);
      
      let updatedCount = 0;
      for (const prod of products || []) {
        if (!prod.image || prod.image === '') {
          await supabase.from('products').update({ image: dbImagePath }).eq('id', prod.id);
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        console.log(`  -> Assigned image to ${updatedCount} products under ${cat.name}`);
      }
    } else {
      console.log(`No matching image found in public dir for category: ${cat.name} (looked for ${imageName})`);
    }
  }
  
  console.log('Image assignment complete! ✅ Data was not overwritten if images already existed.');
}

updateImages();
