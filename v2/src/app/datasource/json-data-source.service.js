"use strict";
/// <reference path="../../custom_typings/json.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var JSONData = require("../../data/umsaetze-2017-04-20.json");
var transaction_1 = require("../models/transaction");
require("datejs");
var category_list_1 = require("../services/category-list");
var JsonDataSourceService = /** @class */ (function () {
    function JsonDataSourceService(categories) {
        var _this = this;
        this.categories = categories;
        this.file = '../expenses/umsaetze-2017-04-20.json';
        this.data = [];
        JSONData.forEach(function (row) {
            var tr = new transaction_1.Transaction(row, _this.categories);
            // console.log(tr);
            _this.data.push(tr);
        });
        // console.log('jdss constructor', this.data.length);
    }
    JsonDataSourceService.prototype.save = function (tr) {
        console.error('JsonDataSourceService::save() is not implemented');
    };
    JsonDataSourceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [category_list_1.CategoryList])
    ], JsonDataSourceService);
    return JsonDataSourceService;
}());
exports.JsonDataSourceService = JsonDataSourceService;
//# sourceMappingURL=json-data-source.service.js.map