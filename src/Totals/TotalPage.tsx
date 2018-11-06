import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import Expenses from "../Expenses/Expenses";
import {Totals} from "./Totals";
import 'react-table/react-table.css';

interface Props {
	expenses: Expenses;
}

export class TotalPage extends React.Component<Props> {

	expenses: Expenses;

	totals: Totals;

	constructor(props: any) {
		super(props);
		this.expenses = props.expenses;
		this.totals = new Totals(this.expenses);
	}

	show() {
		console.log('TotalPage show');
		const domContainer = document.querySelector('#app');
		ReactDOM.render(<TotalPage expenses={this.expenses} />, domContainer);
	}

	hide() {
		const domContainer = document.querySelector('#app');
		ReactDOM.unmountComponentAtNode(domContainer);
	}

	render() {
		const {totalPlus, totalMinus} = this.totals.calculate();

		const table: any[] = [];
		let runningTotal = 0;
		Object.keys(totalPlus).map((month) => {
			const plus = totalPlus[month];
			const minus = totalMinus[month];
			const row = {};
			row['Month'] = month;
			row['Income'] = plus.toFixed(2);
			row['Expenses'] = minus.toFixed(2);
			row['Remaining'] = (plus+minus).toFixed(2);
			runningTotal += (plus+minus);
			row['Cumulative'] = runningTotal.toFixed(2);
			table.push(row);
		});
		console.table(table);

		const columns = [
			{
				Header: 'Month',
				accessor: 'Month'
			},
			{
				Header: 'Income',
				accessor: 'Income'
			},
			{
				Header: 'Expenses',
				accessor: 'Expenses'
			},
			{
				Header: 'Remaining',
				accessor: 'Remaining'
			},
			{
				Header: 'Cumulative',
				accessor: 'Cumulative'
			},
		];

		return <ReactTable data={table} columns={columns} showPagination={false}/>;
	}

}
