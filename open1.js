const fs = require('fs').promises;

async function readFiles(csvFilePath) {
    return fs.readFile(csvFilePath, 'utf8');
}

(async () => {
    const csvFilePath = 'Alamat Raw Bank Bca.csv';
    const result = await readFiles(csvFilePath)
    console.log(result)
}
)();

