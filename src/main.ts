import jquery from 'jquery';
import Umsaetze from './Umsaetze';

const $ = jquery;
// console.log('jQuery', $);
console.log('Umsaetze', Umsaetze);

interface Window {
	__backboneAgent: any;
}
declare let window: Window;

if (typeof window == 'object' && window.__backboneAgent) {
	window.__backboneAgent.handleBackbone(Backbone);
}

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

export function debug(name, ...args) {
	console.warn(typeof name, ":", ...args);
}

$(() => {
	// setTimeout(() => {
		const u = new Umsaetze();
	// }, 1);
});

// only run this once
// import ImportKeywords from './ImportKeywords';
// let i = new ImportKeywords();
