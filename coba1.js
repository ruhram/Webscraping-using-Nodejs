const puppeteer = require('puppeteer');

async function parsePlace(page){
    const elements = await page.$$('.fontHeadlineSmall');
}

(async () => {
    //console.log('Hello')
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    const searchQuery = "Bank Mandiri KCP Jakarta Daan Mogot Baru, Jalan Tampak Siring Timur, RT.8/RW.12, Kalideres, West Jakarta City, Jakarta";
    await page.goto('https://www.google.com/maps/?q=' + searchQuery);

    await page.waitForNavigation();

    const currentURL = await page.evaluate(() => window.location.href);
    console.log('Current Google Maps URL:', currentURL);

    //const hrefValue = await page.evaluate(() => window.location.href);
    //const url = await page.url();

    //console.log('Current URL:', hrefValue);
    //console.log('URL', url)
    //await parsePlace(page)
    //await browser.close();
})();