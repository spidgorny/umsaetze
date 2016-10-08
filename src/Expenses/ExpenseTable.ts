///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>

import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "../Category/CategoryCollection";
import KeywordCollection from "../Keyword/KeywordCollection";
import Keyword from "../Keyword/Keyword";
import {debug} from "../umsaetze";
import Table from "../Sync/Table";
const elapse = require('elapse');
elapse.configure({
	debug: true
});
const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('underscore');
const handlebars = require('handlebars');

export default class ExpenseTable extends Backbone.View<any> {

	model: Expenses;

	//collection: Expenses;

	categoryList: CategoryCollection;

	template = _.template($('#rowTemplate').html());

	keywords: KeywordCollection;

	constructor(options?) {
		super(options);
		console.log(this.keywords);

		// in case we started with Sync page the table is not visible
		if (!$('#expenseTable').length) {
			var template = _.template($('#AppView').html());
			$('#app').html(template());
		}

		this.setElement($('#expenseTable'));

		// slow re-rendering of the whole table when collection changes
		//this.listenTo(this.collection, 'change', this.render);
		this.on("all", debug("ExpenseTable"));
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
		elapse.time('ExpenseTable.render');
		console.log('ExpenseTable.render()', this.model.size());

		let visible = this.model.getVisible();

		let table = new Table();
		_.each(visible, (transaction: Transaction) => {
			let attributes = transaction.toJSON();
			attributes.sDate = transaction.getDate().toString('yyyy-MM-dd');
			attributes.cssClass = attributes.category == 'Default'
				? 'bg-warning' : '';
			attributes.categoryOptions = this.getCategoryOptions(transaction);
			attributes.background = this.categoryList.getColorFor(transaction.get('category'));

			table.push(attributes);
		});
		// sortBy only works with direct attributes (not Model)
		table = _.sortBy(table, 'date');

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

		// does not work in Chrome
		//this.$el.on('click', 'select', this.openSelect.bind(this));
		this.$el.on('change', 'select', this.newCategory.bind(this));
		this.$el.off().on('mouseup', 'td.note', this.textSelectedEvent.bind(this));

		elapse.timeEnd('ExpenseTable.render');
		return this;
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
		//console.log(event);
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
		} else if (document.selection) {
			return document.selection.createRange().text;
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
				left: this.getMenuPosition(clientX, 'width', 'scrollLeft', menuSelector),
				top: this.getMenuPosition(clientY, 'height', 'scrollTop', menuSelector)
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

	getMenuPosition(mouse, direction, scrollDir, menuSelector) {
		let win = $(window)[direction](),
			scroll = $(window)[scrollDir](),
			menu = $(menuSelector)[direction](),
			position = mouse + scroll;

		// opening menu would pass the side of the page
		if (mouse + menu > win && menu < mouse)
			position -= menu;

		return position;
	}

	applyFilter(text, menu) {
		let categoryName = menu.text().trim();
		console.log(text, 'to be', categoryName);
		this.keywords.add(new Keyword({
			word: text,
			category: categoryName,
		}));
		this.model.setCategories(this.keywords);
		let scrollTop = document.body.scrollTop;
		console.log('scrollTop', scrollTop);
		this.render();
		$('body').scrollTop(scrollTop);
	}

}
