/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />

import CollectionFetchOptions = Backbone.CollectionFetchOptions;

class Transaction extends Backbone.Model {

	// constructor(row) {
		//console.log('Transaction.initialize', row);
	// }

}

class Expenses extends Backbone.Collection<Transaction> {

	attributes = null;

	model = Transaction;

	csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.import.csv';

	fetch(options?: CollectionFetchOptions) {
		console.log('csvUrl', this.csvUrl);
		return $.get(this.csvUrl, (response, xhr) => {
			var csv = Papa.parse(response, {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true
			});
			//console.log(csv);
			_.map(csv.data, (row) => {
				//console.log(row);
				this.add(new Transaction(row));
			});
			if (options.success) {
				options.success.call();
			}
			this.trigger('change');
		});
	}

}

class ExpenseTable extends Backbone.View<Expenses> {

	model: Expenses;

	/**
	 * Too early, wait until initialize()
	 * @type {JQuery}
	 */
	//el = $('#expenseTable');

	template = _.template($('#rowTemplate').html());

	constructor(options?) {
		super(options);
		this.setElement($('#expenseTable'));
		this.listenTo(this.model, 'change', this.render);
	}

	render() {
		console.log('ExpenseTable.render()', this.model.size());
		console.log(this.model);
		var rows = [];
		this.model.each((transaction: Transaction) => {
			//console.log(transaction);
			var attributes = transaction.toJSON();
			if (attributes.hasOwnProperty('date')) {
				rows.push(this.template(attributes));
			} else {
				console.log('no date', attributes);
			}
		});
		console.log('rendering', rows.length, 'rows');
		this.$el.append(rows.join('\n'));
		//console.log(this.$el);
		return this;
	}

}

class AppView extends Backbone.View<Expenses> {

	model: Expenses;

	table = null;

	constructor() {
		console.log('construct AppView');
		this.setElement($('#app'));
		this.model = new Expenses();
		this.table = new ExpenseTable({
			model: this.model,
			el: $('#expenseTable')
		});

		this.startLoading();
		this.model.fetch({
			success: () => {
				this.stopLoading();
			}
		});

		this.listenTo(this.model, "change", this.render);
	}

	startLoading() {
		console.log('startLoading');
		var template = _.template($('#loadingBar').html());
		this.$el.html(template());
	}

	stopLoading() {
		console.log('stopLoading');
		this.$el.html('Done');
	}

	render() {
		console.log('AppView.render()', this.model);
		if (this.model && this.model.size()) {
			this.table.render();
			this.$el.html('Table shown');
		} else {
			this.startLoading();
		}
	}

}

$(function() {
	var app = new AppView();
	app.render();
});

