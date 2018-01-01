import Backbone = require('backbone');
import * as md5 from 'md5';
import Expenses from "./Expenses";
import {ModelSetOptions} from "backbone";
import Workspace from "../Workspace";
import {isUndefined} from "util";
import * as _ from 'underscore';

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

	attributes: {
		id: string;
		date: Date;
		category: string;
		amount: number;
		note: string;
		visible: boolean;
		done: boolean;
	};

	_events;

	collection: Backbone.Collection<any>;
	expenses: Expenses;

	constructor(attributes: Object, options?: Object) {
		super(attributes, options);
		this.injectExpenses();

		this.defaults = <any>{
			visible: true,
		};

		// this prevents duplicates
		if (!this.get('id')) {
			const sDate = this.get('date');
			this.set('id', md5(sDate + this.get('amount')));
		}

		// number
		// this.set('amount', parseFloat(this.get('amount')));

		if (!this.has('visible')) {
			this.set('visible', true);
		}

		// make sure it's defined
		if (!this.get('category')) {
			this.set('category', 'Default');
		}

		// should be set
		if (!this.has('note')) {
			this.set('note', '');
		}

		if (!this.has('done')) {
			this.set('done', false);
		}
	}

	injectExpenses() {
		this.expenses = Workspace.getInstance().model;
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

	/**
	 * Indirectly triggered by category drop-down
	 * @param category
	 */
	setCategory(category) {
		console.group('Transaction.setCategory', this.get('id'));
		console.warn('this.set', this._events);

		// silent because we don't need to re-render the whole table
		// when only a drop-down has changed
		this.set('category', category, { silent: true });

		// the LS update is done by this.set()
		// (<Expenses>this.collection).localStorage.update(this);
		console.groupEnd();
	}

	/**
	 * This will return Date object any time
	 */
	getDate() {
		let dDate;
		let sDate = this.get('date');
		if (sDate instanceof Date) {
			dDate = sDate;
		} else {
			dDate = new Date(sDate);
			let dDateValid = !isNaN( dDate.getTime() );
			if (!dDate || !dDateValid) {
				dDate = Date.parseExact(sDate, "d.M.yyyy");
			}
		}
		return dDate;
	}

	isVisible() {
		return this.get('visible');
	}

	getAmount(): number {
		return parseFloat(this.get('amount'));
	}

	set(field: string, value: any, options?: ModelSetOptions) {
		super.set(field, value, options);
		if (_.isString(field)) {
			console.log('Transaction updated: ', field, value);
			this.expenses.localStorage.update(this);
		}
		return this;
	}

}
