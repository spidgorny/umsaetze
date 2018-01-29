const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.connect();
	const page = await browser.newPage();
	await page.goto('http://localhost:8080/');
	await page.screenshot({path: 'example.png'});

	await browser.close();
})();
