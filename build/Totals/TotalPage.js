"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_table_1 = __importDefault(require("react-table"));
const Totals_1 = require("./Totals");
require("react-table/react-table.css");
const Transaction_1 = __importDefault(require("../Expenses/Transaction"));
class TotalPage extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: null
        };
        this.expenses = props.expenses;
        this.totals = new Totals_1.Totals(this.expenses);
    }
    show() {
        console.log('TotalPage show');
        const domContainer = document.querySelector('#app');
        react_dom_1.default.render(react_1.default.createElement(TotalPage, { expenses: this.expenses }), domContainer);
    }
    hide() {
        const domContainer = document.querySelector('#app');
        react_dom_1.default.unmountComponentAtNode(domContainer);
    }
    render() {
        const { totalPlus, totalMinus } = this.totals.calculate();
        const table = [];
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
                accessor: (tr) => tr.getAmount(),
            },
            {
                Header: 'Date',
                id: 'date',
                accessor: (tr) => tr.getDate().toString(),
            },
            {
                Header: 'Note',
                id: 'note',
                accessor: (tr) => tr.get('note'),
            },
        ];
        return [
            react_1.default.createElement(react_table_1.default, { data: table, columns: columns, showPagination: false, getTdProps: this.clickOnMoney.bind(this) }),
            this.state.details
                ? react_1.default.createElement(react_table_1.default, { data: this.state.details, columns: detailColumns, getTrProps: this.getTrProps.bind(this) })
                : null
        ];
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
    clickOnMoney(state, rowInfo, column, instance) {
        return {
            onClick: (e, handleOriginal) => {
                console.log("It was in this column:", column);
                console.log("It was in this row:", rowInfo);
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
    loadDetails(colName, monthName, value) {
        let oneMonth = this.expenses.whereMonth(new Date(monthName));
        console.log(oneMonth.length);
        if (colName == 'Income') {
            oneMonth = oneMonth.filter((tr) => {
                return tr.getAmount() > 0;
            });
        }
        else if (colName == 'Expenses') {
            oneMonth = oneMonth.filter((tr) => {
                return tr.getAmount() < 0;
            });
        }
        else {
            oneMonth = [];
        }
        this.setState((state, props) => {
            return Object.assign({}, state, {
                details: oneMonth,
            });
        });
    }
}
exports.TotalPage = TotalPage;
//# sourceMappingURL=TotalPage.js.map