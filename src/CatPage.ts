
import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "./CategoryCollection";
import CategoryCount from "./CategoryCount";
let Handlebars = require('handlebars');

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
		var importTag = $('#CatPage');
		var href = importTag.prop('href');
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
			let thisPlus = this;
			//thisPlus.categoryOptions = this.categoryList.allOptions;
			this.$el.html(this.template(thisPlus));
			this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
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
		this.categoryList.add(new CategoryCount({
			catName: newName,
		}));
		$form.find('input').focus();
	}

}
