const puppeteer = require('puppeteer');

async function scrapePage() {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  
  //await page.goto('https://example.com');
  await page.goto('https://www.google.com/maps/search/Sushi/@-6.170505,106.764802,15z/data=!3m1!4b1?entry=ttu');

  const elements = await page.$$('.fontHeadlineSmall');
  let places = []
  for (const element of elements) {
    const textContent = await element.evaluate(el => el.innerHTML);
    places.push({textContent})
    //console.log(textContent);
  }

  console.log(places)
  await browser.close();
}

scrapePage();