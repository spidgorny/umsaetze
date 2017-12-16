///<reference path="../node_modules/@types/backbone/index.d.ts" />
import Expenses from './Expenses/Expenses';
import ExpenseTable from './Expenses/ExpenseTable';
import CategoryCollection from './Category/CategoryCollection';
import CategoryView from './Category/CategoryView';
import MonthSelect from './MonthSelect';
import Transaction from './Expenses/Transaction';
import {debug} from './main';
import { CollectionController } from './CollectionController';
import { ViewOptionsExpenses } from './ViewOptionsExpenses';
// import Backbone from 'backbone-es6/src/Backbone.js';
// import elapse from 'elapse';
import * as $ from "jquery";
import * as _ from 'underscore';

// elapse.configure({
// 	debug: true
// });

export default class AppView extends CollectionController<Expenses> {

	model: typeof Transaction;

	collection: Expenses;

	table: ExpenseTable;

	categoryList: CategoryCollection;

	categories: CategoryView;

	ms: MonthSelect;

	q: string = '';

	/**
	 * Make sure to provide collection: Expenses in options
	 * and this.categoryList as well
	 * @param options
	 * @param categoryList
	 */
	constructor(options: ViewOptionsExpenses<Transaction>, categoryList: CategoryCollection) {
		super(options);
		console.log('construct AppView');
		this.collection = options.viewCollection;
		this.setElement($('#app'));
		this.setTemplate();

		this.categoryList = categoryList;

		this.table = new ExpenseTable({
			model: this.collection,
			el: $('#expenseTable')
		});
		this.table.setCategoryList(this.categoryList);

		this.categories = new CategoryView({
			model: this.categoryList
		});
		this.categories.setExpenses(this.collection);
		//console.log('category view collection', this.categories.model);

		this.ms = MonthSelect.getInstance();
		this.ms.earliest = this.collection.getEarliest();
		this.ms.latest = this.collection.getLatest();
		this.ms.render();
		this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));

		this.collection.selectedMonth = this.ms.getSelected();	// for filtering to know which month we're in

		this.listenTo(this.collection, 'change', this.render);
		//this.listenTo(this.collection, "change", this.table.render);
		//this.listenTo(this.collection, "change", this.categories.change); // wrong collection inside ? wft?!
		$('.custom-search-form input').on('keyup',
			_.debounce(this.onSearch.bind(this), 300));
		this.on('all', () => {
			debug('AppView')
		});
	}

	render() {
		//if (!['', '#'].includes(window.location.hash)) return;
		console.log('AppView.render()', this.collection.size());
		this.setTemplate();

		// should not be done as any outside filter stop working
		// this.collection.setAllVisible();
		// this.collection.filterByMonth();

		this.table.render();
		this.categories.render();
		CollectionController.$('#applyKeywords').on('click', this.applyKeywords.bind(this));
		// let popover = $('[data-toggle="popover"]').popover();
		// console.log(popover);
		return this;
	}

	setTemplate() {
		// if no table in DOM, reset it
		if (!CollectionController.$('#expenseTable').length) {
			let template = _.template($('#AppView').html());
			this.$el.html(template());

			// not created by constructor yet (already yes in render())
			if (this.table) {
				this.table.$el = $('#expenseTable');
			}
		}
	}

	monthChange() {
		console.profile('AppView.monthChange');
		this.collection.setAllVisible();						// silent
		this.collection.filterByMonth(this.ms.getSelected());	// silent
		this.collection.filterVisible(this.q);					// silent
		//this.render();	// will be called by getCategoriesFromExpenses()

		// not needed due to the line in the constructor
		// @see this.categoryList.setExpenses()
		// wrong. this is called by this.render()

		this.categoryList.getCategoriesFromExpenses();
		console.profileEnd();
	}

	onSearch(event) {
		this.q = $(event.target).val().toString();
		console.log('Searching: ', this.q);
		this.monthChange();	// reuse
		// trigger manually since filterVisible is silent
		//this.collection.trigger('change');
	}

	show() {
		console.profile('AppView.show');

		this.ms.earliest = this.collection.getEarliest();
		this.ms.latest = this.collection.getLatest();
		console.log('MonthSelect range',
			this.ms.earliest.toString('yyyy-MM-dd'),
			this.ms.latest.toString('yyyy-MM-dd'), this.collection.size());
		this.ms.show();

		this.render();
		this.categories.show();
		console.profileEnd();
	}

	hide() {
		console.profile('AppView.hide');
		//this.ms.hide();	// this may be needed for History
		if (CollectionController.$('#expenseTable').length
			&& CollectionController.$('#expenseTable').is(':visible')) {
		}
		this.categories.hide();
		console.profileEnd();
	}

	applyKeywords(event: MouseEvent) {
		event.preventDefault();
		console.log('applyKeywords');
		this.table.model.setCategories(this.table.keywords);
	}

}
