/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="umsaetze.ts" />
/// <reference path="Papa.d.ts" />

import Transaction from './Transaction';
import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import PersistenceOptions = Backbone.PersistenceOptions;
var Backbone = require('backbone');
let BackboneLocalStorage = require("backbone.localstorage");
require('datejs');
var elapse = require('elapse');
elapse.configure({
	debug: true
});
var $ = require('jquery');
var _ = require('underscore');

export default class Expenses extends Backbone.Collection<Transaction> {

	attributes = null;

	model: { new(): Transaction; };

	localStorage: Backbone.LocalStorage;

	//url = 'expenses/';

	constructor() {
		super();
		this.localStorage = new BackboneLocalStorage("Expenses");
		this.listenTo(this, 'change', () => {
			console.log('Expenses changed event');
		});
	}

	/**
	 * Should be called after constructor to read data from LS
	 * @param options
	 * @returns {JQueryXHR}
	 */
	fetch(options: CollectionFetchOptions = {}) {
		let models = this.localStorage.findAll();
		console.log('models from LS', models.length);
		if (models.length) {
			this.add(models);
			//this.unserializeDate();
			this.trigger('change');
			return;
		}
	}

	/**
	 * show everything by default, then filters will hide
 	 */
	public setAllVisible() {
		this.each((model: Transaction) => {
			model.set('visible', true, { silent: true });
		});
	}

	getDateFrom() {
		let visible = this.getVisible();
		let min = new Date().addYears(10).valueOf();
		_.each(visible, (row: Transaction) => {
			let date: number = row.get('date').valueOf();
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getDateTill() {
		let visible = this.getVisible();
		let min = new Date('1970-01-01').valueOf();
		_.each(visible, (row: Transaction) => {
			let date: number = row.get('date').valueOf();
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getEarliest() {
		let min = new Date().addYears(10).valueOf();
		this.each((row: Transaction) => {
			let dDate = row.get('date');
			if (!dDate) {
				console.log('getEarliest', dDate, row);
			}
			let date: number = dDate.valueOf();
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getLatest() {
		let min = new Date('1970-01-01').valueOf();
		this.each((row: Transaction) => {
			let date: number = row.get('date').valueOf();
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

	/**
	 * Will hide some visible
	 * @param q
	 */
	filterVisible(q: string) {
		if (!q.length) return;
		elapse.time('Expense.filterVisible');
		let lowQ = q.toLowerCase();
		this.each((row: Transaction) => {
			if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
				row.set('visible', false, { silent: true });
			} else {
				// row.set('visible', true, { silent: true });
			}
		});
		elapse.timeEnd('Expense.filterVisible');
		this.saveAll();
	}

	/**
	 * Will hide some visible
	 * @param selectedMonth
	 */
	filterByMonth(selectedMonth: Date) {
		elapse.time('Expense.filterByMonth');
		this.each((row: Transaction) => {
			var tDate: Date = row.get('date');
			var sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
			var sameMonth = tDate.getMonth() == selectedMonth.getMonth();
			if (sameYear && sameMonth) {
				// row.set('visible', true, { silent: true });
			} else {
				row.set('visible', false, { silent: true });
			}
		});
		elapse.timeEnd('Expense.filterByMonth');
		this.saveAll();
	}

	saveAll() {
		elapse.time('Expense.saveAll');
		this.each((model: Transaction) => {
			this.localStorage.update(model);
		});
		elapse.timeEnd('Expense.saveAll');
	}

	getVisibleCount() {
		return this.getVisible().length;
	}

	/**
	 * @deprecated
	 */
	unserializeDate() {
		elapse.time('Expense.unserializeDate');
		this.each((model: Transaction) => {
			var sDate = model.get('date');
			var dateObject = new Date(sDate);
			console.log(sDate, dateObject);
			model.set('date', dateObject);
		});
		elapse.timeEnd('Expense.unserializeDate');
	}

	getVisible() {
		return this.where({visible: true});
	}
}
