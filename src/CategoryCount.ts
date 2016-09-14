///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>

export default class CategoryCount extends Backbone.Model {

	catName: string;

	count: number;

	amount: number;

	constructor(...args: any[]) {
		super();
	}

}
