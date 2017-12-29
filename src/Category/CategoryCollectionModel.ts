import CategoryCollection from "./CategoryCollection";
import Backbone = require('backbone');

export default class CategoryCollectionModel extends Backbone.Model {

	innerCollection: CategoryCollection;

	constructor(collection: CategoryCollection, options: any = {}) {
		super({}, options);
		this.innerCollection = collection;
	}

	getCollection(): CategoryCollection {
		// return this.get('innerCollection');
		return this.innerCollection;
	}

}
