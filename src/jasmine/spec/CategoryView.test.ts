// /<reference path="../../typings/index.d.ts"/>

import {CurrentMonth} from "../../MonthSelect/CurrentMonth";

require('./bootstrap');

const log = console.log;
log.error = console.error;

import MonthSelect, {default as CategoryView} from "../../Category/CategoryView";
import Expenses from "../../Expenses/Expenses";

describe('2B||!2B', () => {
	it('true ==? false', () => {
		expect(true).toBeTruthy();
	});
});

describe('CategoryView', () => {
	it('can be instantiated', () => {
		// let storage = global.window.localStorage;
		const storage = require('local-storage-mock');
		// log('storage', storage);
		// expect(storage).toBeA(Storage);
		const month = new CurrentMonth(2018);
		const expenses = new Expenses();
		let ms = new CategoryView({}, month, expenses);
		expect(ms.constructor.name).toBe('CategoryView');
	});
});
