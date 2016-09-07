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

export default class Expenses extends Backbone.Collection<Transaction> {

	attributes = null;

	model = Transaction;

	csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';

	prevPercent: number;

	slowUpdateLoadingBar: Function;

	constructor() {
		super();
		this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
		this.localStorage = new Backbone.LocalStorage("Expenses");
	}

	fetch(options?: CollectionFetchOptions) {
		console.log('csvUrl', this.csvUrl);
		this.startLoading();
		return $.get(this.csvUrl, (response, xhr) => {
			var csv = Papa.parse(response, {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true
			});
			//console.log(csv);
			if (false) {
				_.each(csv.data, this.processRow.bind(this));
				this.processDone(csv.data.length, options);
			} else {
				this.prevPercent = 0;
				asyncLoop(csv.data, this.processRow.bind(this), this.processDone.bind(this, options));
			}
		});
	}

	processRow(row: Object, i: number, length: number) {
		this.slowUpdateLoadingBar(i, length);
		if (row && row.amount) {
			this.add(new Transaction(row));
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
		console.log('asyncLoop finished', count);
		if (options.success) {
			options.success.call();
		}
		console.log('Trigger change on Expenses');
		this.stopLoading();
		this.trigger('change');
	}

	startLoading() {
		console.log('startLoading');
		var template = _.template($('#loadingBarTemplate').html());
		$('#app').html(template());
	}

	stopLoading() {
		console.log('stopLoading');
		$('#app').html('Done');
	}

	getDateFrom() {
		let min = new Date().valueOf();
		this.each((row: Transaction) => {
			let date: number = row.get('date').valueOf();
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getDateTill() {
		let min = new Date('1970-01-01').valueOf();
		this.each((row: Transaction) => {
			let date: number = row.get('date').valueOf();
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

	filterVisible(q: string) {
		this.each((row: Transaction) => {
			if (row.get('note').indexOf(q) == -1) {
				row.set('visible', false, { noRender: true, silent: true });
			} else {
				row.set('visible', true, { noRender: true, silent: true });
			}
		});
	}
}
