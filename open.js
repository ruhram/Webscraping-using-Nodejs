const fs = require('fs').promises;

async function readFiles(csvFilePath) {
    try {
        const data = await fs.readFile(csvFilePath, 'utf8');
        return data;
      } catch (err) {
        throw err;
      }
}

async function dataRead(csvFilePath) {
    const data = await readFiles(csvFilePath);
    const row = data.split('\n')
    const rowData = row.slice(1)
    const result = []
        
    for (let i = 0; i < rowData.length; i++) {
        const rowObject = rowData[i];
        const strRow = rowObject.replace(/\r/g, '');
        result.push(strRow)
    }

    return result 
}

(async () => {
    const csvFilePath = 'Alamat Raw Bank Bca.csv'
    const result = await dataRead(csvFilePath)
    const firstLine = result[0]
    console.log(firstLine)


})();