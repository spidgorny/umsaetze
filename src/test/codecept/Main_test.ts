/// <reference path="./steps.d.ts" />
import expect from 'expect';

// const log = require('ololog');
const log = console.log;
// log.error = console.error;

Feature('Main');

Scenario('home empty', async (I) => {
	I.amOnPage('/');
	I.waitForElement('#expenseTable', 5);
	I.see('Dashboard');
	I.see('Sync');
	I.see('Categories');
	I.see('Keywords');
	I.see('Summary');
	I.see('History');
	I.saveScreenshot('Home.png', true);

	let logs = await I.grabBrowserLogs();
	logs = logs.filter(el => el._type == 'error');
	log('errors', logs);
});

Scenario('generate', async (I) => {
	I.amOnPage('/');

	I.waitForElement('#expenseTable', 5);
	I.click('Sync', 'ul#side-menu');
	I.waitForElement('#Refresh', 5);
	I.saveScreenshot('Sync.png', true);
	I.click('#Generate');
	I.saveScreenshot('Sync-Generate.png', true);
	const Jan = await I.grabAttributeFrom('#month-01 button', 'disabled');
	log(Jan);
	expect(Jan).toBe(null);
});
