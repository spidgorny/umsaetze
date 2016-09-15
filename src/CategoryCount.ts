var Backbone = require('backbone');

export default class CategoryCount extends Backbone.Model {

	catName: string;

	count: number;

	amount: number;

	constructor(...args: any[]) {
		super();
	}

}
