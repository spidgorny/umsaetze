import Expenses from "../Expenses/Expenses";
import _ from 'underscore';
import Transaction from "../Expenses/Transaction";
import {MonthExpenses} from "../Expenses/MonthExpenses";
import {CurrentMonth} from "../MonthSelect/CurrentMonth";

/**
 * Shows the total money spent per month.
 */
export class Totals {

	visible: boolean = false;

	expenses: Expenses;

	constructor(expenses: Expenses) {
		this.expenses = expenses;
	}

	show() {
		this.visible = true;
		this.render();
	}

	hide() {
		this.visible = false;
	}

	render() {
		console.time('groupByMonth');
		const perMonth = this.expenses.groupByMonth();
		console.timeEnd('groupByMonth');
		console.log(Object.keys(perMonth));
		console.log(Object.assign({}, ...Object.entries(perMonth).map(([key, list]) => list.length)));
		console.log(_.mapObject(perMonth, (key, list) => list.length));

		const totalPlus = {};
		const totalMinus = {};
		for (const month in perMonth) {
			const date = new Date(month);
			const cm = CurrentMonth.fromDate(date);
			let expenses = new Expenses(perMonth[month]);
			const monthlyExpenses = new MonthExpenses(expenses, cm);
			totalPlus[month] = monthlyExpenses.getPositiveTotal();
			totalMinus[month] = monthlyExpenses.getNegativeTotal();
		}
		console.log(totalPlus, totalMinus);
	}

}
