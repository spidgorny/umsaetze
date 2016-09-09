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

		var dDate;
		var sDate = this.get('date');
		if (sDate instanceof Date) {	// convert back
			dDate = sDate.clone();
			sDate = dDate.toString('d.M.yyyy');
		} else {
			dDate = Date.parseExact(sDate, "d.M.yyyy");
			this.set('date', dDate);
		}
		//console.log(sDate, dDate);
		if (!this.get('id')) {
			this.set('id', md5(sDate + this.get('amount')));
		}
		// number
		this.set('amount', parseFloat(this.get('amount')));
		if (!this.has('visible')) {
			this.set('visible', true);
		}
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
		this.collection.localStorage.update(this);
	}

}

