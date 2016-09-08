///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>

export default class MonthSelect extends Backbone.View {

	$el = $('#MonthSelect');

	yearSelect: JQuery;

	monthOptions: JQuery;

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
			$(button)
				.removeAttr('disabled')
				.addClass('btn-danger')
				.removeClass('btn-default');
		});
	}

	show() {
		this.$el.show();
	}

	hide() {
		this.$el.hide();
	}

}
