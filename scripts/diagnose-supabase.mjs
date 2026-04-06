// Quick diagnostic script to test Supabase connection and check tables
const SUPABASE_URL = 'https://fbwyljchzdatcjebmvoa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_W6wSqcS8QXGtg7G2boqzAQ_WaLk2EvH';

async function diagnose() {
  console.log('=== Supabase Connection Diagnostic ===\n');

  // 1. Test basic connectivity
  console.log('1. Testing API connectivity...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    console.log(`   Status: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.log(`   Response: ${body.substring(0, 500)}`);
  } catch (err) {
    console.log(`   Error: ${err.message}`);
  }

  // 2. Try to query main_categories
  console.log('\n2. Querying main_categories table...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/main_categories?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    console.log(`   Status: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.log(`   Response: ${body.substring(0, 500)}`);
  } catch (err) {
    console.log(`   Error: ${err.message}`);
  }

  // 3. Check available tables via OpenAPI spec
  console.log('\n3. Checking available tables via OpenAPI...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/openapi+json',
      },
    });
    console.log(`   Status: ${res.status} ${res.statusText}`);
    const body = await res.json();
    if (body.paths) {
      const tables = Object.keys(body.paths).filter(p => p !== '/');
      console.log(`   Available endpoints: ${tables.join(', ') || '(none)'}`);
    } else if (body.definitions) {
      console.log(`   Available definitions: ${Object.keys(body.definitions).join(', ')}`);
    } else {
      console.log(`   Response keys: ${Object.keys(body).join(', ')}`);
      console.log(`   Full response: ${JSON.stringify(body).substring(0, 500)}`);
    }
  } catch (err) {
    console.log(`   Error: ${err.message}`);
  }

  // 4. Test with the supabase-js client
  console.log('\n4. Testing with @supabase/supabase-js...');
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const { data, error } = await supabase.from('main_categories').select('*').limit(1);
    if (error) {
      console.log(`   Error code: ${error.code}`);
      console.log(`   Error message: ${error.message}`);
      console.log(`   Error details: ${error.details}`);
      console.log(`   Error hint: ${error.hint}`);
    } else {
      console.log(`   Success! Found ${data.length} rows`);
    }
  } catch (err) {
    console.log(`   Error: ${err.message}`);
  }
}

diagnose();
