import {Component, OnInit} from '@angular/core';
import {ExpensesService} from '../../services/expenses.service';
import {CurrentMonthService} from '../../services/current-month.service';
import {Transaction} from '../../models/transaction';
import 'datejs';

@Component({
	selector: 'app-expenses-table',
	templateUrl: './expenses-table.component.html',
	styleUrls: ['./expenses-table.component.css'],
	providers: [],
})
export class ExpensesTableComponent implements OnInit {

	/**
	 * This is not a getter, because we want to trigger re-render when this array changes.
	 */
	visible: Transaction[];

	constructor(public expenses: ExpensesService, private currentMonth: CurrentMonthService) {
		// console.log(expenses.file);
		// console.log('etc constructor', this.expenses.data.length);
		// console.log('date extremes', this.dateFrom.toString('yyyy-MM-dd'), this.dateTill.toString('yyyy-MM-dd'));

		// show at least something - to be removed
		// this.visible = this.expenses.data;
	}

	get dateFrom() {
		return this.expenses.getEarliest();
	}

	get dateTill() {
		return this.expenses.getLatest();
	}

	ngOnInit() {
		// console.log('etc ngOnInit', this.expenses.data.length);
		// console.log('first', this.expenses.data[0]);
		this.currentMonth.subscribe(this.onMonthChanged.bind(this));
	}

	onMonthChanged(newDate: Date) {
		// console.log('emit catched', newDate.toString('yyyy-MM-dd'));
		this.visible = this.getVisible();
		// console.log('visible', this.visible.length);
	}

	getVisible() {
		const visible = this.expenses.filterByMonth(this.currentMonth.getValue());
		return visible;
	}

}
