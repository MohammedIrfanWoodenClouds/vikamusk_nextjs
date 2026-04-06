const xlsx = require('xlsx');
const fs = require('fs');

const filePath = 'C:\\Users\\moham\\Downloads\\PRODUCT DATA SHTEET.xlsx';
const outputData = {};

try {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  outputData.sheetNames = sheetNames;
  outputData.samples = {};
  
  for (let i = 0; i < Math.min(sheetNames.length, 3); i++) {
    const sheetName = sheetNames[i];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: null });
    outputData.samples[sheetName] = {
      rowCount: data.length,
      firstRows: data.slice(0, 10)
    };
  }
  
  fs.writeFileSync('excel-introspection.json', JSON.stringify(outputData, null, 2));
  console.log('Introspection complete. Wrote to excel-introspection.json');
} catch (err) {
  console.error('Error reading excel file:', err.message);
}
