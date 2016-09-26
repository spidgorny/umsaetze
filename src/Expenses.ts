/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="umsaetze.ts" />
/// <reference path="Papa.d.ts" />

import Transaction from './Transaction';
import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import PersistenceOptions = Backbone.PersistenceOptions;
import KeywordCollection from "./KeywordCollection";
import Keyword from "./Keyword";
import CategoryCount from "./Category/CategoryCount";
const bb = require('backbone');
let BackboneLocalStorage = require("backbone.localstorage");
require('datejs');
let elapse = require('elapse');
elapse.configure({
	debug: true
});
let _ = require('underscore');

export default class Expenses extends bb.Collection<Transaction> {

	model: Transaction;

	localStorage: Backbone.LocalStorage;

	selectedMonth: Date;

	constructor(models?: Transaction[] | Object[], options?: any) {
		super(models, options);
		this.model = Transaction;
		this.localStorage = new BackboneLocalStorage("Expenses");
		this.listenTo(this, 'change', () => {
			console.log('Expenses changed event');
			this.saveAll();
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
			_.each(models, (el) => {
				this.add(new Transaction(el));
			});
			//this.unserializeDate();
			this.trigger('change');
			return;
		}
	}

	/**
	 * Only visible
	 * @returns {Date}
	 */
	getDateFrom() {
		let visible = this.getVisible();
		let min = new Date().addYears(10).valueOf();
		_.each(visible, (row: Transaction) => {
			let date: number = row.getDate().valueOf();
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
	}

	/**
	 * Only visible
	 * @returns {Date}
	 */
	getDateTill() {
		let visible = this.getVisible();
		let min = new Date('1970-01-01').valueOf();
		_.each(visible, (row: Transaction) => {
			let date: number = row.getDate().valueOf();
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getEarliest() {
		if (!this.size()) {
			return new Date();
		}
		let max = new Date().addYears(10).valueOf();
		this.each((row: Transaction) => {
			let dDate = row.getDate();
			let date: number = dDate.valueOf();
			if (date < max) {
				max = date;
			}
		});
		return new Date(max);
	}

	getLatest() {
		if (!this.size()) {
			return new Date();
		}
		let min = new Date('1970-01-01').valueOf();
		this.each((row: Transaction) => {
			let date: number = row.getDate().valueOf();
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

	/**
	 * show everything by default, then filters will hide
	 */
	public setAllVisible() {
		this.each((model: Transaction) => {
			model.set('visible', true, { silent: true });
		});
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
			}
		});
		elapse.timeEnd('Expense.filterVisible');
		this.saveAll();
	}

	/**
	 * Will hide some visible
	 * @param selectedMonth
	 */
	filterByMonth(selectedMonth?: Date) {
		elapse.time('Expense.filterByMonth');
		if (selectedMonth) {
			this.selectedMonth = selectedMonth;
		} else if (this.selectedMonth) {
			selectedMonth = this.selectedMonth;
		}

		if (selectedMonth) {
			this.each((row: Transaction) => {
				let tDate: Date = row.get('date');
				let sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
				let sameMonth = tDate.getMonth() == selectedMonth.getMonth();
				if (!sameYear || !sameMonth) {
					row.set('visible', false, {silent: true});
				}
			});
			this.saveAll();
		}
		elapse.timeEnd('Expense.filterByMonth');
	}

	filterByCategory(category: CategoryCount) {
		elapse.time('Expense.filterByCategory');
		this.each((row: Transaction) => {
			if (row.isVisible()) {
				let rowCat: string = row.get('category');
				let isVisible = category.getName() == rowCat;
				//console.log('set visible', isVisible);
				row.set('visible', isVisible, {silent: true});
			}
		});
		this.saveAll();
		elapse.timeEnd('Expense.filterByCategory');
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

	setCategories(keywords: KeywordCollection) {
		this.each((row: Transaction) => {
			if (row.get('category') == 'Default') {
				keywords.each((key: Keyword) => {
					//console.log(key);
					let note = row.get('note');
					if (note.indexOf(key.word) > -1) {
						console.log(note, 'contains', key.word, 'gets', key.category);
						row.set('category', key.category, { silent: true });
					}
				});
			}
		});
		this.trigger('change');
	}

	getMonthlyTotalsFor(category: CategoryCount) {
		let sparks = {};
		let from = this.getEarliest().moveToFirstDayOfMonth();
		let till = this.getLatest().moveToLastDayOfMonth();
		for (let month = from; month.compareTo(till) == -1; month.addMonths(1)) {
			let month1 = month.clone();
			month1.addMonths(1);
			//console.log(month, month1, Date.today().between(month, month1));
			let sum = 0;
			this.each((transaction: Transaction) => {
				let sameCategory = transaction.get('category') == category.getName();
				let sameMonth = transaction.getDate().between(month, month1);
				if (sameCategory && sameMonth) {
					sum += transaction.get('amount');
				}
			});
			sparks[month.toString('yyyy-MM')] = Math.abs(sum).toFixed(2);
		}
		return sparks;
	}
}
