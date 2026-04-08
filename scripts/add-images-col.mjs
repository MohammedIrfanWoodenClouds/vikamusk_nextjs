import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:vikamus123@db.fbwyljchzdatcjebmvoa.supabase.co:5432/postgres';

const sql = `
ALTER TABLE product_models ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
-- The frontend doesn't need short_description and features anymore, but we add them just in case
ALTER TABLE product_models ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';
ALTER TABLE product_models ADD COLUMN IF NOT EXISTS features TEXT DEFAULT '[]';
`;

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('Running migration...');
    
    await client.query(sql);
    
    console.log('✅ Migration successful!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
