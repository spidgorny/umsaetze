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
var simpleStorage = require('simpleStorage.js');
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
var CategoryCollection = (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        _super.call(this, options);
        this.allOptions = [];
        this.colors = [];
        //let ls = Backbone.LocalStorage('CategoryColors');
        this.colors = simpleStorage.get('CategoryColors') || [];
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.getOptions();
        // when expenses change, we recalculate our data
        this.listenTo(this.expenses, "change", this.getCategoriesFromExpenses);
        // this is how AppView triggers recalculation
        // this makes an infinite loop of triggers
        this.listenTo(this, "change", this.getCategoriesFromExpenses);
        this.listenTo(this, 'add', this.addToOptions);
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
        // when we recalculated the data we trigger the view render
        //this.trigger('change'); // commented because of infinite loop
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
    CategoryCollection.prototype.triggerChange = function () {
        console.log('CategoryCollection.triggerChange');
        // commented as next line will call it anyway
        //this.getCategoriesFromExpenses();
        this.trigger('change');
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
            this.setColors();
        }
        return this.allOptions;
    };
    CategoryCollection.prototype.addToOptions = function (model) {
        console.log('addToOptions', model);
        this.allOptions.push(model.get('catName'));
        this.allOptions = _.unique(this.allOptions);
        this.allOptions = _.sortBy(this.allOptions);
        this.setColors();
        this.triggerChange();
    };
    CategoryCollection.prototype.setColors = function () {
        var _this = this;
        _.each(this.allOptions, function (value, index) {
            if (!_this.colors[index]) {
                _this.colors[index] = CategoryCollection.pastelColors();
            }
        });
        simpleStorage.set('CategoryColors', this.colors);
    };
    CategoryCollection.prototype.getColorFor = function (value) {
        // console.log('colors', this.colors);
        // let index = _.find(this.allOptions, (catName, index) => {
        // 	if (value == catName) {
        // 		return index;
        // 	}
        // });
        var index = this.allOptions.indexOf(value);
        var color = this.colors[index];
        // console.log(index, 'color for', value, 'is', color);
        return color;
    };
    CategoryCollection.pastelColors = function () {
        var r = (Math.round(Math.random() * 55) + 200).toString(16);
        var g = (Math.round(Math.random() * 55) + 200).toString(16);
        var b = (Math.round(Math.random() * 55) + 200).toString(16);
        return '#' + r + g + b;
    };
    return CategoryCollection;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = CategoryCollection;
//# sourceMappingURL=CategoryCollection.js.map