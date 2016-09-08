///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>

import Backbone = require('backbone');

export default class MonthSelect extends Backbone.View<any> {

	$el = $('#MonthSelect');

	yearSelect: JQuery;

	monthOptions: JQuery;

	selectedYear = 2014;

	selectedMonth = 'Feb';

	earliest = new Date('2014-08-01');

	latest = new Date('2016-05-15');

	constructor() {
		super();
		this.yearSelect = this.$('select');
		this.monthOptions = this.$('button');
		console.log(this.yearSelect);
		console.log(this.monthOptions);
	}

	render() {
		this.monthOptions.each((i, button) => {
			//console.log(button);
			let firstOfMonth = new Date(this.selectedYear+'-'+this.selectedMonth+'-01');
			console.log(firstOfMonth);
			$(button)
				.removeAttr('disabled')
				.addClass('btn-danger')
				.removeClass('btn-default');
		});
		return this;
	}

	show() {
		this.$el.show();
	}

	hide() {
		this.$el.hide();
	}

}
