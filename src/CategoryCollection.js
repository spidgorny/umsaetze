"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
var CategoryCollection = (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        _super.call(this, options);
        this.categoryCount = [];
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.listenTo(this.expenses, "change", this.change);
    };
    CategoryCollection.prototype.getCategoriesFromExpenses = function () {
        var _this = this;
        this.expenses.each(function (transaction) {
            var categoryName = transaction.get('category');
            if (categoryName) {
                _this.incrementCategoryData(categoryName, transaction);
            }
        });
        //console.log(this.categoryCount);
    };
    CategoryCollection.prototype.incrementCategoryData = function (categoryName, transaction) {
        var exists = _.findWhere(this.categoryCount, { catName: categoryName });
        if (exists) {
            exists.count++;
            exists.amount += parseFloat(transaction.get('amount'));
        }
        else {
            this.categoryCount.push({
                catName: categoryName,
                count: 0,
                amount: 0
            });
        }
    };
    CategoryCollection.prototype.change = function () {
        console.log('CategoryCollection.change');
        this.getCategoriesFromExpenses();
    };
    CategoryCollection.prototype.getCategoryCount = function () {
        if (!this.categoryCount) {
            this.getCategoriesFromExpenses();
        }
        return this.categoryCount;
    };
    CategoryCollection.prototype.getOptions = function () {
        if (!this.categoryCount) {
            this.getCategoriesFromExpenses();
        }
        var options = [];
        this.categoryCount.forEach(function (value) {
            options.push(value.catName);
        });
        return options;
    };
    return CategoryCollection;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = CategoryCollection;
//# sourceMappingURL=CategoryCollection.js.map