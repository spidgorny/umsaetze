///<reference path="../../node_modules/@types/backbone/index.d.ts" />
///<reference path="../../node_modules/@types/datejs/index.d.ts" />

import Transaction from './Transaction';
import Backbone = require('backbone');
import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import PersistenceOptions = Backbone.PersistenceOptions;
import KeywordCollection from '../Keyword/KeywordCollection';
import Keyword from '../Keyword/Keyword';
import CategoryCount from '../Category/CategoryCount';
import {debug} from '../main';
import MonthSelect from '../MonthSelect';
// import FakeJQueryXHR from '../FakeJQueryXHR';
import {LocalStorage} from 'backbone.localstorage';
// import * as Date from 'datejs';
import * as _ from 'underscore';
// import Timer from 'elapse';

// Timer.configure({
// 	debug: true
// });

export default class Expenses extends Backbone.Collection<Transaction> {

	model: typeof Transaction;

	localStorage: LocalStorage;

	selectedMonth: Date;

	comparator = Expenses.comparatorFunction;

	_events;

	static comparatorFunction(compare: Transaction, to?: Transaction) {
		return compare.date == to.date
			? 0 : (compare.date > to.date ? 1 : -1);
	}

	constructor(models?: Transaction[] | Object[], options?: any) {
		super(models, options);
		this.localStorage = new LocalStorage("Expenses");
		this.listenTo(this, 'change', () => {
			console.log('Expenses changed event, saveAll()');
			this.saveAll();
		});
		this.on("all", () => {
			//console.log("Expenses");
		});
	}

	/**
	 * Should be called after constructor to read data from LS
	 * @param options
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
		}
		console.log('read', this.length);
		return <JQueryXHR>{};
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
		let min = new Date().addYears(10).valueOf();
		this.each((row: Transaction) => {
			let dDate = row.getDate();
			let date: number = dDate.valueOf();
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
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
		console.profile('Expense.filterVisible');
		let lowQ = q.toLowerCase();
		this.each((row: Transaction) => {
			if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
				row.set('visible', false, { silent: true });
			}
		});
		console.profileEnd();
		this.saveAll();
	}

	/**
	 * Will hide some visible
	 * @param selectedMonth
	 */
	filterByMonth(selectedMonth?: Date) {
		console.profile('Expense.filterByMonth');
		if (selectedMonth) {
			this.selectedMonth = selectedMonth;
		} else if (this.selectedMonth) {
			selectedMonth = this.selectedMonth;
		} else {
			//throw new Error('filterByMonth no month defined');
			let ms = MonthSelect.getInstance();
			selectedMonth = ms.getSelected();
		}

		console.log('filterMyMonth', selectedMonth);
		if (selectedMonth) {
			let inThisMonth = this.whereMonth(selectedMonth);
			let allOthers = _.difference(this.models, inThisMonth);
			allOthers.forEach((row: Transaction) => {
				row.set('visible', false, {silent: true});
			});
			this.saveAll();
		}
		console.profileEnd();
	}

	whereMonth(selectedMonth: Date) {
		let filtered = [];
		this.each((row: Transaction) => {
			let tDate: Date = row.get('date');
			let sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
			let sameMonth = tDate.getMonth() == selectedMonth.getMonth();
			if (sameYear && sameMonth) {
				filtered.push(row);
			}
		});
		return filtered;
	}

	filterByCategory(category: CategoryCount) {
		console.profile('Expense.filterByCategory');
		this.each((row: Transaction) => {
			if (row.isVisible()) {
				let rowCat: string = row.get('category');
				let isVisible = category.getName() == rowCat;
				//console.log('set visible', isVisible);
				row.set('visible', isVisible, {silent: true});
			}
		});
		this.saveAll();
		console.profileEnd();
	}

	saveAll() {
		console.profile('Expense.saveAll');
		this.localStorage._clear();
		this.each((model: Transaction) => {
			this.localStorage.update(model);
		});
		console.profileEnd();
	}

	/**
	 * @deprecated
	 */
	unserializeDate() {
		console.profile('Expense.unserializeDate');
		this.each((model: Transaction) => {
			let sDate = model.get('date');
			let dateObject = new Date(sDate);
			console.log(sDate, dateObject);
			model.set('date', dateObject);
		});
		console.profileEnd();
	}

	getVisible() {
		return this.where({visible: true});
	}

	getVisibleCount() {
		return this.getVisible().length;
	}

