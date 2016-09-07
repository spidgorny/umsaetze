"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var elapse = require('elapse');
elapse.configure({
    debug: true
});
/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
var CategoryCollection = (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        _super.call(this, options);
        this.allOptions = [];
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.getOptions();
        this.listenTo(this.expenses, "change", this.change);
    };
    CategoryCollection.prototype.getCategoriesFromExpenses = function () {
        var _this = this;
        elapse.time('getCategoriesFromExpenses');
        this.reset();
        var visible = this.expenses.getVisible();
        _.each(visible, function (transaction) {
            var categoryName = transaction.get('category');
            if (categoryName) {
                _this.incrementCategoryData(categoryName, transaction);
            }
        });
        //console.log(this.categoryCount);
        elapse.timeEnd('getCategoriesFromExpenses');
        this.trigger('update');
    };
    CategoryCollection.prototype.incrementCategoryData = function (categoryName, transaction) {
        var exists = this.findWhere({ catName: categoryName });
        if (exists) {
            exists.set('count', exists.get('count') + 1, { silent: true });
            var amountBefore = exists.get('amount');
            var amountAfter = transaction.get('amount');
            if (categoryName == 'Income') {
            }
            exists.set('amount', amountBefore + amountAfter, { silent: true });
        }
        else {
            this.add({
                catName: categoryName,
                count: 1,
                amount: transaction.get('amount')
            }, { silent: true });
        }
    };
    CategoryCollection.prototype.change = function () {
        console.log('CategoryCollection.change');
        this.getCategoriesFromExpenses();
    };
    /**
     * Run once and cache forever.
     * Not using this.models because they are filtered only visible
     * but we need all categories
     * @returns {Array}
     */
    CategoryCollection.prototype.getOptions = function () {
        if (!this.allOptions.length) {
            var options = [];
            var categories = this.expenses.groupBy('category');
            //console.log('categories', categories);
            _.each(categories, function (value, index) {
                options.push(index);
            });
            options = _.unique(options);
            options = _.sortBy(options);
            this.allOptions = options;
        }
        return this.allOptions;
    };
    return CategoryCollection;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = CategoryCollection;
//# sourceMappingURL=CategoryCollection.js.map