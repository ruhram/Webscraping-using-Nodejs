const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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

async function toDict(cabang, alamat, url){
    const header = ['Cabang','Alamat','Url']
    const cabangs = cabang 
    const alamats = alamat
    const urls = url 
    const dictionary = []
    for (let i = 0; i < cabang.length; i++){
        const value = {
            [header[0]] : cabangs[i],
            [header[1]] : alamats[i],
            [header[2]] : urls[i] 
        };
        dictionary.push(value)
    }
    return dictionary
}

async function toCSV(dictionary){
    const data = dictionary
    const csvWriter = createCsvWriter({
        path: 'output.csv', // Specify the output file path
        header: [
          { id: 'Cabang', title: 'Cabang' },
          { id: 'Alamat', title: 'Alamat' },
          { id: 'Url', title: 'Url' }
        ]
      });
      
      // Write the data to the CSV file
    csvWriter
        .writeRecords(data)
        .then(() => console.log('CSV file created successfully.'))
        .catch(error => console.error('Error writing CSV:', error));
}

(async () => {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    const csvFilePath = 'Alamat Raw Bank Bca.csv'

    const result = await dataRead(csvFilePath)
    const firstLine = result[0]

    const searchQuery = firstLine
    await page.goto('https://www.google.com/maps/?q=' + searchQuery);

    const cabang = []
    const alamat = []
    const url = []

    await page.waitForNavigation();
    const element_cabang = await page.$$('.fontHeadlineLarge');
    const cabangs = await element_cabang[0].evaluate(el => el.textContent);
    cabang.push(cabangs)

    const alamats = await page.evaluate(() => {
        const alamat = document.querySelectorAll('.fontBodyMedium')[2];
        return alamat ? alamat.textContent : '';
    });
    alamat.push(alamats)

    const currentURL = await page.evaluate(() => window.location.href);
    url.push(currentURL)

    //console.log(cabang)
    //console.log(alamat)
    //console.log(url)

    dictionary = await toDict(cabang, alamat, url)

    console.log(dictionary)

    await toCSV(dictionary)

    await browser.close();
})();
