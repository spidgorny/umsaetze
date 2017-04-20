///<reference path="../typings/index.d.ts"/>

let createDocument = require('./helper/createDocument');
createDocument['default']();

import MonthSelect from "../src/MonthSelect";
let assert = require('assert');

describe('MonthSelect', function() {
	describe('construct', function() {
		it('constructor should make an object', function() {
			let ms = new MonthSelect();
			expect(ms).to.be.instance.of(MonthSelect);
		});
	});
});
