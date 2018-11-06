"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_table_1 = __importDefault(require("react-table"));
require("react-table/react-table.css");
const Transaction_1 = __importDefault(require("../Expenses/Transaction"));
require('datejs');
class DetailTable extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        let date = new Date(this.props.monthName);
        let oneMonth = this.props.totals.expenses.whereMonth(date);
        console.log(oneMonth.length);
        if (this.props.colName == 'Income') {
            oneMonth = oneMonth.filter((tr) => {
                return tr.getAmount() > 0;
            });
        }
        else if (this.props.colName == 'Expenses') {
            oneMonth = oneMonth.filter((tr) => {
                return tr.getAmount() < 0;
            });
        }
        else {
            oneMonth = [];
        }
        const detailColumns = [
            {
                Header: 'Amount',
                id: 'amount',
                accessor: (tr) => tr.getAmount(),
                width: 100,
            },
            {
                Header: 'Date',
                id: 'date',
                accessor: (tr) => tr.getDate().toString('yyyy-MM-dd'),
                width: 150,
            },
            {
                Header: 'Note',
                id: 'note',
                accessor: (tr) => tr.get('note'),
            },
        ];
        return oneMonth.length
            ? react_1.default.createElement(react_table_1.default, { data: oneMonth, columns: detailColumns, getTrProps: this.getTrProps.bind(this) })
            : null;
    }
    getTrProps(state, rowInfo, column) {
        let bg = '';
        if (rowInfo && 'original' in rowInfo) {
            const tr = rowInfo.original;
            if (tr instanceof Transaction_1.default) {
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
exports.DetailTable = DetailTable;
//# sourceMappingURL=DetailTable.js.map