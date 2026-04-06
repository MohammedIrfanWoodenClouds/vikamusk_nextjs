import { createClient } from '@supabase/supabase-js';

// Supabase client for server-side API routes (no cookie handling needed)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// -----------------------------------------
// Main Categories
// -----------------------------------------
export async function getAllMainCategories(featuredOnly = false) {
  let query = supabase
    .from('main_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (featuredOnly) {
    query = query.eq('featured', 1);
  }

  const { data: cats, error } = await query;

  if (error) {
    // If the featured column doesn't exist yet, fallback gracefully
    if (error.code === '42703' && featuredOnly) {
      console.warn('featured column does not exist yet for main_categories. Returning all.');
      const retry = await supabase.from('main_categories').select('*').order('sort_order', { ascending: true });
      if (retry.error) throw retry.error;
      return mapWithCount(retry.data || []);
    }
    throw error;
  }

  return mapWithCount(cats || []);
}

async function mapWithCount(cats: any[]) {

  // Enrich with product counts
  const enrichedCats = await Promise.all(cats.map(async (cat) => {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('main_category_id', cat.id);

    return { ...cat, product_count: count || 0 };
  }));

  return enrichedCats;
}

export async function getMainCategoryById(id: string) {
  const { data, error } = await supabase
    .from('main_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getMainCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('main_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createMainCategory(data: any) {
  const { data: category, error } = await supabase
    .from('main_categories')
    .insert(data)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('UNIQUE constraint');
    throw error;
  }
  return category;
}

export async function updateMainCategory(id: string, data: any) {
  const { error } = await supabase
    .from('main_categories')
    .update(data)
    .eq('id', id);

  if (error) {
    if (error.code === '23505') throw new Error('UNIQUE constraint');
    throw error;
  }
}

export async function deleteMainCategory(id: string) {
  // Delete products under this category first
  await supabase.from('products').delete().eq('main_category_id', id);
  // Delete product models for products under this category
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('main_category_id', id);

  if (products && products.length > 0) {
    const productIds = products.map(p => p.id);
    await supabase.from('product_models').delete().in('product_id', productIds);
    await supabase.from('products').delete().eq('main_category_id', id);
  }

  const { error } = await supabase.from('main_categories').delete().eq('id', id);
  if (error) throw error;
}

// -----------------------------------------
// Sub Categories
// -----------------------------------------
export async function getAllSubCategories(mainCategoryId?: string) {
  let query = supabase.from('sub_categories').select('*').order('sort_order', { ascending: true });

  if (mainCategoryId) {
    query = query.eq('main_category_id', mainCategoryId);
  }

  const { data: subs, error } = await query;
  if (error) throw error;

  const enrichedSubs = await Promise.all((subs || []).map(async (sub) => {
    const { data: mainCat } = await supabase
      .from('main_categories')
      .select('name, slug')
      .eq('id', sub.main_category_id)
      .single();

    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('sub_category_id', sub.id);

    return {
      ...sub,
      main_category_name: mainCat?.name,
      main_category_slug: mainCat?.slug,
      product_count: count || 0,
    };
  }));

  return enrichedSubs;
}

// -----------------------------------------
// Products
// -----------------------------------------
export async function getAllProducts(mainCategoryId?: string) {
  let query = supabase.from('products').select('*').order('sort_order', { ascending: true });

  if (mainCategoryId) {
    query = query.eq('main_category_id', mainCategoryId);
  }

  const { data: prods, error } = await query;
  if (error) throw error;

  return await Promise.all((prods || []).map(async (p) => {
    const { data: mainCat } = await supabase
      .from('main_categories')
      .select('name, slug')
      .eq('id', p.main_category_id)
      .single();

    return {
      ...p,
      main_category_name: mainCat?.name,
      main_category_slug: mainCat?.slug,
    };
  }));
}

export async function getProductsByMainCategory(mainCategorySlug: string) {
  const { data: mainCat } = await supabase
    .from('main_categories')
    .select('*')
    .eq('slug', mainCategorySlug)
    .single();

  if (!mainCat) return [];

  const { data: prods, error } = await supabase
    .from('products')
    .select('*')
    .eq('main_category_id', mainCat.id)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (prods || []).map(p => ({
    ...p,
    main_category_name: mainCat.name,
    main_category_slug: mainCat.slug,
  }));
}

export async function getFeaturedProducts() {
  const { data: prods, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', 1)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return await Promise.all((prods || []).map(async (p) => {
    const { data: mainCat } = await supabase
      .from('main_categories')
      .select('name, slug')
      .eq('id', p.main_category_id)
      .single();

    return {
      ...p,
      main_category_name: mainCat?.name,
      main_category_slug: mainCat?.slug,
    };
  }));
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data: p, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!p) return null;

  const { data: mainCat } = await supabase
    .from('main_categories')
    .select('name, slug')
    .eq('id', p.main_category_id)
    .single();

  return {
    ...p,
    main_category_name: mainCat?.name,
    main_category_slug: mainCat?.slug,
  };
}

