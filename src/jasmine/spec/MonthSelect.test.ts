// /<reference path="../../typings/index.d.ts"/>
require('source-map-support').install();

// const log = require('ololog');
const log = console.log;
log.error = console.error;

function buildDOM1() {
	const dom = require('node-dom').dom;
	global.window = dom('', null, {});
	global.document = window.document;
	// Error: No such module: evals
}

// import Window from '../../src/test/DOM/Window';
function buildDOM2() {
	global['window'] = new Window();
	global['document'] = global['window'].document;
	// ReferenceError: document is not defined
}

function buildDOM3() {
	const jsdom = require("jsdom");
	const {JSDOM} = jsdom;
	const {window} = new JSDOM();
	// window.navigator = {};
	const document = window.document;
	global['window'] = window;
	global['document'] = document;
}

function buildDOM4() {
	window = jsdom.jsdom().defaultView;
}

buildDOM3();

// import storage from 'mock-local-storage';
function buildStorage() {
	// should not be called localStorage
	// window.localStorage = global.localStorage;
}

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
		log('storage', storage);
		// expect(storage).toBeA(Storage);
		let ms = new MonthSelect(storage);
		expect(ms.constructor.name).toBe('MonthSelect');
	});
});
