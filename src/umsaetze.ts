/// <reference path="../typings/index.d.ts" />

import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import Workspace from "./Workspace";
// var bootstrap = require('bootstrap');
const _ = require('underscore');
const Backbone = require('backbone');

interface Window {
	__backboneAgent: any;
}

if (window.__backboneAgent) {
	window.__backboneAgent.handleBackbone(Backbone);
}
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

class Umsaetze {

	constructor() {
		new Workspace({
			root: 'umsaetze/web/'
		});
		// console.log(ws);

		Backbone.history.start();
		// console.log(start);

		this.inlineEdit();
		this.tour();
	}

	inlineEdit() {
		$(document).on('click', '.inlineEdit span', (event) => {
			let span = $(event.target);
			let container = span.parent();
			let input = container.find('input').show();
			span.hide();
			input.focus().val(span.text().trim());
			input.keyup((event) => {
				console.log(event.key);
				if (event.keyCode === 13) {
					$(event.target).blur();
				}
			});
			input.blur((event) => {
				span.html(input.val().trim());
				input.hide();
				span.show();
				let callback = container.data('callback');
				if (typeof callback == 'function') {
					callback(event, container, container.text().trim());
				}
			});
		});
	}

	tour() {
		const Tour = require('bootstrap-tour');
		let tour = new Tour({
			steps: [
				{
					element: "#app",
					title: "Let me show you how it works",
					content: "Here you will see all your expenses in a selected month."
				},
			]});

		setTimeout(() => {
			// Initialize the tour
			// tour.init();
			// Start the tour
			// tour.start();
		}, 5);
	}

}

$(function() {
	new Umsaetze();
});

// only run this once
// import ImportKeywords from './ImportKeywords';
// let i = new ImportKeywords();
