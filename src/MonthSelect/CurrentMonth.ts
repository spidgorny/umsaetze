import 'datejs';
import {clamp} from "../Util/Number";

require('../Util/Number');

export class CurrentMonth {

	public earliest = new Date().moveToMonth(0, -1).moveToFirstDayOfMonth();

	public latest = new Date();

	/**
	 * http://stackoverflow.com/questions/1643320/get-month-name-from-date
	 * @type {[string,string,string,string,string,string,string,string,string,string,string,string]}
	 */
	static monthNames = [
		"January", "February", "March",
		"April", "May", "June",
		"July", "August", "September",
		"October", "November", "December"
	];

	private _selectedYear: number = CurrentMonth.DEFAULT_YEAR;

	/**
	 * @var String, it must be string
 	 */
	private _selectedMonth: string = CurrentMonth.DEFAULT_MONTH;

	public static readonly DEFAULT_YEAR = new Date().getFullYear();

	public static readonly DEFAULT_MONTH = 'Feb';

	static fromDate(date: Date) {
		return new CurrentMonth(date.getFullYear(), CurrentMonth.getShortMonthNameFor(date.getMonth()+1));
	}

	constructor(year, month = CurrentMonth.DEFAULT_MONTH) {
		this._selectedYear = year;
		this._selectedMonth = month;
	}

	get selectedYear(): number {
		return this._selectedYear;
	}

	set selectedYear(value: number) {
		if (value < this.earliest.getFullYear()) {
			console.error('setting year smaller than max', value, this.earliest.toString('yyyy-MM-dd'));
		}
		if (value > this.latest.getFullYear()) {
			console.error('setting year bigger than max', value, this.latest.toString('yyyy-MM-dd'));
		}
		this._selectedYear = value;
	}

	get selectedMonth(): string {
		return this._selectedMonth;
	}

	set selectedMonth(value: string) {
		const withYear = new Date(this.selectedYear + '-' + value + '-01');
		if (withYear < this.earliest) {
			console.error('setting month smaller than max',
				withYear.toString('yyyy-MM-dd'),
				this.earliest.toString('yyyy-MM-dd'));
		}
		if (withYear > this.latest) {
			console.error('setting month bigger than max',
				withYear.toString('yyyy-MM-dd'),
				this.latest.toString('yyyy-MM-dd'));
		}
		this._selectedMonth = value;
	}

	/**
	 * @public
	 * @returns Date
	 */
	getSelected() {
		let sSelectedDate = this.selectedYear+'-'+this.getMonthIndex()+'-01';
		return new Date(sSelectedDate);
	}

	setEarliest(date: Date) {
		this.earliest = date.clone();
		this.earliest.moveToFirstDayOfMonth()
			.setUTCHours(0, 0, 0, 0);
	}

	setLatest(date: Date) {
		this.latest = date.clone();
		this.latest.moveToLastDayOfMonth()
			.setUTCHours(0, 0, 0, 0);
	}

	getMonthIndex() {
		let result = Date.getMonthNumberFromName(this._selectedMonth) + 1;
		//console.log('getMonthIndex', this.selectedMonth, '=>', result);
		return result;
	}

	getMonthIndexFor(monthName: string) {
		let result = Date.getMonthNumberFromName(monthName) + 1;
		//console.log('getMonthIndex', monthName, result);
		return result;
	}

	getMonthNameFor(index) {
		return CurrentMonth.getShortMonthNameFor(index);
	}

	/**
	 * @deprecated
	 * @returns {string|string|string|string|string|string|string|string|string|string|string|string}
	 */
	static getMonthName() {
		throw new Error('getMonthName called when selectedMonth is a string already');
		//return this.monthNames[this.selectedMonth];
	}

	/**
	 * @deprecated
	 * @returns {string}
	 */
	getShortMonthName() {
		// return MonthSelect.getMonthName().substr(0, 3);
	}

	/**
	 * Returns three letter month name used to initialize this class
	 * @param index starts with 1 = Jan
	 */
	static getShortMonthNameFor(index) {
		const longName = this.monthNames[index-1] || this.monthNames[0];
		return longName.substr(0, 3);
	}

	update(earliest: Date, latest: Date) {
		this.setEarliest(earliest);
		this.setLatest(latest);
		// console.log('MonthSelect.update',
		// 	this.earliest.toString('yyyy-MM-dd'),
		// 	this.latest.toString('yyyy-MM-dd'));d

		this._selectedYear = clamp(this._selectedYear,
			this.earliest.getFullYear(),
			this.latest.getFullYear()
		);
		let selectedMonthIndex = clamp(this.getMonthIndex(),
			this.earliest.getMonth(),
			this.latest.getMonth()
		);
		this._selectedMonth = this.getMonthNameFor(selectedMonthIndex);

		console.log('MonthSelect range',
			this.earliest.toString('yyyy-MM-dd'),
			this.latest.toString('yyyy-MM-dd'));
	}

	getURL() {
		let sMonth;
		let month = this.getMonthIndex();
		if (month < 10) {
			sMonth = '0' + month.toString();
		} else {
			sMonth = month.toString();
		}
		return '/'+this.selectedYear.toString()+'/'+sMonth;
	}
}
