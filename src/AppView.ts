import Expenses from "./Expenses";
import ExpenseTable from "./ExpenseTable";
import CategoryCollection from "./CategoryCollection";
import CategoryView from "./CategoryView";
import MonthSelect from "./MonthSelect";
import Transaction from "./Transaction";
var elapse = require('elapse');
elapse.configure({
	debug: true
});

export default class AppView extends Backbone.View<Transaction> {

	model: Expenses;

	table: ExpenseTable;

	categoryList: CategoryCollection;

	categories: CategoryView;

	ms: MonthSelect;

	cache: JQuery;

	/**
	 * Make sure to provide model: Expenses in options
	 * @param options
	 */
	constructor(options?: any) {
		super(options);
		console.log('construct AppView');
		this.setElement($('#app'));
		var template = _.template($('#AppView').html());
		this.$el.html(template());

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

		this.ms = new MonthSelect();

		this.listenTo(this.model, "change", this.render);
		//this.listenTo(this.model, "change", this.table.render);
		//this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
		$('.custom-search-form input').on('keyup',
			_.debounce(this.onSearch.bind(this), 300));
	}

	render() {
		console.log('AppView.render()', this.model.size());
		this.table.render();
		//this.$el.html('Table shown');
		this.categories.change();
		return this;
	}

	onSearch(event) {
		var q = $(event.target).val();
		console.log(q);
		this.model.filterVisible(q);
		// trigger manually since filterVisible is silent
		this.model.trigger('change');
	}

	show() {
		elapse.time('AppView.show');
		this.ms.show();
		this.$el.html(this.cache);
		elapse.timeEnd('AppView.show');
	}

	hide() {
		elapse.time('AppView.hide');
		this.ms.hide();
		this.cache = this.$el.children().detach();
		elapse.timeEnd('AppView.hide');
	}

}
