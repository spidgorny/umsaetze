/// <reference path="../typings/index.d.ts" />

import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import Workspace from "./Workspace";
// var bootstrap = require('bootstrap');
// var _ = require('underscore');
const Backbone = require('backbone');
const $ = require('jquery');
// const _ = require('underscore');

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

export function debug(name) {
	return function() {
		//console.warn(name + ":", arguments);
	};
}

$(function() {
	new Workspace({
		root: 'umsaetze/web/'
	});
	// console.log(ws);

	Backbone.history.start();
	// console.log(start);
});

// only run this once
// import ImportKeywords from './ImportKeywords';
// let i = new ImportKeywords();
