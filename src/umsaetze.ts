/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="Expenses.ts" />

import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import Workspace from "./Workspace";
import MonthSelect from "./MonthSelect";

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

$(function() {
	var ws = new Workspace({
		root: 'umsaetze/web/'
	});
	// console.log(ws);

	var start = Backbone.history.start();
	// console.log(start);
});

