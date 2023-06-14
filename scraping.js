const puppeteer = require('puppeteer');
const fs = require('fs');



(async () => {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    const searchQuery = "Bank Mandiri KCP Jakarta Daan Mogot Baru, Jalan Tampak Siring Timur, RT.8/RW.12, Kalideres, West Jakarta City, Jakarta";
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
