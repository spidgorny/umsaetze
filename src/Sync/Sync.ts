///<reference path="../../typings/index.d.ts"/>
/// <reference path="Table.ts" />

import Expenses from "../Expenses/Expenses";
import Transaction from "../Expenses/Transaction";
import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import {asyncLoop} from "../umsaetze";
import PersistenceOptions = Backbone.PersistenceOptions;
import Workspace from "../Workspace";
import ParseCSV from "./ParseCSV";
import Table from "./Table";

require('file-saver');
function saveAs(a: any, b: any);

let elapse = require('elapse');
elapse.configure({
	debug: true
});
const toastr = require('toastr');
const chance = require('chance').Chance();
const Backbone = require('backbone');
const bbls = require('backbone.localstorage');
const $ = require('jquery');
const _ = require('underscore');

export default class Sync extends Backbone.View<any> {

	$el = $('#app');

	template;

	model: Expenses;

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
		//console.log(e.target.result);
		this.loadSelectedFile(e.target.result);
	}

	loadSelectedFile(data: string) {
		this.startLoading();

		let parser = new ParseCSV(data);
		let csv = parser.parseAndNormalize();

		return this.fetchCSV(csv, {
			success: () => {
				elapse.time('Expense.saveModels2LS');
				console.log('models loaded, saving to LS');
				this.model.each((model: Transaction) => {
					this.localStorage.create(model);
				});
				elapse.timeEnd('Expense.saveModels2LS');
			}
		});
	}

	fetchCSV(csv: Table, options: PersistenceOptions) {
		let processWithoutVisualFeedback = false;
		if (processWithoutVisualFeedback) {
			_.each(csv, this.processRow.bind(this));
			this.processDone(csv.length, options);
		} else {
			asyncLoop(csv,
				this.processRow.bind(this),
				this.processDone.bind(this, csv.length, options));
		}
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

		// this makes all months visible at once
		// this.model.setAllVisible();

		console.log('Trigger change on Expenses');
		this.model.trigger('change');
		Backbone.history.navigate('#', {
			trigger: true,
		});
	}

	loadJSON(e, file) {
		// console.log('loadJSON', e);
		// console.log(file);
		// console.log(e.target.result);
		try {
			let data = JSON.parse(e.target.result);
			toastr.info('Importing '+data.length+' entries');
			_.each(data, (row) => {
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
		//console.log(data);
		let json = JSON.stringify(data, null, '\t');
		let blob = new Blob([json], {
			type: "application/json;charset=utf-8"
		});
		let filename = "umsaetze-"+Date.today().toString('yyyy-MM-dd')+'.json';
		//console.log(filename);
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
		let categories = this.router.categoryList;
		for (let i of _.range(amount)) {
			let category = categories.random();
			this.model.add(new Transaction({
				account: account,
				category: category.get('catName') || "Default",
				currency: "EUR",
				amount: chance.floating({fixed: 2, min: -1000, max: 1000}),
				payment_type: "DEBIT_CARD",
				date: chance.date({year: new Date().getFullYear()}),
				note: chance.sentence(),
			}));
		}
		toastr.success('Generated '+amount+' records.');
		this.model.trigger('change');
		Backbone.history.navigate('#', {
			trigger: true,
		});
	}

}
