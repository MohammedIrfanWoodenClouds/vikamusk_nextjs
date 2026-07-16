const http = require('http');

http.get('http://localhost:3000/products', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const cssRegex = /href="([^"]+\.css)"/g;
    let match;
    const stylesheets = [];
    while ((match = cssRegex.exec(html)) !== null) {
      stylesheets.push(match[1]);
    }
    console.log('Stylesheets:', stylesheets);
  });
}).on('error', console.error);
