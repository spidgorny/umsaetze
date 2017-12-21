"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var transaction_1 = require("./app/transaction");
var json_data_source_service_1 = require("./app/json-data-source.service");
require("reflect-metadata");
var category_list_1 = require("./app/category-list");
var expenses_service_1 = require("./app/expenses.service");
var categories = new category_list_1.CategoryList();
// categories.setCategoriesFromExpenses();
var t = new transaction_1.Transaction({
    id: '123',
    date: '2017-12-18',
    amount: 10.20,
    category: 'Default',
    notes: 'Description'
}, categories);
console.log('sign', t.sign);
var jsonLoader = new json_data_source_service_1.JsonDataSourceService(categories);
var ExpensesService4Test = /** @class */ (function (_super) {
    __extends(ExpensesService4Test, _super);
    function ExpensesService4Test(loader, saver) {
        var _this = _super.call(this, loader, saver) || this;
        _this.loader = loader;
        _this.saver = saver;
        return _this;
    }
    return ExpensesService4Test;
}(expenses_service_1.ExpensesService));
var dataService = new ExpensesService4Test(jsonLoader, jsonLoader);
var from = dataService.getEarliest();
console.log('from', from, dataService.getLatest());
//# sourceMappingURL=manual-test.js.map