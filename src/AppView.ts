import Expenses from "./Expenses";
import ExpenseTable from "./ExpenseTable";
import CategoryCollection from "./CategoryCollection";
import CategoryView from "./CategoryView";

export default class AppView extends Backbone.View<Expenses> {

	model: Expenses;

	table: ExpenseTable;

	categoryList: CategoryCollection;

	categories: CategoryView;

	constructor(options?: any) {
		super(options);
		console.log('construct AppView');
		this.setElement($('#app'));
		var template = _.template($('#AppView').html());
		this.$el.html(template());

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

		this.model.fetch();

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

}