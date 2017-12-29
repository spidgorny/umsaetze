/// <reference path="../node_modules/@types/backbone/index.d.ts" />

// import Events from 'typhonjs-core-backbone-events/src/Events.js';
// import Backbone = require('backbone');
const Backbone = require('backbone');
import * as JQuery from 'jquery';
import Expenses from "./Expenses/Expenses";
import CollectionArray from "./Util/CollectionArray";

export class CollectionController<T extends Expenses|CollectionArray> extends Backbone.Events {

	cid: string;

	$el: JQuery;

	/**
	 * It has no constructor
	 * @param options
	 */
	init(options: any) {
		this.cid = Math.random().toString();
	}

	setElement(el: JQuery) {
		this.$el = el;
	}

	hide() {
		this.$el.hide();
	}

	static $(selector: string) {
		return $(selector);
	}

}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
	baseCtors.forEach(baseCtor => {
		Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
			derivedCtor.prototype[name] = baseCtor.prototype[name];
		});
	});
}

// applyMixins(CollectionController, [Events]);

