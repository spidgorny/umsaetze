import Expenses from "../Expenses/Expenses";
import _ from 'underscore';
import {MonthExpenses} from "../Expenses/MonthExpenses";
import {CurrentMonth} from "../MonthSelect/CurrentMonth";
import Table from "easy-table";
import Transaction from "../Expenses/Transaction";

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
		// console.log(Object.keys(perMonth));
		// console.log(Object.assign({}, ...Object.entries(perMonth).map(([key, list]) => list.length)));
		console.log(_.mapObject(perMonth, (list: Transaction[], key) => {
			return list.length;
		}));

		const totalPlus: Map<string, number> = new Map();
		const totalMinus: Map<string, number> = new Map();
		for (const month in perMonth) {
			const date = new Date(month);
			const cm = CurrentMonth.fromDate(date);
			let expenses = new Expenses(perMonth[month]);
			const monthlyExpenses = new MonthExpenses(expenses, cm);
			monthlyExpenses.filter(this.filterOutliers.bind(this));
			totalPlus[month] = monthlyExpenses.getPositiveTotal();
			totalMinus[month] = monthlyExpenses.getNegativeTotal();
		}
		//console.log(totalPlus, totalMinus);
		console.log(this.makeTable(totalPlus, totalMinus));
	}

	makeTable(totalPlus: Map<string, number>, totalMinus: Map<string, number>) {
		const t = new Table();

		let runningTotal = 0;
		Object.keys(totalPlus).map((month) => {
			const plus = totalPlus[month];
			const minus = totalMinus[month];
			t.cell('Month', month);
			t.cell('Income', plus.toFixed(2));
			t.cell('Expenses', minus.toFixed(2));
			t.cell('Remaining', (plus+minus).toFixed(2));
			runningTotal += (plus+minus);
			t.cell('Cumulative', runningTotal.toFixed(2));
			t.newRow();
		});

		return t.toString();
	}

	filterOutliers(tr: Transaction) {
		if (tr.getAmount() > 500) {
			if (!tr.contains('Nintendo')) {
				return false;
			}
		}
		if (tr.getAmount() < -500) {
			return false;
		}
		return true;
	}

}
