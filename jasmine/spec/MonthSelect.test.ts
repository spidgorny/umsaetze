///<reference path="../typings/globals/jasmine/index.d.ts"/>

import MonthSelect from "../../src/MonthSelect";

describe('2B||!2B', () => {
	it('true ==? false', () => {
		expect(true).toBeFalsy();
	})
});

describe('Month Select', () => {
	it('can be instantiated', () => {
		var ms = new MonthSelect();
		expect(ms).toBe('MonthSelect');
	})
});
