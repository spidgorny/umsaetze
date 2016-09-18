///<reference path="../typings/index.d.ts"/>
let md5 = require('md5');
let bb = require('backbone');

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

export default class Transaction extends bb.Model {

	date: Date;
	category: String;
	amount: Number;
	note: String;

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
			var dDateValid = !isNaN( dDate.getTime() );
			if (!dDate || !dDateValid) {
				dDate = Date.parseExact(sDate, "d.M.yyyy");
			}
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
		let json = super.toJSON();
		json.sign = this.sign();
		json.id = this.id;
		return json;
	}

	setCategory(category) {
		this.set('category', category);
		this.collection.localStorage.update(this);
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

}

