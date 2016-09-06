import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "./CategoryCollection";

export default class ExpenseTable extends Backbone.View<Expenses> {

	model: Expenses;

	categoryList: CategoryCollection;

	template = _.template($('#rowTemplate').html());

	constructor(options?) {
		super(options);
		this.setElement($('#expenseTable'));
		this.listenTo(this.model, 'change', this.render.bind(this));
	}

	setCategoryList(list: CategoryCollection) {
		this.categoryList = list;
	}

	render() {
		console.log('ExpenseTable.render()', this.model.size());
		console.log(this.model);
		var rows = [];
		this.model.each((transaction: Transaction) => {
			//console.log(transaction);
			var attributes = transaction.toJSON();

			//if (attributes.amount == -15.53) {
				//console.log(attributes, transaction);
			//}

			if (attributes.hasOwnProperty('date')) {
				rows.push(this.template(attributes));
			} else {
				console.log('no date', attributes);
			}
		});
		console.log('rendering', rows.length, 'rows');
		this.$el.append(rows.join('\n'));
		//console.log(this.$el);

		$('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
		$('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));

		this.$el.on('click', 'select', this.openSelect.bind(this));

		return this;
	}

	openSelect(event) {
		//console.log('openSelect', this, event);
		var $select = $(event.target);
		if ($select.find('option').length == 1) {
			let defVal = $select.find('option').html();
			let options = this.categoryList.getOptions();
			console.log(options);
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
		let transaction = this.model.get(id);
		//console.log(transaction);
		if (transaction) {
			transaction.setCategory($select.val());
		}
	}

}
