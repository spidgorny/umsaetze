import Expenses from "./Expenses";
import Transaction from "./Transaction";

export default class ExpenseTable extends Backbone.View<Expenses> {

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

		$('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
		$('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));

		this.$el.on('click', 'select', this.openSelect.bind(this));

		return this;
	}

	openSelect(event) {
		console.log('openSelect', this, event);
		var $select = $(event.target);
		if ($select.find('option').length == 1) {
			this.
		}
	}

}
