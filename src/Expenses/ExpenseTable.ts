///<reference path="../../node_modules/@types/backbone/index.d.ts" />
import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "../Category/CategoryCollection";
import KeywordCollection from "../Keyword/KeywordCollection";
import Keyword from "../Keyword/Keyword";
import {debug} from "../main";
import * as $ from 'jquery';
import * as _ from 'underscore';
import Backbone = require('backbone');
import CategoryCount from "../Category/CategoryCount";
import {CategoryPopup} from "./CategoryPopup";

// elapse.configure({
// 	debug: true
// });

export default class ExpenseTable extends Backbone.View<any> {

	model: Expenses;

	//collection: Expenses;

	categoryList: CategoryCollection;

	template = _.template($('#rowTemplate').html());

	keywords: KeywordCollection;

	categoryPopup: CategoryPopup;

	constructor(options, keywords: KeywordCollection, categoryList: CategoryCollection) {
		super(options);
		this.keywords = keywords;
		console.log('ExpenseTable.keywords', this.keywords);

		// in case we started with Sync page the table is not visible
		let $expenseTable = $('#expenseTable');
		if (!$expenseTable.length) {
			const template = _.template($('#AppView').html());
			$('#app').html(template());
		}

		this.setElement($expenseTable);

		// slow re-rendering of the whole table when collection changes
		//this.listenTo(this.collection, 'update', this.render);
		this.on("all", () => {
			debug("ExpenseTable")
		});

		this.categoryList = categoryList;
		this.listenTo(this.categoryList, 'change', this.render);

		this.categoryPopup = new CategoryPopup(this.$el, this.model, this.categoryList, this.keywords);
	}

	render(options?: any) {
		if (options && options.noRender) {
			console.log('ExpenseTable.noRender');
			return;
		}
		console.profile('ExpenseTable.render');
		console.log('ExpenseTable.render()', this.model.size());

		let table = this.getTransactionAttributesTable();
		let rows = [];
		table.forEach((attributes: Object) => {
			rows.push(this.template(attributes));
		});

		console.log('rendering', rows.length, 'rows');
		this.$el.html(rows.join('\n'));
		//console.log(this.$el);

		$('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
		$('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
		$('#numRows').html(this.model.getVisibleCount().toString());

		this.$el
			.off('change')
			.on('change', 'select', this.newCategory.bind(this));

		this.$el
			.off('click')
			.on('click', 'button.close', this.deleteRow.bind(this));

		this.$el
			.off('click')
			.on('click', 'input.checkedDone', this.onCheck.bind(this));

		this.categoryPopup.$el = this.$el;
		this.categoryPopup.bindEvents();

		console.profileEnd();
		return this;
	}

	getTransactionAttributesTable() {
		let visible = this.model.getSorted();
		let table = [];
		_.each(visible, (transaction: Transaction) => {
			const attributes = transaction.toJSON();
			attributes.sDate = transaction.getDate().toString('yyyy-MM-dd');
			attributes.cssClass = attributes.category == CategoryCount.DEFAULT
				? 'bg-warning' : '';
			attributes.categoryOptions = this.getCategoryOptions(transaction);
			attributes.background = this.categoryList.getColorFor(transaction.get('category'));
			attributes.checkedDone = transaction.get('done') ? 'checked' : '';
			attributes.amount = attributes.amount.toFixed(2);

			table.push(attributes);
		});
		// sortBy only works with direct attributes (not Model)
		//table = new Table(_.sortBy(table, 'date'));
		// table = new Table(_.sortBy(table, 'sDate'));
		// table = _.sortBy(table, el => {
		// 	return el.date;
		// });
		return table;
	}

	/**
	 * @deprecated - not working in Chrome
	 * @param event
	 */
	openSelect(event) {
		//console.log('openSelect', this, event);
		let $select = $(event.target);

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

			// $select.on('change', this.newCategory.bind(this));
		}
	}

	getCategoryOptions(transaction: Transaction) {
		let selected = transaction.get('category');
		let sOptions = [];
		let options = this.categoryList.getOptions();
		// console.log('options', options);
		$.each(options, (key, value) => {
			if (value == selected) {
				sOptions.push('<option selected>' + value + '</option>');
			} else {
				sOptions.push('<option>' + value + '</option>');
			}
		});
		// console.log('sOptions', sOptions);
		return sOptions.join('\n');
	}

	/**
	 * Triggered by UI change of category drop-down
	 * @param event
	 */
	newCategory(event) {
		console.log('newCategory');
		let $select = $(event.target);
		//console.log('selected', $select.val());
		let id = $select.closest('tr').attr('data-id');
		//console.log(id);
		let transaction = <Transaction>this.model.get(id);
		// console.log(transaction);
		if (transaction) {
			// console.log('Transaction id=', id);
			transaction.setCategory($select.val());
			// console.log(transaction.toJSON());
			//this.categoryList.trigger('change');
		} else {
			console.error('Transaction with id=', id, 'not found');
		}
	}

	deleteRow(event) {
		let button = $(event.target);
		let dataID = button.closest('tr').attr('data-id');
		console.log('deleteRow', dataID);
		this.model.remove(dataID);	// there are no events on 'remove'
		this.model.saveAll();

		console.log('this.render()');
		this.render();
	}

	onCheck(event: MouseEvent) {
		let checkbox = $(event.target);
		let id = checkbox.closest('tr').attr('data-id');
		let transaction = this.model.get(id);
		//console.log(checkbox, id, transaction);
		if (transaction) {
			transaction.set('done', true);
		}
	}

}
