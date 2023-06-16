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

async function toDict(Link, alamat){
    const header = ['Link','Alamat']
    const Links = Link
    const alamats = alamat
    const dictionary = []
    for (let i = 0; i < Links.length; i++){
        const value = {
            [header[0]] : Links[i],
            [header[1]] : alamats[i],
        };
        dictionary.push(value)
    }
    return dictionary
}

(async () => {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    const csvFilePath = 'Alamat Raw Bank Bca.csv'
    const result = await dataRead(csvFilePath)

    const alamat = []
    const Link = []

    for (let i = 0; i < 100; i++){
        const searchQuery = result[i];
        Link.push(searchQuery);
        await page.goto('https://www.google.com/maps/?q=' + searchQuery, { timeout: 60000 });
        await page.evaluate(() => {
            document.body.style.zoom = '150%'; // Adjust the zoom level as needed
        });
        
        await page.waitForNavigation();
        
        //const cabang_raw = await cabang(page);
        //Cabang.push(cabang_raw);

        //const element_cabang = await page.$$('.fontHeadlineLarge');
        //const cabangs = await element_cabang[0].evaluate(el => el.textContent);

        const alamats = await page.evaluate(() => {
            const alamat = document.querySelectorAll('.fontBodyMedium')[2];
            return alamat ? alamat.textContent : '';
        });

        alamat.push(alamats)
        
    }

    const dictionary = await toDict(Link, alamat);
    console.log(dictionary)
    await browser.close();
})();