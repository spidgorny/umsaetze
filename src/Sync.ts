///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>

import Expenses from "./Expenses";
require('file-saver');

export default class Sync extends Backbone.View<any> {

	$el = $('#app');

	template = _.template($('#SyncPage').html());

	model: Expenses;

	constructor(expenses: Expenses) {
		super();
		this.model = expenses;
		this.listenTo(this.model, 'change', this.render);
	}

	render() {
		this.$el.html(this.template({
			memoryRows: this.model.size(),
			lsRows: this.model.localStorage.records.length,
		}));
		this.$('#Load').on('click', Sync.load);
		this.$('#Save').on('click', this.save.bind(this));
		this.$('#Clear').on('click', Sync.clear);
		return this;
	}

	static load() {
		console.log('Not implemented');
	}

	save() {
		var data = this.model.localStorage.findAll();
		console.log(data);
		var json = JSON.stringify(data, null, '\t');
		var blob = new Blob([json], {
			type: "application/json;charset=utf-8"
		});
		var filename = "umsaetze-"+Date.today().toString('yyyy-mm-dd')+'.json';
		console.log(filename);
		saveAs(blob, filename);
	}

	static clear() {
		console.log('clear');
		let localStorage = new Backbone.LocalStorage("Expenses");
		localStorage._clear();
	}

}
