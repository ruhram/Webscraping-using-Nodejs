const puppeteer = require('puppeteer');
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
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    const csvFilePath = 'Alamat Raw Bank Bca.csv'

    const result = await dataRead(csvFilePath)
    const firstLine = result[0]

    const searchQuery = firstLine
    await page.goto('https://www.google.com/maps/?q=' + searchQuery);

    const element_cabang = await page.$$('.fontHeadlineLarge');
    
    await page.waitForNavigation();

    for (elements of element_cabang) {
        const cabang = await elements.evaluate(el => el.textContent);
        console.log(cabang);
    }

    const alamat = await page.evaluate(() => {
        const alamat = document.querySelectorAll('.fontBodyMedium')[2];
        return alamat ? alamat.textContent : '';
    });
    console.log(alamat)

    const currentURL = await page.evaluate(() => window.location.href);
    console.log('URL:', currentURL);

    ///}
    //const cabang = await cabang_raw.evaluate(span => span.textContent)
    await browser.close();
})();
