import Backbone = require('backbone');
import md5 from 'md5';
import Expenses from "./Expenses";
import {ModelSetOptions} from "backbone";
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
		done: boolean;
	};

	_events;

	collection: Backbone.Collection<any>;
	expenses: Expenses;

	// outside of attributes as this will be calculated
	visible: boolean = true;

	cacheDate: Date;

	constructor(attributes: Object, options?: Object) {
		super(attributes, options);
		// this.injectExpenses(); // see TransactionFactory
	}

	init() {
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
		if (!this.cacheDate) {
			let dDate;
			let sDate = this.get('date');
			if (sDate instanceof Date) {
				dDate = sDate;
			} else {
				dDate = new Date(sDate);
				let dDateValid = !isNaN(dDate.getTime());
				if (!dDate || !dDateValid) {
					dDate = Date.parseExact(sDate, "d.M.yyyy");
				}
			}
			this.cacheDate = dDate;
		}
		return this.cacheDate;
	}

	isVisible() {
		return this.get('visible');
	}

	getAmount(): number {
		return parseFloat(this.get('amount'));
	}

	get(field: string) {
		if (field === 'visible') {
			// console.log('get visible', this.visible);
			return this.visible;
		} else {
			const value = super.get(field);
			if (field == 'category' && _.isObject(value)) {
				return value.name;
			}
			return value;
		}
	}

	set(field: string, value: any, options?: ModelSetOptions) {
		if (field === 'visible') {
			// console.log('set visible', value);
			this.visible = value;
		} else {
			super.set(field, value, options);
			if (_.isString(field)) {
				console.log('Transaction updated: ', field, value);
				this.expenses.localStorage.update(this);
			}
		}
		// this.trigger('Transaction:change');
		return this;
	}

	contains(substr: string) {
		return this.get('note').toString().includes(substr);
	}
}
