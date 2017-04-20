///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>

import Backbone = require('backbone');
import Expenses from "./Expenses/Expenses";
import LocalStorage = Backbone.LocalStorage;
const $ = require('jquery');
require('datejs');
const _ = require('underscore');


export default class MonthSelect extends Backbone.View<any> {

	$el = $('#MonthSelect');

	yearSelect: JQuery = this.$('select');

	monthOptions: JQuery = this.$('button');

	selectedYear = this.yearSelect.val() || new Date().getFullYear();

	selectedMonth = 'Feb';

	earliest = new Date();

	latest = new Date();

	//localStorage: Backbone.LocalStorage;

	static instance: MonthSelect;

	storageProvider: Storage;

	constructor() {
		super();

		if (!this.storageProvider) {
			this.storageProvider = window.localStorage;
		}

		// console.log(this.yearSelect);
		// console.log(this.monthOptions);

		// this is a problem for HistoryView because it switches to page type
		// this.monthOptions.on('click', this.clickOnMonthAndNavigate.bind(this));
		this.monthOptions.on('click', this.clickOnMonth.bind(this));

		this.yearSelect.on('change', this.changeYear.bind(this));
		//this.localStorage = new Backbone.LocalStorage('MonthSelect');
		let year = this.storageProvider.getItem('MonthSelect.year');
		if (year) {
			this.selectedYear = year;
		}
		let month = this.storageProvider.getItem('MonthSelect.month');
		if (month) {
			this.selectedMonth = month;
		}
		console.log('MonthSelect', this.selectedYear, this.selectedMonth);
	}

	static getInstance() {
		if (!MonthSelect.instance) {
			MonthSelect.instance = new MonthSelect();
		}
		return MonthSelect.instance;
	}

	render() {
		console.time('MonthSelect.render');
		this.earliest.moveToFirstDayOfMonth();
		let selectedDate = this.getSelected();

		// year
		let options = [];
		let minYear = this.earliest.getFullYear();
		let maxYear = this.latest.getFullYear();
		console.log(minYear, maxYear);
		for (let y = minYear; y <= maxYear; y++) {
			let selected = selectedDate.getFullYear() == y ? 'selected' : '';
			options.push('<option '+selected+'>'+y+'</option>');
		}
		this.yearSelect.html(options.join("\n"));

		// month
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
		console.timeEnd('MonthSelect.render');
		return this;
	}

	show() {
		console.log('MonthSelect.show');
		this.$el.show();
		this.render();	// required as data may have changed (all disabled bug)
	}

	hide() {
		console.log('MonthSelect.hide');
		this.$el.hide();
	}

	getMonthIndex() {
		let result = Date.getMonthNumberFromName(this.selectedMonth) + 1;
		console.log('getMonthIndex', this.selectedMonth, '=>', result);
		return result;
	}

	getMonthIndexFor(monthName: string) {
		let result = Date.getMonthNumberFromName(monthName) + 1;
		console.log('getMonthIndex', monthName, result);
		return result;
	}

	getMonthNameFor(index) {
		return this.getShortMonthNameFor(index);
	}

	changeYear(event) {
		// this.selectedYear = this.yearSelect.val();	// don't set yet - URL will do
		Backbone.history.navigate('#/' + this.yearSelect.val() + '/' + this.getMonthIndex());
	}

	clickOnMonthAndNavigate(event) {
		this.monthOptions.removeClass('btn-success').addClass('btn-default');
		let $button = $(event.target);
		$button.removeClass('btn-default');
		$button.addClass('btn-success');
		//this.selectedMonth = $button.text();	// don't set yet - URL will do
		let monthIndex = this.getMonthIndexFor($button.text());
		Backbone.history.navigate('#/' + this.selectedYear + '/' + monthIndex);
	}

	clickOnMonth(event) {
		this.monthOptions.removeClass('btn-success').addClass('btn-default');
		let $button = $(event.target);
		$button.removeClass('btn-default');
		$button.addClass('btn-success');
		this.selectedMonth = $button.text();
		this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);

		this.trigger('MonthSelect:change');
	}

	setYear(year) {
		// if (this.selectedYear == year) return;
		console.log('setYear', year);
		this.selectedYear = year;
		//console.log(this.selectedYear);
		this.storageProvider.setItem('MonthSelect.year', this.selectedYear);
		this.render();		// repaint months as available or not
		this.trigger('MonthSelect:change');
	}

	setMonth(month: number) {
		let monthName = this.getMonthNameFor(month);
		// if (this.selectedMonth == monthName) {
		// 	console.warn('same month', this.selectedMonth, monthName);
		// 	return;
		// }
		console.log('setMonth', month);
		this.selectedMonth = monthName;
		this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
		this.trigger('MonthSelect:change');
	}

	setYearMonth(year: number, month: number) {
		console.log('setYearMonth', year, month);

		this.selectedYear = year;
		//console.log(this.selectedYear);
		this.storageProvider.setItem('MonthSelect.year', this.selectedYear);

		let monthName = this.getMonthNameFor(month);
		this.selectedMonth = monthName;
		this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);

		this.render();		// repaint months as available or not
		this.trigger('MonthSelect:change');
	}

	trigger(what) {
		console.warn(what);
		super.trigger(what);
	}

	/**
	 * @public
	 * @returns Date
	 */
	getSelected() {
		let sSelectedDate = this.selectedYear+'-'+this.getMonthIndex()+'-01';
		let selectedDate = new Date(sSelectedDate);
		console.log('selectedDate', sSelectedDate, selectedDate);
		return selectedDate;
	}

	/**
	 * http://stackoverflow.com/questions/1643320/get-month-name-from-date
	 * @type {[string,string,string,string,string,string,string,string,string,string,string,string]}
	 */
	monthNames = [
		"January", "February", "March",
		"April", "May", "June",
		"July", "August", "September",
		"October", "November", "December"
	];

	getMonthName() {
		return this.monthNames[this.selectedMonth];
	}

	getShortMonthName() {
		return this.getMonthName().substr(0, 3);
	}

	getShortMonthNameFor(index) {
		return this.monthNames[index-1].substr(0, 3);
	}

	update(collection: Expenses) {
		this.earliest = collection.getEarliest();
		this.latest = collection.getLatest();
		console.log('MonthSelect.update',
			this.earliest.toString('yyyy-MM-dd'),
			this.latest.toString('yyyy-MM-dd'));

		this.selectedYear = this.selectedYear.clamp(
			this.earliest.getFullYear(),
			this.latest.getFullYear()
		);

		this.show();
	}

}

