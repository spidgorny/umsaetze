const puppeteer = require('puppeteer');

(async () => {
	try {
		// const browser = await puppeteer.connect({
		// 	browserWSEndpoint: 'ws://localhost:9222/devtools/browser/de3c2f59-2bea-4759-8ac0-f00cba7cdac9'
		// });
		const browser = await puppeteer.launch({
			// executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
		});
		const page = await browser.newPage();
		await page.goto('http://localhost:8080/');
		await page.screenshot({path: 'example.png'});

		await browser.close();
	} catch (e) {
		console.error(e);
	}
})();