export async function createProduct(data: any) {
  const { data: product, error } = await supabase
    .from('products')
    .insert(data)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('UNIQUE constraint');
    throw error;
  }
  return product;
}

export async function updateProduct(id: string, data: any) {
  const { error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id);

  if (error) {
    if (error.code === '23505') throw new Error('UNIQUE constraint');
    throw error;
  }
}

export async function deleteProduct(id: string) {
  // Delete associated models first
  await supabase.from('product_models').delete().eq('product_id', id);
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// -----------------------------------------
// Product Models
// -----------------------------------------
export async function getModelsByProduct(productId: string) {
  const { data, error } = await supabase
    .from('product_models')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createProductModel(data: { product_id: string; model_name: string; specs: any[]; sort_order: number }) {
  const { data: model, error } = await supabase
    .from('product_models')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return model;
}

export async function updateProductModel(modelId: string, data: any) {
  const { error } = await supabase
    .from('product_models')
    .update(data)
    .eq('id', modelId);

  if (error) throw error;
}

export async function deleteProductModel(modelId: string) {
  const { error } = await supabase
    .from('product_models')
    .delete()
    .eq('id', modelId);

  if (error) throw error;
}

// -----------------------------------------
// Careers
// -----------------------------------------
export async function getAllCareers(activeOnly = false) {
  let query = supabase.from('career_postings').select('*').order('created_at', { ascending: false });

  if (activeOnly) {
    query = query.eq('is_active', 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getCareerById(id: string) {
  const { data, error } = await supabase
    .from('career_postings')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createCareer(data: any) {
  data.created_at = new Date().toISOString();
  const { data: career, error } = await supabase
    .from('career_postings')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return career;
}

export async function updateCareer(id: string, data: any) {
  const { error } = await supabase
    .from('career_postings')
    .update(data)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCareer(id: string) {
  const { error } = await supabase
    .from('career_postings')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// -----------------------------------------
// Navigation (Menus)
// -----------------------------------------
export async function getNavCategories() {
  const { data: cats, error } = await supabase
    .from('main_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  const navCats = await Promise.all((cats || []).map(async (cat) => {
    const { data: prods } = await supabase
      .from('products')
      .select('id, name, slug')
      .eq('main_category_id', cat.id)
      .order('sort_order', { ascending: true });

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      products: (prods || []).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
      })),
    };
  }));

  return navCats;
}

// -----------------------------------------
// Seed Database (no-op for Supabase — manage via dashboard or migrations)
// -----------------------------------------
export async function seedDatabase() {
  // With Supabase, tables and seed data are managed via the Supabase
  // Dashboard, SQL Editor, or migration files. This is intentionally a no-op.
  return;
}

// -----------------------------------------
// Enquiries
// -----------------------------------------
export async function createEnquiry(data: { name: string; email: string; phone: string; product: string; message: string }) {
  const doc = { ...data, created_at: new Date().toISOString(), is_read: false };
  const { data: enquiry, error } = await supabase
    .from('enquiries')
    .insert(doc)
    .select()
    .single();

  if (error) throw error;
  return enquiry;
}

export async function getAllEnquiries() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
