const XLSX = require('xlsx');
const path = require('path');

const filePath = path.resolve('C:\\Users\\moham\\Downloads\\PRODUCT DATA SHTEET.xlsx');
const wb = XLSX.readFile(filePath);

console.log('Sheet Names:', wb.SheetNames);

wb.SheetNames.forEach(name => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  console.log(`\nSheet: "${name}", Total Rows: ${data.length}`);
  // Show first 5 non-empty rows
  let count = 0;
  for (let r = 0; r < data.length && count < 10; r++) {
    const row = data[r];
    if (row.every(cell => cell === '')) continue;
    console.log(`Row ${r}: ${JSON.stringify(row)}`);
    count++;
  }
});
