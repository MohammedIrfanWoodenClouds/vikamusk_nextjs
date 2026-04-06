-- ============================================
-- Vikamusk - Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------
-- Main Categories
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS main_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------
-- Sub Categories (legacy, kept for compatibility)
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS sub_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  main_category_id UUID REFERENCES main_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------
-- Products
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  main_category_id UUID REFERENCES main_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT DEFAULT '',
  full_description TEXT DEFAULT '',
  features TEXT DEFAULT '[]',
  specs TEXT DEFAULT '{}',
  image TEXT DEFAULT '',
  featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------
-- Product Models
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS product_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  specs JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------
-- Career Postings
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS career_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  department TEXT DEFAULT '',
  location TEXT DEFAULT '',
  type TEXT DEFAULT '',
  description TEXT DEFAULT '',
  requirements TEXT DEFAULT '[]',
  benefits TEXT DEFAULT '[]',
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------
-- Enquiries
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  product TEXT DEFAULT '',
  message TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------
-- Indexes for performance
-- -----------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_main_category ON products(main_category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_main_categories_slug ON main_categories(slug);
CREATE INDEX IF NOT EXISTS idx_sub_categories_main_cat ON sub_categories(main_category_id);
CREATE INDEX IF NOT EXISTS idx_product_models_product ON product_models(product_id);
CREATE INDEX IF NOT EXISTS idx_career_postings_active ON career_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

-- -----------------------------------------
-- Row Level Security (RLS)
-- Enable RLS but allow public read access, authenticated writes
-- -----------------------------------------
ALTER TABLE main_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (website needs to read data)
CREATE POLICY "Allow public read on main_categories" ON main_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on sub_categories" ON sub_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read on product_models" ON product_models FOR SELECT USING (true);
CREATE POLICY "Allow public read on career_postings" ON career_postings FOR SELECT USING (true);

-- Public insert on enquiries (anyone can submit an enquiry)
CREATE POLICY "Allow public insert on enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Allow all operations for service role (admin API uses service role key)
-- For the publishable key, we need insert/update/delete policies too
-- since the admin panel uses the same client with JWT auth
CREATE POLICY "Allow all on main_categories" ON main_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sub_categories" ON sub_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on product_models" ON product_models FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on career_postings" ON career_postings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on enquiries" ON enquiries FOR ALL USING (true) WITH CHECK (true);
