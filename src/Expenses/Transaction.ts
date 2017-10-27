///<reference path="../../node_modules/@types/backbone/index.d.ts" />
///<reference path="../Util/Date.ts" />
import Backbone = require('backbone');
// import * as Backbone from 'backbone-ts';
import md5 from 'md5';
// import * as Date from 'datejs';
import Expenses from "./Expenses";

/*
 {"account":"SpardaSlawa",
 "category":"Einkauf",
 "currency":"EUR",
 "amount":-23.99,
 "payment_type":"DEBIT_CARD",
 "date": "",
 "note": "",
 "id": "",
 "visible": false,
 "sign": ""
 */

export default class Transaction extends Backbone.Model {

	date: Date;
	category: String;
	amount: Number;
	note: String;
	collection: Backbone.Collection<any>;

	constructor(attributes: Object, options?: Object) {
		super(attributes, options);
		this.defaults = <any>{
			visible: true,
		};

		let dDate;
		let sDate = this.get('date');
		if (sDate instanceof Date) {	// convert back
			dDate = sDate.clone();
			sDate = dDate.toString('d.M.yyyy');
		} else {
			dDate = new Date(sDate);	// to parse from JSON
			let dDateValid = !isNaN( dDate.getTime() );
			if (!dDate || !dDateValid) {
				dDate = Date.parseExact(sDate, "d.M.yyyy");
			}
			this.set('date', dDate);
		}
		//console.log(sDate, dDate);

		// this prevents duplicates
		if (!this.get('id')) {
			this.set('id', md5(sDate + this.get('amount')));
		}
		// number
		this.set('amount', parseFloat(this.get('amount')));
		if (!this.has('visible')) {
			this.set('visible', true);
		}

		// make sure it's defined
		this.set('category', this.get('category') || 'Default');

		// should be set
		this.set('note', this.get('note'));

		this.set('done', this.get('done'));
	}

	sign() {
		return this.get('amount') >= 0 ? 'positive' : 'negative';
	}

	toJSON() {
		let json = super.toJSON();
		json.sign = this.sign();
		json.id = this.id;
		return json;
	}

	setCategory(category) {
		this.set('category', category);
		(<Expenses>this.collection).localStorage.update(this);
	}

	/**
	 * This will return Date object any time
	 */
	getDate() {
		let date = this.get('date');
		if (!(date instanceof Date)) {
			date = new Date(date);
		}
		return date;
	}

	isVisible() {
		return this.get('visible');
	}

	getAmount() {
		return this.get('amount');
	}

}
