import * as $ from "jquery";
import {Umsaetze} from './Umsaetze';
const Backbone = require('backbone');

//console.log('Umsaetze', Umsaetze);

interface Window {
	__backboneAgent: any;
	app: Umsaetze;
}
declare let window: Window;

if (typeof window == 'object' && window.__backboneAgent) {
	window.__backboneAgent.handleBackbone(Backbone);
}

$(() => {
	// setTimeout(() => {
	// const u = new Umsaetze();
	// }, 1);
});

(async () => {
	const u = new Umsaetze();
	await u.init();
	window.app = u;
})();

// https://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui
export function asyncLoop(arr: Array<any>, callback: Function, done?: Function) {
	(function loop(i) {
		//callback when the loop goes on
		callback(arr[i], i, arr.length);

		//the condition
		if (i < arr.length) {
			setTimeout(function() {
				loop(++i)
			}, 0); //rerun when condition is true
		} else {
			if (done) {
				//callback when the loop ends
				done();
			}
		}
	}(0));                                         //start with 0
}

export async function awaitLoop(array: any[], callback: Function, done?: Function) {
	for (let el of array) {
		await callback(el);
	}
	if (done) {
		await done();
	}
}

export function debug(name, ...args) {
	console.warn(typeof name, ":", ...args);
}

// only run this once
// import ImportKeywords from './ImportKeywords';
// let i = new ImportKeywords();
