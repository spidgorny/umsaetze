// /<reference path="../../typings/index.d.ts"/>

// const dom = require('node-dom').dom;
// window = dom('', null, {});
// document = window.document;
// Error: No such module: evals

// import Window from '../../src/test/DOM/Window';
// global['window'] = new Window();
// global['document'] = global['window'].document;
// ReferenceError: document is not defined

const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const document = window.document;
// global['window'] = window;
// global['document'] = document;

window = jsdom.jsdom().defaultView;

import MonthSelect from "../../MonthSelect/MonthSelect";

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

