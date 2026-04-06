const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'C:\\Users\\moham\\Downloads\\PRODUCT DATA SHTEET.xlsx';

try {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets['DIESEL HEAVY FORKLIFT'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
  
  fs.writeFileSync('excel-introspection-heavy.json', JSON.stringify({
    firstRows: rows.slice(0, 5)
  }, null, 2));
} catch (err) {
  console.error(err.message);
}
