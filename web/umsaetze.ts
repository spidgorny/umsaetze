/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />

import CollectionFetchOptions = Backbone.CollectionFetchOptions;

class Transaction extends Backbone.Model {

	initialize(row) {
		//console.log('Transaction.initialize', row);
	}

}

class Expenses extends Backbone.Collection<Transaction> {

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
			console.log(csv);
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

	/**
	 * Too early, wait until initialize()
	 * @type {JQuery}
	 */
	el = $('#expenseTable');

	template = _.template($('#rowTemplate').html());

	initialize() {
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
		console.log(this.$el);
		return this;
	}

}

var AppView = Backbone.View.extend({

	el: $('#app'),

	collection: null,

	table: null,

	initialize: function() {
		console.log('construct AppView');
		this.listenTo(this.model, "change", this.render);
		this.collection = new Expenses();
		this.table = new ExpenseTable({
			model: this.collection,
		});

		this.startLoading();
		this.collection.fetch({
			success: () => {
				this.stopLoading();
			}
		});
	},

	startLoading: function () {
		console.log('startLoading');
		var template = _.template($('#loadingBar').html());
		this.$el.html(template());
	},

	stopLoading: function () {
		console.log('stopLoading');
		this.$el.html('Done');
	},

	render: function() {
		console.log('AppView.render()');
		if (this.collection.size()) {
			this.$el.html(
				this.table
			);
		} else {
			this.startLoading();
		}
	}

});

$(function() {
	var app = new AppView();
	app.render();
});

