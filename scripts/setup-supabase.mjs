import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:vikamus123@db.fbwyljchzdatcjebmvoa.supabase.co:5432/postgres';

const sql = `
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main Categories
CREATE TABLE IF NOT EXISTS main_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sub Categories (legacy, kept for compatibility)
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

-- Products
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

-- Product Models
CREATE TABLE IF NOT EXISTS product_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  specs JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career Postings
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

-- Enquiries
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_main_category ON products(main_category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_main_categories_slug ON main_categories(slug);
CREATE INDEX IF NOT EXISTS idx_sub_categories_main_cat ON sub_categories(main_category_id);
CREATE INDEX IF NOT EXISTS idx_product_models_product ON product_models(product_id);
CREATE INDEX IF NOT EXISTS idx_career_postings_active ON career_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

-- Row Level Security
ALTER TABLE main_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to make script re-runnable)
DO $$ BEGIN
  -- main_categories
  DROP POLICY IF EXISTS "Allow public read on main_categories" ON main_categories;
  DROP POLICY IF EXISTS "Allow all on main_categories" ON main_categories;
  -- sub_categories
  DROP POLICY IF EXISTS "Allow public read on sub_categories" ON sub_categories;
  DROP POLICY IF EXISTS "Allow all on sub_categories" ON sub_categories;
  -- products
  DROP POLICY IF EXISTS "Allow public read on products" ON products;
  DROP POLICY IF EXISTS "Allow all on products" ON products;
  -- product_models
  DROP POLICY IF EXISTS "Allow public read on product_models" ON product_models;
  DROP POLICY IF EXISTS "Allow all on product_models" ON product_models;
  -- career_postings
  DROP POLICY IF EXISTS "Allow public read on career_postings" ON career_postings;
  DROP POLICY IF EXISTS "Allow all on career_postings" ON career_postings;
  -- enquiries
  DROP POLICY IF EXISTS "Allow public insert on enquiries" ON enquiries;
  DROP POLICY IF EXISTS "Allow all on enquiries" ON enquiries;
END $$;

-- Create policies
CREATE POLICY "Allow all on main_categories" ON main_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sub_categories" ON sub_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on product_models" ON product_models FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on career_postings" ON career_postings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on enquiries" ON enquiries FOR ALL USING (true) WITH CHECK (true);
`;

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('Connected! Running schema migration...');
    
    await client.query(sql);
    
    console.log('✅ All tables created successfully!');
    
    // Verify tables exist
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\nTables in database:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
