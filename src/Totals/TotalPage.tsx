import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import Expenses from "../Expenses/Expenses";
import {Totals} from "./Totals";
import 'react-table/react-table.css';
import {DetailTable} from "./DetailTable";

require('datejs');

interface Props {
	expenses: Expenses;
}

interface State {
	colName: string;
	monthName: string;
}

export class TotalPage extends React.Component<Props, State> {

	public readonly state: State = {
		// details: null,
		colName: null,
		monthName: null,
	};

	expenses: Expenses;

	totals: Totals;

	totalPlus;
	totalMinus;

	table: any[];

	constructor(props: any) {
		super(props);
		this.expenses = props.expenses;
		this.totals = new Totals(this.expenses);
		const {totalPlus, totalMinus} = this.totals.calculate();
		this.totalPlus = totalPlus;
		this.totalMinus = totalMinus;
		this.table = this.prepareTable();
	}

	show() {
		console.log('TotalPage show');
		const domContainer = document.querySelector('#app');
		ReactDOM.render(<TotalPage expenses={this.expenses}/>, domContainer);
	}

	hide() {
		const domContainer = document.querySelector('#app');
		ReactDOM.unmountComponentAtNode(domContainer);
	}

	prepareTable() {
		const table: any[] = [];
		let runningTotal = 0;
		Object.keys(this.totalPlus).map((month) => {
			const plus = this.totalPlus[month];
			const minus = this.totalMinus[month];
			const row = {};
			row['Month'] = month;
			row['Income'] = plus.toFixed(2);
			row['Expenses'] = minus.toFixed(2);
			row['Remaining'] = (plus + minus).toFixed(2);
			runningTotal += (plus + minus);
			row['Cumulative'] = runningTotal.toFixed(2);
			table.push(row);
		});
		// console.table(table);
		return table;
	}

	render() {
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

		return [
			<ReactTable data={this.table} columns={columns}
						showPagination={false}
						getTdProps={this.clickOnMoney.bind(this)}/>,
			<DetailTable totals={this.totals}
						 colName={this.state.colName}
						 monthName={this.state.monthName}
			/>
		];
	}

	clickOnMoney(state, rowInfo, column, instance) {
		return {
			onClick: (e, handleOriginal) => {
				// console.log("A Td Element was clicked!");
				// console.log("it produced this event:", e);
				console.log("It was in this column:", column);
				console.log("It was in this row:", rowInfo);
				// console.log("It was in this table instance:", instance);

				// IMPORTANT! React-Table uses onClick internally to trigger
				// events like expanding SubComponents and pivots.
				// By default a custom 'onClick' handler will override this functionality.
				// If you want to fire the original onClick handler, call the
				// 'handleOriginal' function.
				if (handleOriginal) {
					handleOriginal();
				}

				const colName = column.id;
				const monthName = rowInfo.original.Month;
				const value = rowInfo.original[colName];
				console.log(colName, monthName, value);
				//this.loadDetails(colName, monthName, value);
				this.setState((state) => {
					return {...state, colName, monthName};
				})
			}
		};
	}

}
