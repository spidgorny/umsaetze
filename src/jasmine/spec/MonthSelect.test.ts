/// <reference path="../../index.d.ts"/>

require('./bootstrap');

const log = <Console><any>console.log;
log.error = console.error;

import MonthSelect from "../../MonthSelect/MonthSelect";

describe('2B||!2B', () => {
	it('true ==? false', () => {
		expect(true).toBeTruthy();
	});
});

describe('Month Select', () => {
	it('can be instantiated', () => {
		// let storage = global.window.localStorage;
		const storage = require('local-storage-mock');
		// log('storage', storage);
		// expect(storage).toBeA(Storage);
		let ms = new MonthSelect(storage);
		expect(ms.constructor.name).toBe('MonthSelect');
	});
});
