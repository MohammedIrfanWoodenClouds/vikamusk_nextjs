const http = require('http');

http.get('http://localhost:3000/_next/static/chunks/%255Broot-of-the-server%255D__0~y_ns6._.css', (res) => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    console.log('CSS length:', css.length);
    // Find references to border-2 or border or button or tracking-
    // search for text-stroke or similar
    const strokeIdx = css.indexOf('text-stroke');
    if (strokeIdx !== -1) {
      console.log('Found text-stroke:', css.substring(strokeIdx - 100, strokeIdx + 200));
    }
    const webkitStrokeIdx = css.indexOf('-webkit-text-stroke');
    if (webkitStrokeIdx !== -1) {
      console.log('Found -webkit-text-stroke:', css.substring(webkitStrokeIdx - 100, webkitStrokeIdx + 200));
    }
    
    // search for buttons or other classes
    const matchBtn = css.indexOf('btn-primary');
    if (matchBtn !== -1) {
      console.log('Found btn-primary:', css.substring(matchBtn, matchBtn + 300));
    }
  });
}).on('error', console.error);
