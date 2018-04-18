require('source-map-support').install();

// window.navigator undefined
// const log = require('ololog');

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
