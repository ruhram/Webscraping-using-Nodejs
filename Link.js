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

function delays(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
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
        path: 'cek.csv', // Specify the output file path
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

async function toDict(Link, alamat, url){
    const header = ['Link','Alamat','Url']
    const Links = Link
    const alamats = alamat
    const urls = url
    const dictionary = []
    for (let i = 0; i < Links.length; i++){
        const value = {
            [header[0]] : Links[i],
            [header[1]] : alamats[i],
            [header[2]] : urls[i],
        };
        dictionary.push(value)
    }
    return dictionary
}

async function toCSV(dictionary){
    const data = dictionary
    const csvWriter = createCsvWriter({
        path: 'Link.csv', // Specify the output file path
        header: [
          { id: 'Link', title: 'Link' },
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


    const csvFilePath = 'Alamat Raw Bank Bca Fix.csv'
    const result = await dataRead(csvFilePath)

    const alamat = []
    const Link = []
    const url = []

    for (let i = 0; i < result.length; i++){
        const searchQuery = result[i];
        Link.push(searchQuery);
        //console.log(searchQuery)
        //await page.reload();
        
        await page.goto('https://www.google.com/maps/?q=' + searchQuery, { timeout: 60000 });

        //await page.evaluate(() => {
        //    document.body.style.zoom = '150%'; // Adjust the zoom level as needed
        //});

        //await Promise.all([
        //    page.waitForNavigation({ timeout: 10000 }),
        //  ]);

        await delays(3500)

        //console.log('Wait Finish')
        //await page.waitForNavigation();
        
        //const cabang_raw = await cabang(page);
        //Cabang.push(cabang_raw);

        //const element_cabang = await page.$$('.fontHeadlineLarge');
        //const cabangs = await element_cabang[0].evaluate(el => el.textContent);

        const alamats = await page.evaluate(() => {
            const alamat = document.querySelectorAll('.fontBodyMedium')[2];
            return alamat ? alamat.textContent : '';
        });
        alamat.push(alamats)

        const currentURL = await page.evaluate(() => window.location.href);
        url.push(currentURL)
        
        //console.log('Scrapping Finish')
        //await page.reload();
        
    }

    const dictionary = await toDict(Link, alamat, url);
    await toCSV(dictionary);
    await browser.close();
})();