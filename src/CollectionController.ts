/// <reference path="../node_modules/@types/backbone/index.d.ts" />

// import Events from 'typhonjs-core-backbone-events/src/Events.js';
// import Backbone = require('backbone');
import {Events} from "backbone";

import * as $ from 'jquery';
import Expenses from "./Expenses/Expenses";
import CollectionArray from "./Util/CollectionArray";
import {CustomEvents} from './Util/CustomEvents';

export class CollectionController<T extends Expenses|CollectionArray>
	extends CustomEvents
{

	cid: string;

	$el: $;

	/**
	 * It has no constructor
	 * @param options
	 */
	init(options: any) {
		this.cid = Math.random().toString();
	}

	setElement(el: $) {
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

