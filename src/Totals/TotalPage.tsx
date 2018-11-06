import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import Expenses from "../Expenses/Expenses";
import {Totals} from "./Totals";
import 'react-table/react-table.css';
import Transaction from "../Expenses/Transaction";

interface Props {
	expenses: Expenses;
}

interface State {
	details: any;
}

export class TotalPage extends React.Component<Props, State> {

	public readonly state: State = {
		details: null
	};

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
		ReactDOM.render(<TotalPage expenses={this.expenses}/>, domContainer);
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
			row['Remaining'] = (plus + minus).toFixed(2);
			runningTotal += (plus + minus);
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

		const detailColumns = [
			{
				Header: 'Amount',
				id: 'amount',
				accessor: (tr: Transaction) => tr.getAmount(),
			},
			{
				Header: 'Date',
				id: 'date',
				accessor: (tr: Transaction) => tr.getDate().toString(),
			},
			{
				Header: 'Note',
				id: 'note',
				accessor: (tr: Transaction) => tr.get('note'),
			},
		];

		return [
			<ReactTable data={table} columns={columns}
						showPagination={false}
						getTdProps={this.clickOnMoney.bind(this)}/>,
			this.state.details
				? <ReactTable data={this.state.details}
							  columns={detailColumns}
							  getTrProps={this.getTrProps.bind(this)}
				/>
				: null
		];
	}

	getTrProps(state, rowInfo, column) {
		// console.log(state, rowInfo, column);
		let bg = '';
		if (rowInfo && 'original' in rowInfo) {
			const tr = rowInfo.original;
			if (tr instanceof Transaction) {
				if (tr.getAmount() > 500) {
					if (tr.contains('Nintendo')) {
						bg = "green";
					}
				}
				if (tr.getAmount() < -500) {
					bg = "red";
				}
			}
		}
		return {
			style: {
				background: bg
			}
		};
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
				this.loadDetails(colName, monthName, value);
			}
		};
	}

	loadDetails(colName: string, monthName: string, value: string) {
		let oneMonth = this.expenses.whereMonth(new Date(monthName));
		console.log(oneMonth.length);
		if (colName == 'Income') {
			oneMonth = oneMonth.filter((tr: Transaction) => {
				return tr.getAmount() > 0;
			})
		} else if (colName == 'Expenses') {
			oneMonth = oneMonth.filter((tr: Transaction) => {
				return tr.getAmount() < 0;
			})
		} else {
			oneMonth = [];
		}
		this.setState((state, props) => {
			return Object.assign({}, state, {
				details: oneMonth,
			});
		})
	}

}
