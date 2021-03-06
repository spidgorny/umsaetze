///<reference path="../../node_modules/@types/backbone/index.d.ts" />

import Expenses from './Expenses';
import ExpenseTable from './ExpenseTable';
import CategoryCollection from '../Category/CategoryCollection';
import CategoryView from './CategoryView';
import MonthSelect from '../MonthSelect/MonthSelect';
import Transaction from './Transaction';
import {debug} from '../main';
import {CollectionController} from '../CollectionController';
import {ViewOptionsExpenses} from './ViewOptionsExpenses';
import $ from "jquery";
import * as _ from 'underscore';
import CategoryCollectionModel from "../Category/CategoryCollectionModel";
import KeywordCollection from "../Keyword/KeywordCollection";
import {MonthExpenses} from "./MonthExpenses";

// import Backbone from 'backbone-es6/src/Backbone.js';
// import elapse from 'elapse';

export default class AppView extends CollectionController<Expenses> {

	model: typeof Transaction;

	collection: Expenses;

	table: ExpenseTable;

	categoryList: CategoryCollection;

	keywords: KeywordCollection;

	categoryView: CategoryView;

	ms: MonthSelect;

	q: string = '';

	/**
	 * Make sure to provide collection: Expenses in options
	 * and this.categoryList as well
	 * @param options
	 * @param categoryList
	 * @param keywords
	 * @param monthSelect
	 */
	constructor(options: ViewOptionsExpenses<Transaction>,
				categoryList: CategoryCollection,
				keywords: KeywordCollection,
				monthSelect: MonthSelect) {
		super();
		// console.log('construct AppView');
		this.collection = options.viewCollection;
		this.setElement($('#app'));
		this.setTemplate();

		this.categoryList = categoryList;
		this.keywords = keywords;
		this.ms = monthSelect;

		let monthExpenses = new MonthExpenses(this.collection, this.ms.currentMonth);
		this.table = new ExpenseTable({
			model: monthExpenses,
			el: $('#expenseTable')
		}, this.keywords, this.categoryList);

		const categoryModel = new CategoryCollectionModel(this.categoryList);
		this.categoryView = new CategoryView({
			model: categoryModel
		}, this.ms.currentMonth, this.collection);
		//console.log('category view collection', this.categories.model);

		this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));
		this.listenTo(this.table, 'Category:change', this.categoryChanged.bind(this));

		// for filtering to know which month we're in
		this.collection.filterByMonth(this.ms.getSelected());

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
		console.log('AppView.render()', this.table.model.size(), '/', this.collection.size());
		this.setTemplate();

		// should not be done as any outside filter stop working
		// this.collection.setAllVisible();
		// this.collection.filterByMonth();

		// commented because the change event from CategoryCollection has rendered
		console.log('this.table.render()');
		this.table.render();

		this.categoryView.render();
		this.$el.find('#applyKeywords')
			.off('click')
			.on('click', this.applyKeywords.bind(this));
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

	/**
	 * MonthSelect:change event handler
	 */
	monthChange() {
		console.time('AppView.monthChange');
		this.collection.setAllVisible();						// silent
		this.collection.filterByMonth(this.ms.getSelected());	// silent
		this.collection.filterVisible(this.q);					// silent
		//this.render();	// will be called by getCategoriesFromExpenses()

		// not needed due to the line in the constructor
		// @see this.categoryList.setExpenses()
		// wrong. this is called by this.render()

		this.categoryList.getCategoriesFromExpenses();
		console.timeEnd('AppView.monthChange');
	}

	categoryChanged() {
		console.time('AppView.categoryChanged');
		this.categoryView.recalculate();
		console.timeEnd('AppView.categoryChanged');
	}

	onSearch(event) {
		this.q = $(event.target).val().toString();
		console.log('Searching: ', this.q);
		this.monthChange();	// reuse
		// trigger manually since filterVisible is silent
		//this.collection.trigger('change');
	}

	show() {
		super.show();
		console.time('AppView.show');

		// updated in the constructor once
		// this is needed after [Generate]
		this.ms.update(this.collection);

		this.render();
		this.categoryView.show();
		console.timeEnd('AppView.show');
	}

	hide() {
		console.time('AppView.hide');
		//this.ms.hide();	// this may be needed for History
		if (CollectionController.$('#expenseTable').length
			&& CollectionController.$('#expenseTable').is(':visible')) {
		}
		this.categoryView.hide();
		console.timeEnd('AppView.hide');
	}

	applyKeywords(event: MouseEvent) {
		event.preventDefault();
		console.log('applyKeywords');
		this.table.model.setCategories(this.keywords);
	}

}
