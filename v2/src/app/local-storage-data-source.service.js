"use strict";
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
var transaction_1 = require("./transaction");
var category_list_1 = require("./category-list");
var LocalStorageDataSourceService = /** @class */ (function () {
    function LocalStorageDataSourceService(categories) {
        var _this = this;
        this.categories = categories;
        this.data = [];
        var incoming = window.localStorage.getItem('expenses');
        //console.log('incoming', incoming);
        if (incoming) {
            var json = JSON.parse(incoming);
            json.forEach(function (el) {
                _this.data.push(new transaction_1.Transaction(el, _this.categories));
            });
        }
    }
    LocalStorageDataSourceService.prototype.save = function (tr) {
        console.log('saving', this.data.length);
        window.localStorage.setItem('expenses', JSON.stringify(this.data));
    };
    LocalStorageDataSourceService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [category_list_1.CategoryList])
    ], LocalStorageDataSourceService);
    return LocalStorageDataSourceService;
}());
exports.LocalStorageDataSourceService = LocalStorageDataSourceService;
//# sourceMappingURL=local-storage-data-source.service.js.map