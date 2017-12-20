import {Component, OnInit} from '@angular/core';
import {ExpensesService} from '../expenses.service';

@Component({
	selector: 'app-month-selector',
	templateUrl: './month-selector.component.html',
	styleUrls: ['./month-selector.component.css']
})
export class MonthSelectorComponent implements OnInit {

	public selected: Date;

	constructor(protected expenses: ExpensesService) {
		const cached = window.localStorage.getItem('selectedMonth');
		if (cached) {
			this.selected = new Date(cached);
		} else {
			this.selected = this.expenses.getLatest();
		}
	}

	get selectedMonth() {
		return this.selected.getMonth() + 1;
	}

	get selectedYear() {
		return this.selected.getFullYear();
	}

	ngOnInit() {
	}

	setSelected(date: Date) {
		this.selected = date;
		window.localStorage.setItem('selectedMonth', this.selected.toString());
	}

	years() {
		const min = this.expenses.getEarliest().getFullYear();
		const max = this.expenses.getLatest().getFullYear();
		let years = Array.from(new Array(1 + max - min), (x,i) => i + min);
		//console.log(years);
		return years;
	}

	isDisabled(monthID) {
		const generated = new Date(this.selectedYear, monthID);
		return generated > this.expenses.getEarliest() && generated > this.expenses.getLatest();
	}

	setMonth(monthID) {
		this.selected = new Date(this.selectedYear, monthID);
	}

	isSelected(monthID) {
		return this.selectedMonth == monthID + 1;
	}

}
