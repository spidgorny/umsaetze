/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="Expenses.ts" />

import CollectionFetchOptions = Backbone.CollectionFetchOptions;
import Expenses from './Expenses';
import Transaction from './Transaction';
import ExpenseTable from './ExpenseTable';
import CategoryView from './CategoryView';
import CategoryCollection from "./CategoryCollection";

export function asyncLoop(arr: Array<any>, callback: Function, done?: Function) {
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

class AppView extends Backbone.View<Expenses> {

	model: Expenses;

	table: ExpenseTable;

	categoryList: CategoryCollection;

	categories: CategoryView;

	constructor(options) {
		super(options);
		console.log('construct AppView');
		this.setElement($('#app'));

		this.model = new Expenses();

		this.categoryList = new CategoryCollection();
		this.categoryList.setExpenses(this.model);

		this.table = new ExpenseTable({
			model: this.model,
			el: $('#expenseTable')
		});
		this.table.setCategoryList(this.categoryList);

		this.categories = new CategoryView({
			model: this.categoryList,
		});
		console.log('category view model', this.categories.model);

		this.startLoading();
		this.model.fetch({
			success: () => {
				this.stopLoading();
			}
		});

		this.listenTo(this.model, "change", this.render);
		//this.listenTo(this.model, "change", this.table.render);
		//this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
		$('.custom-search-form input').on('keyup', this.onSearch.bind(this));
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
		console.log('AppView.render()', this.model.size());
		this.table.render();
		this.$el.html('Table shown');
		this.categories.change();
		return this;
	}

	onSearch(event) {
		var q = $(event.target).val();
		console.log(q);
		this.model.filterVisible(q);
	}

}

$(function() {
	var app = new AppView();
	app.render();
});

