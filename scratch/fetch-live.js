const https = require('https');

https.get('https://www.vikamusk.com/products', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const startIdx = html.indexOf('Need Help Choosing?');
    if (startIdx !== -1) {
      console.log('Live page section HTML:');
      console.log(html.substring(startIdx - 1000, startIdx + 2000));
    } else {
      console.log('Could not find CTA section in live page HTML');
    }
  });
}).on('error', console.error);
