import CategoryCollection from "./CategoryCollection";

class CategoryCollectionModel extends Backbone.Model {

	constructor(collection: CategoryCollection, options?: any) {
		super();
		options = options || {};
		options.innerCollection = collection;
	}

	getCollection() : CategoryCollection {
		return this.get('innerCollection');
	}

}
