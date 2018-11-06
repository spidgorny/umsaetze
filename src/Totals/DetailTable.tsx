import React from 'react';
import ReactTable from 'react-table';
import Expenses from "../Expenses/Expenses";
import {Totals} from "./Totals";
import 'react-table/react-table.css';
import Transaction from "../Expenses/Transaction";

require('datejs');

interface Props {
	totals: Totals;
	colName: string;
	monthName: string;
}

interface State {
}

export class DetailTable extends React.Component<Props, State> {

	public readonly state: State = {
	};

	render() {
		let date = new Date(this.props.monthName);
		let oneMonth = this.props.totals.expenses.whereMonth(date);
		console.log(oneMonth.length);
		if (this.props.colName == 'Income') {
			oneMonth = oneMonth.filter((tr: Transaction) => {
				return tr.getAmount() > 0;
			})
		} else if (this.props.colName == 'Expenses') {
			oneMonth = oneMonth.filter((tr: Transaction) => {
				return tr.getAmount() < 0;
			})
		} else {
			oneMonth = [];
		}

		const detailColumns = [
			{
				Header: 'Amount',
				id: 'amount',
				accessor: (tr: Transaction) => tr.getAmount(),
				width: 100,
			},
			{
				Header: 'Date',
				id: 'date',
				accessor: (tr: Transaction) => tr.getDate().toString('yyyy-MM-dd'),
				width: 150,
			},
			{
				Header: 'Note',
				id: 'note',
				accessor: (tr: Transaction) => tr.get('note'),
			},
		];

		return oneMonth.length
			? <ReactTable data={oneMonth}
						  columns={detailColumns}
						  getTrProps={this.getTrProps.bind(this)}
			/>
			: null
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

}
