import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "./CategoryCollection";
var elapse = require('elapse');
elapse.configure({
	debug: true
});

export default class ExpenseTable extends Backbone.View<Expenses> {

	model: Expenses;

	categoryList: CategoryCollection;

	template = _.template($('#rowTemplate').html());

	constructor(options?) {
		super(options);

		// in case we started with Sync page the table is not visible
		if (!$('#expenseTable').length) {
			var template = _.template($('#AppView').html());
			$('#app').html(template());
		}

		this.setElement($('#expenseTable'));

		// slow re-rendering of the whole table when model changes
		//this.listenTo(this.model, 'change', this.render);
	}

	setCategoryList(list: CategoryCollection) {
		this.categoryList = list;
	}

	render(options?: any) {
		if (options && options.noRender) {
			console.log('ExpenseTable.noRender');
			return;
		}
		elapse.time('ExpenseTable.render');
		console.log('ExpenseTable.render()', this.model.size());

		var rows = [];
		let visible = this.model.getVisible();
		_.each(visible, (transaction: Transaction) => {
			//console.log(transaction);
			var attributes = transaction.toJSON();
			attributes.sDate = attributes.date.toString('yyyy-MM-dd');
			attributes.cssClass = attributes.category == 'Default'
				? 'bg-warning' : '';
			rows.push(this.template(attributes));
		});
		console.log('rendering', rows.length, 'rows');
		this.$el.html(rows.join('\n'));
		//console.log(this.$el);

		$('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
		$('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
		$('#numRows').html(this.model.getVisibleCount().toString());

		this.$el.on('click', 'select', this.openSelect.bind(this));

		elapse.timeEnd('ExpenseTable.render');
		return this;
	}

	openSelect(event) {
		//console.log('openSelect', this, event);
		var $select = $(event.target);

		//if ($select.find('option').length == 1) {
		{
			let defVal = $select.find('option').html();
			$select.find('option').remove();
			let options = this.categoryList.getOptions();
			//console.log(options);
			$.each(options, (key, value) => {
				if (value != defVal) {
					$select
						.append($("<option></option>")
							.attr("value", value)
							.text(value));
				}
			});
			$select.on('change', this.newCategory.bind(this));
		}
	}

	newCategory(event) {
		//console.log(event);
		let $select = $(event.target);
		//console.log('selected', $select.val());
		var id = $select.closest('tr').attr('data-id');
		//console.log(id);
		let transaction = <Transaction>this.model.get(id);
		// console.log(transaction);
		if (transaction) {
			console.log('Transaction id=', id);
			transaction.setCategory($select.val());
			console.log(transaction.toJSON());
			//this.categoryList.trigger('change');
		} else {
			console.error('Transaction with id=', id, 'not found');
		}
	}

}
