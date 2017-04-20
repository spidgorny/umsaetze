///<reference path="../../typings/index.d.ts"/>

import MonthSelect from "../../src/MonthSelect";

const dom = require('node-dom').dom;
window = dom('', null, {});
document = window.document;

// Error: No such module: evals

describe('2B||!2B', () => {
	it('true ==? false', () => {
		expect(true).toBeTruthy();
	})
});

describe('Month Select', () => {
	it('can be instantiated', () => {
		let ms = new MonthSelect();
		expect(ms).toBe('MonthSelect');
	})
});
