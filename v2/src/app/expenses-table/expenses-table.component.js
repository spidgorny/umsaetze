"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var json_data_source_service_1 = require("../json-data-source.service");
var ExpensesTableComponent = (function () {
    function ExpensesTableComponent(data) {
        this.data = data;
        this.items = [
            'asd',
            'qwe',
        ];
        // console.log(data.file);
        console.log('etc constructor', this.data.data.length);
    }
    ExpensesTableComponent.prototype.ngOnInit = function () {
        console.log('etc ngOnInit', this.data.data.length);
    };
    ExpensesTableComponent = __decorate([
        core_1.Component({
            selector: 'app-expenses-table',
            templateUrl: './expenses-table.component.html',
            styleUrls: ['./expenses-table.component.css'],
            providers: [json_data_source_service_1.JsonDataSourceService],
        })
    ], ExpensesTableComponent);
    return ExpensesTableComponent;
}());
exports.ExpensesTableComponent = ExpensesTableComponent;
