import Backbone = require('backbone');
import Expenses from '../Expenses/Expenses';
import {LocalStorage} from 'backbone.localstorage';
import ExpensesMock from '../Expenses/ExpensesMock';
import * as $ from 'jquery';
import {CurrentMonth} from "./CurrentMonth";

export default class MonthSelect extends Backbone.View<any> {

	$el = $('#MonthSelect');

	yearSelect: JQuery = this.$('select');

	monthOptions: JQuery = this.$('button');

	//localStorage: Backbone.LocalStorage;

	static instance: MonthSelect;

	storageProvider: Storage;

	currentMonth: CurrentMonth;

	constructor(storageProvider?: Storage) {
		super();
		this.currentMonth = new CurrentMonth(
			parseInt(this.yearSelect.val()+'') || CurrentMonth.DEFAULT_YEAR
		);

		if (storageProvider) {
			this.storageProvider = storageProvider;
		} else {
			this.storageProvider = window.localStorage;
		}

		// console.log(this.yearSelect);
		// console.log(this.monthOptions);

		// this is a problem for HistoryView because it switches to page type
		// this.monthOptions.on('click', this.clickOnMonthAndNavigate.bind(this));
		this.monthOptions
			.off('click')
			.on('click', this.clickOnMonth.bind(this));

		this.yearSelect
			.off('change')
			.on('change', this.changeYear.bind(this));

		//this.localStorage = new Backbone.LocalStorage('MonthSelect');
		let year = this.storageProvider.getItem('MonthSelect.year');
		if (year) {
			this.currentMonth.selectedYear = parseInt(year);
		}
		let month = this.storageProvider.getItem('MonthSelect.month');
		if (month) {
			this.currentMonth.selectedMonth = month;
		}
		//console.log('MonthSelect', this.selectedYear, this.selectedMonth);
	}

	static getInstance() {
		if (!MonthSelect.instance) {
			MonthSelect.instance = new MonthSelect();
		}
		return MonthSelect.instance;
	}

	render() {
		//console.time('MonthSelect.render');
		let selectedDate = this.getSelected();

		// year
		let options = [];
		let minYear = this.currentMonth.earliest.getFullYear();
		let maxYear = this.currentMonth.latest.getFullYear();
		// console.log('minYear', minYear, 'maxYear', maxYear);
		for (let y = minYear; y <= maxYear; y++) {
			let selected = selectedDate.getFullYear() == y ? 'selected' : '';
			options.push('<option '+selected+'>'+y+'</option>');
		}
		this.yearSelect.html(options.join("\n"));

		// month
		this.monthOptions.each((i, button) => {
			let monthNumber = i+1;
			//console.log(button);
			let sDate = this.currentMonth.selectedYear+'-'+monthNumber+'-01';
			let firstOfMonth = new Date(sDate);
			let $button = $(button);
			let isAfter = firstOfMonth.isAfter(this.currentMonth.earliest);
			let isBefore = firstOfMonth.isBefore(this.currentMonth.latest);
			let isTheSame = firstOfMonth.equals(this.currentMonth.earliest);
			if ((isAfter && isBefore) || isTheSame) {
				$button.removeAttr('disabled');
			} else {
				// console.log('disable month', monthNumber,
				// 	isAfter, isBefore, isTheSame,
				// 	firstOfMonth.toString('yyyy-MM-dd'),
				// 	this.currentMonth.earliest.toString('yyyy-MM-dd'),
				// 	firstOfMonth, this.currentMonth.earliest,
				// );
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
		//console.timeEnd('MonthSelect.render');
		return this;
	}

	show() {
		//console.log('MonthSelect.show');
		this.$el.show();
		this.render();	// required as data may have changed (all disabled bug)
	}

	hide() {
		console.error('MonthSelect.hide');
		this.$el.hide();
	}

	/**
	 * UI triggered
	 * @param event
	 */
	changeYear(event) {
		// this.selectedYear = this.yearSelect.val();	// don't set yet - URL will do
		Backbone.history.navigate('#/' + this.yearSelect.val() + '/' + this.currentMonth.getMonthIndex());
	}

	clickOnMonthAndNavigate(event) {
		this.monthOptions.removeClass('btn-success').addClass('btn-default');
		let $button = $(event.target);
		$button.removeClass('btn-default');
		$button.addClass('btn-success');
		//this.selectedMonth = $button.text();	// don't set yet - URL will do
		let monthIndex = this.currentMonth.getMonthIndexFor($button.text());
		Backbone.history.navigate('#/' + this.currentMonth.selectedYear + '/' + monthIndex);
	}

	clickOnMonth(event) {
		event.preventDefault();
		this.monthOptions.removeClass('btn-success').addClass('btn-default');
		let $button = $(event.target);
		$button.removeClass('btn-default');
		$button.addClass('btn-success');
		this.currentMonth.selectedMonth = $button.text();
		this.storageProvider.setItem('MonthSelect.month', this.currentMonth.selectedMonth);
		this.storageProvider.setItem('MonthSelect.year', this.currentMonth.selectedYear+'');

		this.trigger('MonthSelect:change');
	}

	setYear(year) {
		// if (this.selectedYear == year) return;
		console.log('setYear', year);
		this.currentMonth.selectedYear = year;
		//console.log(this.selectedYear);
		this.storageProvider.setItem('MonthSelect.year', this.currentMonth.selectedYear+'');
		this.render();		// repaint months as available or not
		this.trigger('MonthSelect:change');
	}

	setMonth(month: number) {
		let monthName = this.currentMonth.getMonthNameFor(month);
		// if (this.selectedMonth == monthName) {
		// 	console.warn('same month', this.selectedMonth, monthName);
		// 	return;
		// }
		console.log('setMonth', month);
		this.currentMonth.selectedMonth = monthName;
		this.storageProvider.setItem('MonthSelect.month', this.currentMonth.selectedMonth);
		this.trigger('MonthSelect:change');
	}

	setYearMonth(year: number, month: number) {
		console.log('setYearMonth', year, month);

		this.currentMonth.selectedYear = year;
		//console.log(this.selectedYear);
		this.storageProvider.setItem('MonthSelect.year', this.currentMonth.selectedYear.toString());

		this.currentMonth.selectedMonth = this.currentMonth.getMonthNameFor(month);
		this.storageProvider.setItem('MonthSelect.month', this.currentMonth.selectedMonth);

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
		return this.currentMonth.getSelected();
	}

	update(collection: Expenses|ExpensesMock) {
		this.currentMonth.update(collection.getEarliest(), collection.getLatest());
		this.show();
	}

}

