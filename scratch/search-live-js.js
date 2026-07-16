const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const html = await get('https://www.vikamusk.com/products');
    // find all scripts starting with /_next/static
    const scriptRegex = /src="(\/_next\/static\/chunks\/[^"]+\.js)"/g;
    let match;
    const scripts = [];
    while ((match = scriptRegex.exec(html)) !== null) {
      scripts.push(match[1]);
    }
    
    console.log('Found scripts:', scripts);
    for (const src of scripts) {
      const jsUrl = `https://www.vikamusk.com${src}`;
      const jsContent = await get(jsUrl);
      if (jsContent.includes('Contact Sales')) {
        console.log('Found in script:', src);
        // Find the block containing Contact Sales
        const idx = jsContent.indexOf('Contact Sales');
        console.log(jsContent.substring(idx - 1000, idx + 500));
        break;
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
