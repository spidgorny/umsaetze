///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>

import Backbone = require('backbone');
var $ = require('jquery');
require('datejs');
var _ = require('underscore');

export default class MonthSelect extends Backbone.View<any> {

	$el = $('#MonthSelect');

	yearSelect: JQuery = this.$('select');

	monthOptions: JQuery = this.$('button');

	selectedYear = this.yearSelect.val();

	selectedMonth = 'Feb';

	earliest = new Date('2014-08-01');

	latest = new Date('2016-05-15');

	//localStorage: Backbone.LocalStorage;

	constructor() {
		super();
		// console.log(this.yearSelect);
		// console.log(this.monthOptions);
		this.monthOptions.on('click', this.clickOnMonth.bind(this));
		this.yearSelect.on('change', this.changeYear.bind(this));
		//this.localStorage = new Backbone.LocalStorage('MonthSelect');
		let year = window.localStorage.getItem('MonthSelect.year');
		if (year) {
			this.selectedYear = year;
		}
		let month = window.localStorage.getItem('MonthSelect.month');
		if (month) {
			this.selectedMonth = month;
		}
	}

	render() {
		this.earliest.moveToFirstDayOfMonth();

		let selectedDate = this.getSelected();

		this.monthOptions.each((i, button) => {
			let monthNumber = i+1;
			//console.log(button);
			let sDate = this.selectedYear+'-'+monthNumber+'-01';
			let firstOfMonth = new Date(sDate);
			let $button = $(button);
			let isAfter = firstOfMonth.isAfter(this.earliest);
			let isBefore = firstOfMonth.isBefore(this.latest);
			if (isAfter && isBefore) {
				$button.removeAttr('disabled');
			} else {
				$button.attr('disabled', 'disabled');
			}
			let equals = firstOfMonth.equals(selectedDate);
			if (equals) {
				$button.addClass('btn-success').removeClass('btn-default');
			} else {
				$button.removeClass('btn-success').addClass('btn-default');
			}
			//console.log(sDate, firstOfMonth, isAfter, isBefore, equals);
		});
		return this;
	}

	show() {
		console.log('MonthSelect.show');
		this.$el.show();
	}

	hide() {
		console.log('MonthSelect.hide');
		this.$el.hide();
	}

	clickOnMonth(event) {
		this.monthOptions.removeClass('btn-success').addClass('btn-default');
		let $button = $(event.target);
		$button.removeClass('btn-default');
		$button.addClass('btn-success');
		this.selectedMonth = $button.text();

		window.localStorage.setItem('MonthSelect.month', this.selectedMonth);

		this.trigger('MonthSelect:change');
	}

	changeYear(event) {
		this.selectedYear = this.yearSelect.val();
		console.log(this.selectedYear);
		window.localStorage.setItem('MonthSelect.year', this.selectedYear);
		this.render();
		this.trigger('MonthSelect:change');
	}

	getSelected() {
		let sSelectedDate = this.selectedYear+'-'+(1+Date.getMonthNumberFromName(this.selectedMonth))+'-01';
		let selectedDate = new Date(sSelectedDate);
		console.log('selectedDate', sSelectedDate, selectedDate);
		return selectedDate;
	}

}
