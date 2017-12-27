"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var category_1 = require("./category");
var core_1 = require("@angular/core");
var CategoryList = /** @class */ (function () {
    function CategoryList() {
        this.data = new Map();
    }
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
        console.profile('getCategoriesFromExpenses');
        this.resetCounters();
        expenses.data.forEach(function (transaction) {
            var categoryName = transaction.category;
            _this.incrementCategoryData(categoryName, transaction);
        });
        // this.sortBy('amount');
        console.log(this.data);
        console.profileEnd();
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
        if (category) {
            color = category.color;
        }
        else {
            color = '#AAAAAA';
        }
        return color;
    };
    CategoryList = __decorate([
        core_1.Injectable()
    ], CategoryList);
    return CategoryList;
}());
exports.CategoryList = CategoryList;
//# sourceMappingURL=category-list.js.map