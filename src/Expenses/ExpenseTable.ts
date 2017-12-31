///<reference path="../../node_modules/@types/backbone/index.d.ts" />
import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "../Category/CategoryCollection";
import KeywordCollection from "../Keyword/KeywordCollection";
import Keyword from "../Keyword/Keyword";
import {debug} from "../main";
import Table from "../Sync/Table";
// import View from 'backbone-es6/src/View.js';
import * as $ from 'jquery';
import * as _ from 'underscore';
import handlebars from 'handlebars';
// import elapse from 'elapse';
import Backbone = require('backbone');

// elapse.configure({
// 	debug: true
// });

export default class ExpenseTable extends Backbone.View<any> {

	model: Expenses;

	//collection: Expenses;

	categoryList: CategoryCollection;

	template = _.template($('#rowTemplate').html());

	keywords: KeywordCollection;

	constructor(options, keywords: KeywordCollection) {
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
	}

	setCategoryList(list: CategoryCollection) {
		this.categoryList = list;
		this.listenTo(this.categoryList, 'change', this.render);
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

		this.$el.on('change', 'select', this.newCategory.bind(this));
		this.$el.on('mouseup', 'td.note', this.textSelectedEvent.bind(this));
		this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
		this.$el.on('click', 'input.checkedDone', this.onCheck.bind(this));

		console.profileEnd();
		return this;
	}

	getTransactionAttributesTable() {
		let visible = this.model.getVisible();
		let table = new Table();
		_.each(visible, (transaction: Transaction) => {
			let attributes = transaction.toJSON();
			attributes.sDate = transaction.getDate().toString('yyyy-MM-dd');
			attributes.cssClass = attributes.category == 'Default'
				? 'bg-warning' : '';
			attributes.categoryOptions = this.getCategoryOptions(transaction);
			attributes.background = this.categoryList.getColorFor(transaction.get('category'));
			attributes.checkedDone = transaction.get('done') ? 'checked' : '';
			attributes.amount = attributes.amount.toFixed(2);

			table.push(attributes);
		});
		// sortBy only works with direct attributes (not Model)
		table = new Table(_.sortBy(table, 'date'));
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
			$select.on('change', this.newCategory.bind(this));
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

	textSelectedEvent(event: MouseEvent) {
		// console.log('textSelectedEvent');
		let text = ExpenseTable.getSelectedText().trim();
		if (text) {
			//console.log(text);
			let $contextMenu = $('#contextMenu');
			if (!$contextMenu.length) {
				let template = handlebars.compile($('#categoryMenu').html());
				let menuHTML = template({
					catlist: this.categoryList.getOptions(),
				});
				$('body').append(menuHTML);
				$contextMenu = $('#contextMenu');	// after append
				console.log($contextMenu, event.clientX, event.clientY);
			}
			this.openMenu($contextMenu, event.clientX, event.clientY, this.applyFilter.bind(this, text));
		}
	}

	static getSelectedText() {
		if (window.getSelection) {
			return window.getSelection().toString();
		} else if (typeof document['selection'] != 'undefined') {
			return document['selection'].createRange().text;
		}
		return '';
	}

	/**
	 * Opens a popup menu at the specified position
	 * @param menuSelector
	 * @param clientX
	 * @param clientY
	 * @param callback
	 */
	openMenu(menuSelector, clientX, clientY, callback) {
		let $menu = $(menuSelector)
			.show()
			.css({
				position: "absolute",
				left: ExpenseTable.getMenuPosition(clientX, 'width', 'scrollLeft', menuSelector),
				top: ExpenseTable.getMenuPosition(clientY, 'height', 'scrollTop', menuSelector)
			})
			.off('click')
			.on('click', 'a', function (e) {
				let $selectedMenu = $(e.target);
				if ($selectedMenu.length) {
					$menu.hide();
					callback.call(this, $selectedMenu);
				}
			});
		//console.log($menu);

		// make sure menu closes on any click
		// since we use onmouseup we can't immediately close the popup
		setTimeout(function () {
			$('body').click(function () {
				$(menuSelector).hide();
				$('body').off('click');	// once
			});
		}, 0);
	}

	static getMenuPosition(mouse, direction, scrollDir, menuSelector) {
		let $win: any = $(window);
		let win = $win[direction](),
			scroll = $win[scrollDir](),
			menu = (<any>$(menuSelector))[direction](),
			position = mouse + scroll;

		// opening menu would pass the side of the page
		if (mouse + menu > win && menu < mouse)
			position -= menu;

		return position;
	}

	/**
	 * When clicking on the category item from the popup menu
	 * @param text
	 * @param menu
	 */
	applyFilter(text, menu) {
		let scrollTop = document.body.scrollTop;
		console.log('scrollTop', scrollTop);

		let categoryName = menu.text().trim();
		console.log(text, 'to be', categoryName);
		this.keywords.add(new Keyword({
			word: text,
			category: categoryName,
		}));
		this.model.setCategories(this.keywords);

		console.log('this.render()');
		this.render();

		setTimeout(() => {
			console.log('Scrolling', scrollTop);
			$('body').scrollTop(scrollTop);
		}, 0);
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
