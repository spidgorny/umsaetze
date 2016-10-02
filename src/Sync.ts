///<reference path="../typings/index.d.ts"/>

import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import {asyncLoop} from "./umsaetze";
import PersistenceOptions = Backbone.PersistenceOptions;
import Workspace from "./Workspace";
require('file-saver');
let elapse = require('elapse');
elapse.configure({
	debug: true
});
const toastr = require('toastr');
const chance = require('chance').Chance();
const Papa = require('papaparse');
const bb = require('backbone');
const bbls = require('backbone.localstorage');
const $ = require('jquery');
const _ = require('underscore');

export default class Sync extends bb.View<any> {

	$el = $('#app');

	template;

	model: Expenses;

	csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';

	slowUpdateLoadingBar: Function;

	localStorage = new bbls("Expenses");

	prevPercent: number;

	router: Workspace;

	constructor(expenses: Expenses) {
		super();
		this.model = expenses;
		this.listenTo(this.model, 'change', this.render);
		this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);

		let $SyncPage = $('#SyncPage');
		$SyncPage.load($SyncPage.attr('src'), (html) => {
			this.template = _.template(html);
			this.render();
		});
	}

	render() {
		if (this.template) {
			this.$el.html(this.template({
				memoryRows: this.model.size(),
				lsRows: this.localStorage.records.length,
			}));
			this.$('#Refresh').on('click', this.refresh.bind(this));
			this.$('#Generate').on('click', this.generate.bind(this));

			//this.$('#Load').on('click', this.load.bind(this));
			FileReaderJS.setupInput(document.getElementById('file-input-csv'), {
				readAsDefault: 'Text',
				on: {
					load: this.load.bind(this),
				}
			});

			// this.$('#LoadJSON').on('click', this.loadJSON.bind(this));
			FileReaderJS.setupInput(document.getElementById('file-input-json'), {
				readAsDefault: 'Text',
				on: {
					load: this.loadJSON.bind(this),
				}
			});

			this.$('#Save').on('click', this.save.bind(this));
			this.$('#Clear').on('click', this.clear.bind(this));
		} else {
			this.$el.html('Loading ...');
		}
		return this;
	}

	refresh() {
		toastr.success('Refreshing...');
		this.render();
	}

	load(e, file) {
		console.log(e, file);
		console.log(e.target.result);
		this.loadSelectedFile(e.target.result);
	}

	loadSelectedFile(data) {
		//var file = prompt('file');
		// let file = this.csvUrl;
		let options = {
			data: data,
		};
		return this.fetchCSV(options, {
			success: () => {
				elapse.time('Expense.saveModels2LS');
				console.log('models loaded, saving to LS');
				this.model.each((model: Transaction) => {
					this.localStorage.create(model);
				});
				elapse.timeEnd('Expense.saveModels2LS');
			}
		}));
	}

	fetchCSV(options?: CollectionFetchOptions) {
		console.log('csvUrl', this.csvUrl);
		console.log('options', options);
		this.startLoading();
		// not ajax anymore
		//return $.get(this.csvUrl, (response, xhr) => {
		let response = options.data;
		let csv = Papa.parse(response, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true
		});
		//console.log(csv);
		let processWithoutVisualFeedback = false;
		if (processWithoutVisualFeedback) {
			_.each(csv.data, this.processRow.bind(this));
			this.processDone(csv.data.length, options);
		} else {
			asyncLoop(csv.data,
				this.processRow.bind(this),
				this.processDone.bind(this, csv.data.length, options));
		}
		// });
	}

	startLoading() {
		console.log('startLoading');
		this.prevPercent = 0;
		let template = _.template($('#loadingBarTemplate').html());
		this.$('.panel-footer').html(template());
	}

	processRow(row: any, i: number, length: number) {
		this.slowUpdateLoadingBar(i, length);
		if (row && row.amount) {
			this.model.add(new Transaction(row), { silent: true });
		}
	}

	updateLoadingBar(i: number, length: number) {
		let percent = Math.round(100 * i / length);
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
		this.model.setAllVisible();
		console.log('Trigger change on Expenses');
		this.model.trigger('change');
		Backbone.history.navigate('#', {
			trigger: true,
		});
	}

	loadJSON(e, file)
	{
		// console.log('loadJSON', e);
		// console.log(file);
		// console.log(e.target.result);
		try {
			let data = JSON.parse(e.target.result);
			toastr.info('Importing '+data.length+' entries');
			_.each(data, (row) {
				this.model.add(new Transaction(row));
			});
			toastr.success('Imported');
			this.model.trigger('change');
			Backbone.history.navigate('#', {
				trigger: true,
			});
		} catch (e) {
			alert(e);
		}
	}

	save() {
		let data = this.model.localStorage.findAll();
		console.log(data);
		let json = JSON.stringify(data, null, '\t');
		let blob = new Blob([json], {
			type: "application/json;charset=utf-8"
		});
		let filename = "umsaetze-"+Date.today().toString('yyyy-MM-dd')+'.json';
		console.log(filename);
		saveAs(blob, filename);
	}

	clear() {
		console.log('clear');
		if (confirm('Delete *ALL* entries from Local Storage? Make sure you have exported data first.')) {
			let localStorage = new Backbone.LocalStorage("Expenses");
			localStorage._clear();
			if (this.model) {
				this.model.clear();
			}
			this.render();
		}
	}

	generate() {
		toastr.info('Generating...');
		let amount = 100;
		let account = chance.word();
		for (let i of _.range(amount)) {
			this.model.add(new Transaction({
				account: account,
				category: "Default",
				currency: "EUR",
				amount: chance.floating({fixed: 2, min: -1000, max: 1000}),
				payment_type: "DEBIT_CARD",
				date: chance.date({year: new Date().getFullYear()}),
				note: chance.sentence(),
			}));
		}
		toastr.success('Generated '+amount+' records.');
		// this.collection.setAllVisible();
		this.model.trigger('change');
		// this.router.AppView();
		Backbone.history.navigate('#', {
			trigger: true,
		});
	}

}
