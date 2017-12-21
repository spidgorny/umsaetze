"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transaction_1 = require("./app/transaction");
var json_data_source_service_1 = require("./app/json-data-source.service");
require("reflect-metadata");
var t = new transaction_1.Transaction({
    id: '123',
    date: '2017-12-18',
    amount: 10.20,
    category: 'Default',
    notes: 'Description'
});
console.log('sign', t.sign);
var dataService = new json_data_source_service_1.JsonDataSourceService();
var from = dataService.getEarliest();
console.log('from', from, dataService.getLatest());
//# sourceMappingURL=manual-test.js.map