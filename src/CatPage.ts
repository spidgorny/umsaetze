/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />

import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "./Category/CategoryCollection";
import CategoryCount from "./Category/CategoryCount";
const Handlebars = require('handlebars');
const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('underscore');

export default class CatPage extends Backbone.View<Transaction> {

	$el = $('#app');

	model: Transaction;

	collection: Expenses;

	categoryList: CategoryCollection;

	template;

	constructor(expenses: Expenses, categoryList: CategoryCollection) {
		super();
		console.log('CatPage.constructor');
		this.collection = expenses;
		this.categoryList = categoryList;
		let importTag = $('#CatPage');
		let href = importTag.prop('href');
		console.log(importTag, href);
		$.get(href).then((result) => {
			//console.log(result);
			this.setTemplate(
				//_.template( result )
				Handlebars.compile(result)
			);
		});
		//console.log(this);
		this.listenTo(this.categoryList, 'change', this.render);
		this.listenTo(this.categoryList, 'add', this.render);
		this.listenTo(this.categoryList, 'update', this.render);
	}

	setTemplate(html) {
		this.template = html;
		this.render();
	}

	render() {
		if (window.location.hash != '#CatPage') return;
		console.log('CatPage.render');
		if (this.template) {
			let categoryOptions = [];
			this.categoryList.each((category) => {
				//console.log(category);
				categoryOptions.push({
					catName: category.get('catName'),
					background: category.get('color'),
					id: category.cid,
					used: category.get('count'),
					amount: category.get('amount')
				});
			});
			this.$el.html(this.template({
				categoryOptions: categoryOptions,
			}));
			this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
			this.$('input[name="newName"]').focus();
			this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
			this.$('button.close').on('click', this.deleteCategory.bind(this));
		} else {
			this.$el.html('Loading...');
		}
		return this;
	}

	addCategory(event: Event) {
		event.preventDefault();
		let $form = $(event.target);
		let newName = $form.find('input').val();
		console.log('newName', newName);
		let categoryObject = new CategoryCount({
			catName: newName,
		});
		console.log('get', categoryObject.get('catName'));
		console.log('get', categoryObject.get('color'));
		this.categoryList.add(categoryObject);
	}

	selectColor(event) {
		console.log(event);
		let $input = $(event.target);
		let id = $input.closest('tr').attr('data-id');
		console.log('id', id);
		let category = this.categoryList.get(id);
		console.log('category by id', category);
		if (category) {
			//console.log('color', event.target.value);
			category.set('color', event.target.value);
		}
	}

	deleteCategory(event: MouseEvent) {
		let button = event.target;
		let tr = $(button).closest('tr');
		let id = tr.attr('data-id');
		console.log(id);
		this.categoryList.remove(id);
	}

}
