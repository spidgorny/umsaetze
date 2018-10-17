import Transaction from './Transaction';
import Backbone = require('backbone');
import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import KeywordCollection from '../Keyword/KeywordCollection';
import Keyword from '../Keyword/Keyword';
import CategoryCount from '../Category/CategoryCount';
import MonthSelect from '../MonthSelect/MonthSelect';
import {LocalStorage} from 'backbone.localstorage';
import 'datejs';
import * as _ from 'underscore';
import * as $ from 'jquery';
import {LocalStorageInterface} from "../test/helper/LocalStorageInterface";
import {TransactionFactory} from "./TransactionFactory";
import {asyncLoop, awaitLoop} from "../main";

export default class Expenses extends Backbone.Collection<Transaction> {

	/**
	 * For async progress bar
	 * @type {number}
	 */
	counter = 0;

	model: typeof Transaction;

	localStorage: LocalStorage;

	comparator;

	_events;

	tf: TransactionFactory;

	static comparatorFunction(compare: Transaction, to?: Transaction) {
		return compare.getDate() == to.getDate()
			? 0 : (compare.getDate() > to.getDate() ? 1 : -1);
	}

	constructor(models: Transaction[] | Object[] = [],
				options: any = {},
				ls?: LocalStorageInterface,
				tf: TransactionFactory = null) {
		super(models, options);
		if (ls) {
			this.localStorage = ls;
		} else {
			this.localStorage = window.localStorage;
		}
		this.listenTo(this, 'change', () => {
			console.log('Expenses changed event, saveAll()');
			// this.saveAll();
		});
		this.on("all", () => {
			//console.log("Expenses");
		});

		// commented to prevent execution while loading data one by one
		// required for the list to be sorted
		this.comparator = Expenses.comparatorFunction;
	}

	/**
	 * Should be called after constructor to read data from LS
	 * @param options
	 */
	fetch(options: CollectionFetchOptions = {}) {
		console.time('Expenses.fetch');
		let models = this.localStorage.findAll();
		console.log('models from LS', models.length);
		if (models.length) {
			_.each(models, (el) => {
				let transaction = this.tf.make(el);
				this.add(transaction, {
					silent: true,	// avoid event until all data is inserted = faster
				});
			});
			//this.unserializeDate();
			console.log('added objects', this.size());
			// this.trigger('change');
		}
		console.log('read', this.length);
		console.timeEnd('Expenses.fetch');
		return <JQueryXHR>{};
	}

	/**
	 * Should be called after constructor to read data from LS
	 * @param options
	 */
	async asyncFetch(options: CollectionFetchOptions = {}) {
		console.time('Expenses.fetch');
		let models = this.localStorage.findAll();
		console.log('models from LS', models.length);
		$('#app').html(`<div class="progress" id="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
    0%
  </div>
</div>`);
		if (models.length) {
			const promList = [];
			for (let el of models) {
				promList.push(
					this.addElementUpdateProgress(el, models.length));
			}
			await Promise.all(promList);
			//this.unserializeDate();
			console.log('added objects', this.size());
			// this.trigger('change');
		}
		console.log('read', this.length);
		console.timeEnd('Expenses.fetch');
	}

	sleep (fn, par?: any) {
		return new Promise((resolve) => {
			// wait 3s before calling fn(par)
			setTimeout(() => resolve(fn(par)), 0)
		})
	}

	async addElementUpdateProgress(el, numModels) {
		await this.sleep(() => {
			let transaction = this.tf.make(el);
			this.add(transaction);

			const percent = Math.round(this.counter++ / numModels * 100) + '%';
			$('#app #progress .progress-bar')
				.width(percent)
				.text(percent);
		});
	}

	saveAll() {
		console.warn('Expenses.saveAll prevented');
		return;
	}

	saveReallyAll() {
		console.time('Expenses.saveAll');
		this.localStorage._clear();
		this.each((model: Transaction) => {
			this.localStorage.update(model);
		});
		console.timeEnd('Expenses.saveAll');
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
			// this value is not stored in LS, but calculated
			model.visible = true;
			//model.set('visible', true, { silent: true });
		});
	}

	/**
	 * Will hide some visible
	 * @param q
	 */
	filterVisible(q: string) {
		if (!q.length) return;
		console.time('Expenses.filterVisible');
		let lowQ = q.toLowerCase();
		this.each((row: Transaction) => {
			if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
				row.set('visible', false, { silent: true });
			}
		});
		console.timeEnd('Expenses.filterVisible');

		// slow?
		// this.saveAll();
	}

	/**
	 * Will hide some visible
	 * @param selectedMonth
	 */
	filterByMonth(selectedMonth: Date) {
		console.time('Expenses.filterByMonth');
		console.log('filterByMonth', selectedMonth.toString('yyyy-MM-dd'));
		if (selectedMonth) {
			let inThisMonth = this.whereMonth(selectedMonth);
			let allOthers = _.difference(this.models, inThisMonth);
			allOthers.forEach((row: Transaction) => {
				row.set('visible', false, {silent: true});
			});
			// this.saveAll();
		}
		console.timeEnd('Expenses.filterByMonth');
	}

	whereMonth(selectedMonth: Date) {
		let filtered = [];
		this.each((row: Transaction) => {
			let tDate: Date = row.getDate();
			let sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
			let sameMonth = tDate.getMonth() == selectedMonth.getMonth();
			if (sameYear && sameMonth) {
				filtered.push(row);
			}
		});
		return filtered;
	}

	filterByCategory(category: CategoryCount) {
		console.time('Expenses.filterByCategory');
		this.each((row: Transaction) => {
			if (row.isVisible()) {
				let rowCat: string = row.get('category');
				let isVisible = category.getName() == rowCat;
				//console.log('set visible', isVisible);
				row.set('visible', isVisible, {silent: true});
			}
		});
		this.saveAll();
		console.timeEnd('Expenses.filterByCategory');
	}

	/**
	 * @deprecated
	 */
	unserializeDate() {
		console.time('Expenses.unserializeDate');
		this.each((model: Transaction) => {
			let sDate = model.get('date');
			let dateObject = new Date(sDate);
			console.log(sDate, dateObject);
			model.set('date', dateObject);
		});
		console.timeEnd('Expenses.unserializeDate');
	}

	getVisible() {
		// visible is not a property in attributes anymore, so it does't work
		// return this.where({visible: true});
		return _(this.models).where({visible: true});
	}

	getVisibleCount() {
		return this.getVisible().length;
	}

	getSorted() {
		// this.sort();
		let visible = this.getVisible();
		// return visible;
		// const sorted = _.sortBy(visible, 'date');
		const sorted = visible.sort(this.comparator);

		/*const dates = [];
		sorted.forEach(el => {
			dates.push(el.getDate().toString('yyyy-MM-dd'));
		});
		console.log(dates);
		*/

		return sorted;
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
