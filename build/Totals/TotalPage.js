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
const DetailTable_1 = require("./DetailTable");
require('datejs');
class TotalPage extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            colName: null,
            monthName: null,
        };
        this.expenses = props.expenses;
        this.totals = new Totals_1.Totals(this.expenses);
        const { totalPlus, totalMinus } = this.totals.calculate();
        this.totalPlus = totalPlus;
        this.totalMinus = totalMinus;
        this.table = this.prepareTable();
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
    prepareTable() {
        const table = [];
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
            react_1.default.createElement(react_table_1.default, { data: this.table, columns: columns, showPagination: false, getTdProps: this.clickOnMoney.bind(this) }),
            react_1.default.createElement(DetailTable_1.DetailTable, { totals: this.totals, colName: this.state.colName, monthName: this.state.monthName })
        ];
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
                this.setState((state) => {
                    return Object.assign({}, state, { colName, monthName });
                });
            }
        };
    }
}
exports.TotalPage = TotalPage;
//# sourceMappingURL=TotalPage.js.map