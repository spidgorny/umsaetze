import CategoryCollection from "./CategoryCollection";
import Backbone = require('backbone');

export default class CategoryCollectionModel extends Backbone.Model {

	constructor(collection: CategoryCollection, options?: any) {
		super();
		options = options || {};
		options.innerCollection = collection;
	}

	getCollection() : CategoryCollection {
		return this.get('innerCollection');
	}

}
