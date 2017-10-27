// import Events from 'typhonjs-core-backbone-events/src/Events.js';
import Backbone = require('backbone');
import Expenses from "./Expenses/Expenses";
import CollectionArray from "./Keyword/CollectionArray";

export class CollectionController<T extends Expenses|CollectionArray> extends Backbone.Events {

	cid: string;

	$el: JQuery;

	constructor(options: any) {
		super();
		this.cid = Math.random().toString();
	}

	setElement(el: JQuery) {
		this.$el = el;
	}

	hide() {
		this.$el.hide();
	}

	$(selector: string) {
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

