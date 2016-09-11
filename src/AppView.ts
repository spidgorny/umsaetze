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

export default class AppView extends Backbone.View<Expenses> {

	model: Expenses;

	table: ExpenseTable;

	categoryList: CategoryCollection;

	categories: CategoryView;

	ms: MonthSelect;

	cache: JQuery;

	q: string = '';

	/**
	 * Make sure to provide model: Expenses in options
	 * and this.categoryList as well
	 * @param options
	 */
	constructor(options?: any) {
		super(options);
		console.log('construct AppView');
		this.setElement($('#app'));
		this.setTemplate();

		this.categoryList = options.categoryList;

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
		this.ms.earliest = this.model.getEarliest();
		this.ms.latest = this.model.getLatest();
		this.ms.render();
		this.listenTo(this.ms, 'MonthSelect:change', this.monthChange);

		this.listenTo(this.model, "change", this.render);
		//this.listenTo(this.model, "change", this.table.render);
		//this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
		$('.custom-search-form input').on('keyup',
			_.debounce(this.onSearch.bind(this), 300));
	}

	render() {
		console.log('AppView.render()', this.model.size());
		this.setTemplate();
		this.table.render();
		this.categoryList.triggerChange();
		return this;
	}

	setTemplate() {
		// if no table in DOM, reset it
		if (!$('#expenseTable').length) {
			var template = _.template($('#AppView').html());
			this.$el.html(template());

			// not created by constructor yet (already yes in render())
			if (this.table) {
				this.table.$el = $('#expenseTable');
			}
		}
	}

	monthChange() {
		elapse.time('AppView.monthChange');
		this.model.setAllVisible();							// silent
		this.model.filterByMonth(this.ms.getSelected());	// silent
		this.model.filterVisible(this.q);					// silent
		this.render();

		// not needed due to the line in the constructor
		// @see this.categoryList.setExpenses()
		// wrong. this is called by this.render()
		//this.categoryList.triggerChange();
		elapse.timeEnd('AppView.monthChange');
	}

	onSearch(event) {
		this.q = $(event.target).val();
		console.log('Searching: ', this.q);
		this.monthChange();	// reuse
		// trigger manually since filterVisible is silent
		//this.model.trigger('change');
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
