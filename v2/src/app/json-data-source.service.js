/// <reference path="../custom_typings/json.d.ts" />
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var JSONData = require('../data/umsaetze-2017-04-20.json');
var transaction_1 = require("./transaction");
var Date = require('datejs');
var JsonDataSourceService = (function () {
    function JsonDataSourceService() {
        var _this = this;
        this.file = '../data/umsaetze-2017-04-20.json';
        this.data = [];
        JSONData.forEach(function (row) {
            var tr = new transaction_1.Transaction(row);
            _this.data.push(tr);
        });
        console.log('jdss constructor', this.data.length);
    }
    Object.defineProperty(JsonDataSourceService.prototype, "size", {
        get: function () {
            return this.data.length;
        },
        enumerable: true,
        configurable: true
    });
    JsonDataSourceService.prototype.getEarliest = function () {
        if (!this.size()) {
            return new Date();
        }
        var min = new Date().addYears(10).valueOf();
        this.data.forEach(function (row) {
            var dDate = row.getDate();
            var date = dDate.valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    JsonDataSourceService.prototype.getLatest = function () {
        if (!this.size()) {
            return new Date();
        }
        var min = new Date('1970-01-01').valueOf();
        this.each(function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    JsonDataSourceService = __decorate([
        core_1.Injectable()
    ], JsonDataSourceService);
    return JsonDataSourceService;
}());
exports.JsonDataSourceService = JsonDataSourceService;
