const puppeteer = require('puppeteer');

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var elements = document.querySelectorAll('.ecceSd')[0];
                var scrollHeight = elements.scrollHeight
                elements.scrollBy(0, distance)
                totalHeight += distance;

                if (totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            },100);
        });
    });
}

async function parsePlace(page){
    let places = [];
    const elements = await page.$$('.fontHeadlineSmall');
    for (const element of elements) {
        const name = await element.evaluate(el => el.innerHTML);

        places.push({name});
    }

    return places
}

(async () => {
  const browser = await puppeteer.launch({headless : false});
  const page = await browser.newPage();

  // Set screen size
  await page.setViewport({
    width: 1300, 
    height: 900
  });

  await page.goto('https://www.google.com/maps/search/Sushi/@-6.170505,106.764802,15z/data=!3m1!4b1?entry=ttu');
  
  places = await parsePlace(page)

  console.log(places)
  await autoScroll(page);
  //await browser.close();
})();