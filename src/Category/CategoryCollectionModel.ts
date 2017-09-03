import CategoryCollection from "./CategoryCollection";

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
