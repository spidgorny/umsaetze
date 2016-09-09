///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>

export default class Sync extends Backbone.View<any> {

	$el = $('#app');

	template = _.template($('#SyncPage').html());

	constructor() {
		super();
	}

	render() {
		this.$el.html(this.template());
		let clearButton = this.$('#Clear');
		//console.log(clearButton);
		clearButton.on('click', Sync.clear);
		return this;
	}

	static clear() {
		console.log('clear');
		let localStorage = new Backbone.LocalStorage("Expenses");
		localStorage._clear();
	}

}
