///<reference path="../typings/index.d.ts"/>

import Expenses from "../src/Expenses/Expenses";
let createDocument = require('./helper/createDocument');
createDocument['default']();

import MonthSelect from "../src/MonthSelect";
import MonthSelectMock from "./helper/MonthSelectMock";
import ExpensesMock from "./helper/ExpensesMock";
let assert = require('assert');
//import expect, { createSpy, spyOn, isSpy } from 'expect';
let expect = require('expect');
require('../src/Util/Number');	// for clamp

expect.extend( {
	toBeAColor() {
		expect.assert(
			this.actual.match(/^#[a-fA-F0-9]{3,6}$/),
			'expected %s to be an HTML color',
			this.actual
		);
		return this;
	},

	toBeSameTime(time: Date) {
		expect.assert(
			this.actual.getTime() == time.getTime(),
			'expected %s to be the same time\n'+
			this.actual.getTime() + ' != ' + time.getTime()+'\n'+
			this.actual.toString('yyyy-MM-dd HH:mm:ss') + ' != ' + time.toString('yyyy-MM-dd HH:mm:ss'),
			this.actual
		);
		return this;
	}
});

class MonthSelectTest {

	/**
	 * constructor should make an object
	 */
	constructor() {
	}

	getMethods() {
		// console.log(this);
		// console.log(this.prototype);
		// console.log(MonthSelectTest);
		// console.log(MonthSelectTest.prototype);
		// console.log(Object.getOwnPropertyNames(this));
		// console.log(Object.getOwnPropertyNames(MonthSelectTest.prototype));
		let methods = {};
		for (let name in (MonthSelectTest.prototype)) {
			let value = MonthSelectTest.prototype[name];
			// console.log(name, typeof value);
			if (typeof value == "function" && name !== 'getMethods') {
				methods[name] = value;
			}
		}
		return methods;
	}

	setUp(callback) {
		//console.log('setUp');
		callback();
	}

	test_clamp(test) {
		expect((10).clamp(15, 20)).toBe(15);
		test.done();
	}

	test_construct(test) {
		let ms = new MonthSelectMock();
		expect(ms).toBeA(MonthSelect);
		test.done();
	}

	test_loadData(test) {
		let ex = new ExpensesMock();
		ex.load('test/data/umsaetze-2017-04-20.json');
		expect(ex.size()).toBe(235);
		test.done();
	}

	test_getEarliest(test) {
		let ex = new ExpensesMock();
		ex.load('test/data/umsaetze-2017-04-20.json');
		expect(ex.getEarliest()).toBeSameTime(
			new Date('Fri Jan 20 2017 00:00:00 GMT+0100')
		);
		test.done();
	}

	test_getLatest(test) {
		let ex = new ExpensesMock();
		ex.load('test/data/umsaetze-2017-04-20.json');
		expect(ex.getLatest()).toBeSameTime(
			new Date('Thu Apr 20 2017 00:00:00 GMT+0200')
		);
		test.done();
	}

	test_loadDataAndUpdateMonthSelect(test) {
		let ex = new ExpensesMock();
		ex.load('test/data/umsaetze-2017-04-20.json');
		let ms = new MonthSelectMock();
		ms.update(ex);
		expect(ms.earliest).toBeSameTime(ex.getEarliest().moveToFirstDayOfMonth());
		expect(ms.latest).toBeSameTime(ex.getLatest());
		test.done();
	}

	test_loadDataAndUpdateMonthSelectCurrentMonth(test) {
		let ex = new ExpensesMock();
		ex.load('test/data/umsaetze-2017-04-20.json');
		let ms = new MonthSelectMock();
		ms.update(ex);
		expect(ms.selectedYear).toBe(2017);
		expect(ms.selectedMonth).toBe('Feb');
		test.done();
	}

	test_whereMonth(test) {
		let ex = new ExpensesMock();
		ex.load('test/data/umsaetze-2017-04-20.json');

		let ms = new MonthSelectMock();
		ms.update(ex);

		ex.setAllVisible();
		expect(ex.size()).toBe(235);
		const yearMonth = ms.getSelected();
		expect(yearMonth).toBeSameTime(
			new Date('2017-02-01 00:00:00 GMT+1')
		);
		let wm = ex.whereMonth(yearMonth);
		expect(wm.length).toBe(85);
		test.done();
	}

	test_stepBackTillSalary(test) {
		let ex = new ExpensesMock();
		ex.load('test/data/umsaetze-2017-04-20.json');

		let ms = new MonthSelectMock();
		ms.update(ex);
		expect(ex.size()).toBe(235);

		ex.setAllVisible();
		ex.dumpVisible();
		//let allVisible = ex.getVisible();
		//console.log(allVisible);
		expect(ex.getVisible().length).toBe(235);
		expect(ex.getVisibleCount()).toBe(235);

		const yearMonth = ms.getSelected();
		expect(yearMonth).toBeSameTime(
			new Date('2017-02-01 00:00:00 GMT+1')
		);
		ex.filterByMonth(yearMonth);
		expect(ex.getVisible().length).toBe(85);
		ex.stepBackTillSalary(ms);
		expect(ex.getVisible().length).toBe(97);
		test.done();
	}

}

module.exports = new MonthSelectTest().getMethods();
// console.log(module.exports);

