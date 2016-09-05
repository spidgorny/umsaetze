///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>

export default class Transaction extends Backbone.Model {

	date: Date;
	category: String;
	amount: Number;
	note: String;

	sign() {
		return this.amount >= 0 ? 'positive' : 'negative';
	}

	toJSON() {
		var json = super.toJSON();
		json.sign = this.sign();
		return json;
	}

}

