"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var transaction_1 = require("../app/models/transaction");
var json_data_source_service_1 = require("../app/datasource/json-data-source.service");
var category_list_1 = require("../app/services/category-list");
var ExpensesService4Test_1 = require("./ExpensesService4Test");
require("datejs");
var ManualTest = /** @class */ (function () {
    function ManualTest() {
        this.categories = new category_list_1.CategoryList();
        // categories.setCategoriesFromExpenses();
        var jsonLoader = new json_data_source_service_1.JsonDataSourceService(this.categories);
        this.dataService = new ExpensesService4Test_1.ExpensesService4Test(jsonLoader, jsonLoader);
    }
    ManualTest.prototype.testSign = function () {
        var t = new transaction_1.Transaction({
            id: '123',
            date: '2017-12-18',
            amount: 10.20,
            category: 'Default',
            notes: 'Description'
        }, this.categories);
        console.log('sign', t.sign);
        return this;
    };
    ManualTest.prototype.testEarliest = function () {
        var from = this.dataService.getEarliest();
        console.log('from', from, this.dataService.getLatest());
        return this;
    };
    ManualTest.prototype.testFilterByMonth = function () {
        var april = new Date(2017, 3);
        console.log('april', april);
        var visible = this.dataService.filterByMonth(april);
        console.log('visible', visible.length);
        return this;
    };
    ManualTest.prototype.testDateCompare = function () {
        var april = new Date(2017, 3);
        console.log('april', april);
        var today = new Date();
        console.log('today is bigger than april', today > april);
        console.log('today is bigger than april by getTime()', today.getTime() > april.getTime());
        console.log(today.toString('yyyy-MM-dd'), today.getTime(), april.toString('yyyy-MM-dd'), april.getTime());
        return this;
    };
    ManualTest.prototype.testGetMonths = function () {
        var months = this.dataService.getMonths();
        console.log(months);
        return this;
    };
    ManualTest.prototype.testGetMonthPairs = function () {
        var months = this.dataService.getMonthPairs();
        console.log(months);
        return this;
    };
    return ManualTest;
}());
new ManualTest()
    .testGetMonths()
    .testGetMonthPairs();
//# sourceMappingURL=manual-test.js.map