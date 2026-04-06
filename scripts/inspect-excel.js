const XLSX = require('xlsx');
const path = require('path');

const filePath = path.resolve('C:\\Users\\moham\\Downloads\\PRODUCT DATA SHTEET.xlsx');
const wb = XLSX.readFile(filePath);

// Only show sheet 1
const name = wb.SheetNames[0];
const ws = wb.Sheets[name];
const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

console.log(`Sheet: "${name}", Total Rows: ${data.length}`);
for (let r = 0; r < data.length; r++) {
  const row = data[r];
  if (row.every(cell => cell === '')) continue;
  console.log(`Row ${r}: ${JSON.stringify(row)}`);
}
