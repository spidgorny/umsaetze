import Expenses from "./Expenses/Expenses";
import ExpenseTable from "./Expenses/ExpenseTable";
import CategoryCollection from "./Category/CategoryCollection";
import CategoryView from "./Category/CategoryView";
import MonthSelect from "./MonthSelect";
import ViewOptions = Backbone.ViewOptions;
import Transaction from "./Expenses/Transaction";
import {debug} from "./umsaetze";
// import Backbone from 'backbone';
let elapse = require('elapse');
elapse.configure({
	debug: true
});
let Backbone = require('backbone');
let $ = require('jquery');
let _ = require('underscore');

export default class AppView extends Backbone.View<Expenses> {

	model: Transaction;

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
	 */
	constructor(options?: ViewOptions<Transaction>, categoryList: CategoryCollection) {
		super(options);
		console.log('construct AppView');
		this.collection = options.collection;
		this.setElement($('#app'));
		this.setTemplate();

		this.categoryList = categoryList;

		this.table = new ExpenseTable({
			model: this.collection,
			el: $('#expenseTable')
		});
		this.table.setCategoryList(this.categoryList);

		this.categories = new CategoryView({
			model: this.categoryList,
		});
		this.categories.setExpenses(this.collection);
		//console.log('category view collection', this.categories.model);

		this.ms = new MonthSelect();
		this.ms.earliest = this.collection.getEarliest();
		this.ms.latest = this.collection.getLatest();
		this.ms.render();
		this.listenTo(this.ms, 'MonthSelect:change', this.monthChange);

		this.collection.selectedMonth = this.ms.getSelected();	// for filtering to know which month we're in

		this.listenTo(this.collection, "change", this.render);
		//this.listenTo(this.collection, "change", this.table.render);
		//this.listenTo(this.collection, "change", this.categories.change); // wrong collection inside ? wft?!
		$('.custom-search-form input').on('keyup',
			_.debounce(this.onSearch.bind(this), 300));
		this.on("all", debug("AppView"));
	}

	render() {
		if (!['', '#'].includes(window.location.hash)) return;
		console.log('AppView.render()', this.collection.size());
		this.setTemplate();
		this.table.render();
		this.categories.render();
		this.$('#applyKeywords').on('click', this.applyKeywords.bind(this));
		return this;
	}

	setTemplate() {
		// if no table in DOM, reset it
		if (!this.$('#expenseTable').length) {
			let template = _.template($('#AppView').html());
			this.$el.html(template());

			// not created by constructor yet (already yes in render())
			if (this.table) {
				this.table.$el = $('#expenseTable');
			}
		}
	}

	monthChange() {
		elapse.time('AppView.monthChange');
		this.collection.setAllVisible();						// silent
		this.collection.filterByMonth(this.ms.getSelected());	// silent
		this.collection.filterVisible(this.q);					// silent
		//this.render();	// will be called by getCategoriesFromExpenses()

		// not needed due to the line in the constructor
		// @see this.categoryList.setExpenses()
		// wrong. this is called by this.render()

		this.categoryList.getCategoriesFromExpenses();
		elapse.timeEnd('AppView.monthChange');
	}

	onSearch(event) {
		this.q = $(event.target).val();
		console.log('Searching: ', this.q);
		this.monthChange();	// reuse
		// trigger manually since filterVisible is silent
		//this.collection.trigger('change');
	}

	show() {
		elapse.time('AppView.show');

		this.ms.earliest = this.collection.getEarliest();
		this.ms.latest = this.collection.getLatest();
		console.log('MonthSelect range',
			this.ms.earliest.toString('yyyy-MM-dd'),
			this.ms.latest.toString('yyyy-MM-dd'), this.collection.size());
		this.ms.show();

		this.render();
		this.categories.show();
		elapse.timeEnd('AppView.show');
	}

	hide() {
		elapse.time('AppView.hide');
		this.ms.hide();
		if (this.$('#expenseTable').length
			&& this.$('#expenseTable').is(':visible')) {
		}
		this.categories.hide();
		elapse.timeEnd('AppView.hide');
	}

	applyKeywords(event: MouseEvent) {
		event.preventDefault();
		console.log('applyKeywords');
		this.table.model.setCategories(this.table.keywords);
	}

}
