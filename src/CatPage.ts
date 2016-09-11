
import Expenses from "./Expenses";
import Transaction from "./Transaction";

export default class CatPage extends Backbone.View<Transaction> {

	$el = $('#app');

	model: Transaction;

	collection: Expenses;

	template;

	constructor(options?: Object) {
		super(options);
		console.log('CatPage.constructor');
		var importTag = $('#CatPage');
		var href = importTag.prop('href');
		console.log(importTag, href);
		$.get(href).then((result) => {
			//console.log(result);
			this.setTemplate(_.template( result ));
		});
		console.log(this);
	}

	setTemplate(html) {
		this.template = html;
		this.render();
	}

	render() {
		console.log('CatPage.render');
		this.$el.html(this.template);
		return this;
	}

}
