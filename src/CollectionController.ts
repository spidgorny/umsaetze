import Events from 'typhonjs-core-backbone-events/src/Events.js';
import Expenses from "./Expenses/Expenses";
import CollectionArray from "./Keyword/CollectionArray";

export class CollectionController<T extends Expenses|CollectionArray> extends Events {

	hide() {
		this.$el.hide();
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

