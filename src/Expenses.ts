/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="umsaetze.ts" />
/// <reference path="Papa.d.ts" />

import {asyncLoop} from './umsaetze';
import Transaction from './Transaction';
import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import PersistenceOptions = Backbone.PersistenceOptions;
Backbone.LocalStorage = require("backbone.localstorage");
require('datejs');
var elapse = require('elapse');
elapse.configure({
	debug: true
});

export default class Expenses extends Backbone.Collection<Transaction> {

	attributes = null;

	model = Transaction;

	csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';

	prevPercent: number;

	slowUpdateLoadingBar: Function;

	localStorage: Backbone.LocalStorage;

	//url = 'expenses/';

	constructor() {
		super();
		this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
		this.localStorage = new Backbone.LocalStorage("Expenses");
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
		} else {
			return this.fetchCSV(_.extend(options || {}, {
				success: () => {
					elapse.time('Expense.saveModels2LS');
					console.log('models loaded, saving to LS');
					this.each((model: Transaction) => {
						this.localStorage.create(model);
					});
					elapse.timeEnd('Expense.saveModels2LS');
				}
			}));
		}
	}

	fetchCSV(options?: CollectionFetchOptions) {
		console.log('csvUrl', this.csvUrl);
		console.log('options', options);
		this.startLoading();
		return $.get(this.csvUrl, (response, xhr) => {
			var csv = Papa.parse(response, {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true
			});
			//console.log(csv);
			var processWithoutVisualFeedback = false;
			if (processWithoutVisualFeedback) {
				_.each(csv.data, this.processRow.bind(this));
				this.processDone(csv.data.length, options);
			} else {
				asyncLoop(csv.data,
					this.processRow.bind(this),
					this.processDone.bind(this, csv.data.length, options));
			}
		});
	}

	startLoading() {
		console.log('startLoading');
		this.prevPercent = 0;
		var template = _.template($('#loadingBarTemplate').html());
		$('#app').html(template());
	}

	processRow(row: any, i: number, length: number) {
		this.slowUpdateLoadingBar(i, length);
		if (row && row.amount) {
			this.add(new Transaction(row), { silent: true });
		}
	}

	updateLoadingBar(i: number, length: number) {
		var percent = Math.round(100 * i / length);
		//console.log('updateLoadingBar', i, percent);
		if (percent != this.prevPercent) {
			//console.log(percent);
			$('.progress#loadingBar .progress-bar').width(percent + '%');
			this.prevPercent = percent;
		}
	}

	processDone(count, options?: PersistenceOptions) {
		console.log('asyncLoop finished', count, options);
		if (options && options.success) {
			options.success();
		}
		this.setAllVisible();
		console.log('Trigger change on Expenses');
		this.trigger('change');
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
			let date: number = row.get('date').valueOf();
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
