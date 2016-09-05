/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="umsaetze.ts" />
/// <reference path="Papa.d.ts" />

import {asyncLoop} from './umsaetze';
import Transaction from './Transaction';
import CollectionFetchOptions = Backbone.CollectionFetchOptions;

export default class Expenses extends Backbone.Collection<Transaction> {

	attributes = null;

	model = Transaction;

	csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';

	fetch(options: CollectionFetchOptions) {
		console.log('csvUrl', this.csvUrl);
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
				asyncLoop(csv.data, this.processRow.bind(this), this.processDone.bind(this, options));
			}
		});
	}

	processRow(row: Object, i: number, length: number) {
		var percent = Math.round(100 * i / length);
		//console.log(row);
		$('.progress .progress-bar').width(percent+'%');
		this.add(new Transaction(row));
		//this.trigger('change');
	}

	processDone(count, options?: CollectionFetchOptions) {
		console.log('asyncLoop finished', count);
		if (options.success) {
			options.success.call();
		}
		this.trigger('change');
	}

	getDateFrom() {
		let min = new Date().valueOf();
		this.each((row) => {
			let date: number = Date.parse(row.get('date'));
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getDateTill() {
		let min = new Date('1970-01-01').valueOf();
		this.each((row) => {
			let date: number = Date.parse(row.get('date'));
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

}
