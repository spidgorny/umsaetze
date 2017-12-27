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
var category_1 = require("../models/category");
var core_1 = require("@angular/core");
var CategoryList = /** @class */ (function () {
    function CategoryList() {
        var _this = this;
        this.data = new Map();
        var stored = this.fetch();
        if (stored) {
            this.data = new Map(JSON.parse(stored));
            this.data.forEach(function (json, key) {
                _this.data.set(key, new category_1.Category(json));
            });
        }
    }
    CategoryList_1 = CategoryList;
    CategoryList.prototype.fetch = function () {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('categories');
        }
        return null;
    };
    CategoryList.prototype.getData = function () {
        return Array.from(this.data.values());
    };
    CategoryList.prototype.resetCounters = function () {
        this.data.forEach(function (row) {
            row.amount = 0;
            row.count = 0;
        });
    };
    /**
     * This must be called to initialize. Can not be DI because it leads to circular DI
     * @param {ExpensesService} expenses
     */
    CategoryList.prototype.setCategoriesFromExpenses = function (expenses) {
        var _this = this;
        // console.profile('getCategoriesFromExpenses');
        this.resetCounters();
        expenses.forEach(function (transaction) {
            var categoryName = transaction.category;
            _this.incrementCategoryData(categoryName, transaction);
        });
        // this.sortBy('amount');
        // console.log('category count', this.data.size);
        this.save();
        // console.profileEnd();
    };
    CategoryList.prototype.incrementCategoryData = function (categoryName, transaction) {
        var exists = this.data.get(categoryName);
        if (exists) {
            exists.count += 1;
            exists.amount += transaction.amount;
        }
        else {
            this.data.set(categoryName, new category_1.Category({
                name: categoryName,
                count: 1,
                amount: transaction.amount,
            }));
        }
    };
    CategoryList.prototype.getColorFor = function (value) {
        var color;
        var category = this.data.get(value);
        color = category ? category.color : '#AAAAAA';
        return color;
    };
    CategoryList.prototype.getTotal = function () {
        return Array.from(this.data.values()).reduce(function (acc, cat) {
            if (cat.name !== CategoryList_1.INCOME) {
                return acc + Math.abs(cat.amount);
            }
            return acc;
        }, 0);
    };
    /**
     * Each category needs to calculate the percentage of it's value from the total
     * @param {number} total
     */
    CategoryList.prototype.setTotal = function (total) {
        this.data.forEach(function (cat) {
            cat.total = total;
        });
    };
    CategoryList.prototype.save = function () {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('categories', JSON.stringify(Array.from(this.data)));
        }
    };
    CategoryList.INCOME = 'Income';
    CategoryList = CategoryList_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], CategoryList);
    return CategoryList;
    var CategoryList_1;
}());
exports.CategoryList = CategoryList;
//# sourceMappingURL=category-list.js.map