/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />

import CollectionFetchOptions = Backbone.CollectionFetchOptions;

class Transaction extends Backbone.Model {

	date: Date;
	category: String;
	amount: Number;
	note: String;

	// constructor(row) {
		//console.log('Transaction.initialize', row);
	// }

}

function asyncLoop(arr: Array<any>, callback: Function, done?: Function) {
	(function loop(i) {

		callback(arr[i], i, arr.length);                            //callback when the loop goes on

		if (i < arr.length) {                      //the condition
			setTimeout(function() {loop(++i)}, 1); //rerun when condition is true
		} else {
			if (done) {
				done(arr.length);                            //callback when the loop ends
			}
		}
	}(0));                                         //start with 0
}

class Expenses extends Backbone.Collection<Transaction> {

	attributes = null;

	model = Transaction;

	csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';

	fetch(options?: CollectionFetchOptions) {
		console.log('csvUrl', this.csvUrl);
		return $.get(this.csvUrl, (response, xhr) => {
			var csv = Papa.parse(response, {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true
			});
			//console.log(csv);
			_.each(csv.data, this.processRow.bind(this));
			this.processDone(csv.data.length, options);
			// asyncLoop(csv.data, this.processRow.bind(this),	this.processDone.bind(this));
		});
	}

	processRow(row: Array, i: Number, length: Number) {
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

class CategoryCount {
	catName: String;
	count: Number;
	amount: Number;
}

class CategoryView extends Backbone.View<Expenses> {

	model: Expenses;

	categoryCount = [];

	template = _.template($('#categoryTemplate').html());

	constructor(options) {
		super(options);
		this.setElement($('#categories'));
		this.categoryCount = [];
	}

	render() {
		var content = [];
		var sum: Number = <Number>_.reduce(this.categoryCount,
			(memo, item: CategoryCount) => {
			// only expenses
			if (item.catName != 'Default' && item.amount < 0) {
				return memo + item.amount;
			} else {
				return memo;
			}
		}, 0);
		console.log('sum', sum);

		this.categoryCount = _.sortBy(this.categoryCount, (el: CategoryCount) => {
			return -el.amount;
		}).reverse();

		_.each(this.categoryCount, (catCount: CategoryCount) => {
			if (catCount.catName != 'Default' && catCount.amount < 0) {
				var width = Math.round(100 * (-catCount.amount) / -sum) + '%';
				console.log(catCount.catName, width, catCount.count, catCount.amount);
				content.push(this.template(
					_.extend(catCount, {
						width: width,
						amount: Math.round(catCount.amount),
					})
				));
			}
		});
		this.$el.html(content.join('\n'));
		return this;
	}

	change() {
		console.log('model changed', this.model.size());
		this.model.each((transaction: Transaction) => {
			var categoryName = transaction.get('category');
			var exists = _.findWhere(this.categoryCount, {catName: categoryName});
			if (exists) {
				exists.count++;
				exists.amount += parseFloat(transaction.get('amount'));
			} else {
				this.categoryCount.push({
					catName: categoryName,
					count: 0,
					amount: 0,
				});
			}
		});
		console.log(this.categoryCount);
		this.render();
	}

}

class AppView extends Backbone.View<Expenses> {

	model: Expenses;

	table: ExpenseTable;

	categories: CategoryView;

	constructor(options) {
		super(options);
		console.log('construct AppView');
		this.setElement($('#app'));
		this.model = new Expenses();
		this.table = new ExpenseTable({
			model: this.model,
			el: $('#expenseTable')
		});
		this.categories = new CategoryView({
			model: this.model,
		});

		this.startLoading();
		this.model.fetch({
			success: () => {
				this.stopLoading();
			}
		});

		this.listenTo(this.model, "change", this.render.bind(this));
		this.listenTo(this.model, "change", this.categories.change.bind(this.categories));
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
			//this.categories.render();
		} else {
			this.startLoading();
		}
	}

}

$(function() {
	var app = new AppView();
	app.render();
});

