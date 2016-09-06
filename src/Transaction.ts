///<reference path="../typings/index.d.ts"/>
///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
var md5 = require('md5');

export default class Transaction extends Backbone.Model {

	date: Date;
	category: String;
	amount: Number;
	note: String;

	constructor(attributes: any, options?: any) {
		super(attributes, options);
		this.defaults = <any>{
			visible: true,
		};

		this.set('id', md5(this.get('date')+this.get('amount')));
		// number
		this.set('amount', parseFloat(this.get('amount')));
		this.set('date', new Date(Date.parse(this.get('date'))));
		this.set('visible', true);
	}

	sign() {
		return this.get('amount') >= 0 ? 'positive' : 'negative';
	}

	toJSON() {
		var json = super.toJSON();
		json.sign = this.sign();
		json.id = this.id;
		return json;
	}

	setCategory(category) {
		this.set('category', category);
	}

}

