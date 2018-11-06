/// <reference path="../node_modules/@types/backbone/index.d.ts" />

// import Events from 'typhonjs-core-backbone-events/src/Events.js';
// import Backbone = require('backbone');
import {Events} from "backbone";

import JQuery from 'jquery';
import Expenses from "./Expenses/Expenses";
import CollectionArray from "./Util/CollectionArray";
import {CustomEvents} from './Util/CustomEvents';

export class CollectionController<T extends Expenses|CollectionArray>
	extends CustomEvents
{

	cid: string;

	$el: JQuery;

	visible = false;

	constructor(options?: any) {
		super();
	}

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

	show() {
		this.visible = true;
	}

	hide() {
		this.$el.hide();
		this.visible = false;
	}

	static $(selector: string) {
		return JQuery(selector);
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