	getSorted() {
		this.sort();
		let visible = this.getVisible();
		// return _.sortBy(visible, 'attributes.date');
		return visible;
	}

	/**
	 * Called by [Apply Keywords] button
	 * @param {KeywordCollection} keywords
	 */
	setCategories(keywords: KeywordCollection) {
		console.group('Expenses.setCategories');
		console.log('setCategories', this.size(), keywords.size());
		let anythingChanged = false;
		this.each((row: Transaction) => {
			if (row.get('category') === CategoryCount.DEFAULT) {
				let note = row.get('note');
				// console.log(note.length, keywords.size());
				keywords.each((key: Keyword) => {
					let found = note.indexOf(key.word);
					// console.log(note.length, key.word, found);
					if (found > -1) {
						console.log(note, 'contains', key.word, 'gets', key.category);
						row.set('category', key.category, { silent: true });
						anythingChanged = true;
					}
				});
			}
		});
		if (anythingChanged) {
			console.log('trigger change', this._events);
			this.trigger('change');
		} else {
			console.log('nothing changed');
		}
		console.groupEnd();
	}

	/**
	 * TODO: generate matrix separately and then return only the value in a grid.
	 * JavaScript is so fast it's tempting to ignore this
	 * @param category
	 * @returns {{}}
	 */
	getMonthlyTotalsFor(category: CategoryCount) {
		let sparks = {};
		let from = this.getEarliest().moveToFirstDayOfMonth();
		let till = this.getLatest().moveToLastDayOfMonth();
		// console.log({
		// 	from: from.toString('yyyy-MM-dd HH:mm'),
		// 	till: till.toString('yyyy-MM-dd HH:mm'),
		// });
		let count = 0;
		for (let month = from; month.compareTo(till) == -1; month.addMonths(1)) {
			let month1 = month.clone();
			month1.addMonths(1).add(<IDateJSLiteral>{minutes: -1});
			// console.log({
			// 	month: month.toString('yyyy-MM-dd HH:mm'),
			// 	month1: month1.toString('yyyy-MM-dd HH:mm'),
			// 	today_is_between: Date.today().between(month, month1)
			// });
			let sum = 0;
			this.each((transaction: Transaction) => {
				let sameCategory = transaction.get('category') == category.getName();
				let sameMonth = transaction.getDate().between(month, month1);
				if (sameCategory && sameMonth) {
					// if (category.getName() == 'Darlehen' && month.toString('yyyy-MM-dd') == '2014-09-01') {
					// 	console.log({
					// 		transDate: transaction.getDate().toString('yyyy-MM-dd HH:mm'),
					// 		transAmount: transaction.getAmount(),
					// 		month: month.toString('yyyy-MM-dd HH:mm'),
					// 		month1: month1.toString('yyyy-MM-dd HH:mm'),
					// 	});
					// }
					sum += transaction.getAmount();
					count++;
					category.incrementCount();
					//category.incrementAmountBy(transaction.getAmount());	// spoils CategoryView
				}
			});
			sparks[month.toString('yyyy-MM')] = Math.abs(sum).toFixed(2);
		}
		//console.log(category.getName(), count);
		category.set('count', count, { silent: true });
		return sparks;
	}

	replaceCategory(oldName, newName) {
		this.each((transaction: Transaction) => {
			if (transaction.get('category') == oldName) {
				transaction.set('category', newName, {silent: true});
			}
		});
	}

	clear() {
		this.reset(null);
	}

	// map(fn: Function) {
	// 	return _.map(this.models, fn);
	// }

	/**
	 * This is supposed to be used after this.filterByMonth()
	 */
	stepBackTillSalary(ms: MonthSelect) {
		let selectedMonth = ms.getSelected();
		if (selectedMonth) {
			let selectedMonthMinus1 = selectedMonth.clone().addMonths(-1);
			let prevMonth = this.whereMonth(selectedMonthMinus1);
			let max = _.reduce(prevMonth, (acc, row: Transaction) => {
				return Math.max(acc, row.get('amount'));
			}, 0);
			//console.log(selectedMonthMinus1.toString('yyyy-MM-dd'), prevMonth.length, max);

			let doAppend = false;
			prevMonth.forEach((row: Transaction) => {
				if (row.get('amount') == max) {
					doAppend = true;
				}
				if (doAppend) {
					row.set('visible', true, {silent: true});
				}
			})
		}
	}

}
