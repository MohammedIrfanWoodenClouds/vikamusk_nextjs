const fetch = require('node:http');

const req = require('http').get('http://localhost:3000/products', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Find the bottom CTA section
    const startIdx = data.indexOf('Need Help Choosing?');
    if (startIdx !== -1) {
      console.log('Found section HTML:');
      console.log(data.substring(startIdx - 1000, startIdx + 2000));
    } else {
      console.log('Could not find CTA section in HTML');
    }
  });
});
req.on('error', (err) => {
  console.error('Error fetching page:', err);
});
