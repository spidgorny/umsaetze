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
var bb = require('backbone');
var bbls = require('backbone.localstorage');
var _ = require('underscore');
/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
var CategoryCollection = (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        _super.call(this, options);
        var ls = new bbls('Categories');
        //this.colors = simpleStorage.get('CategoryColors');
        var models = ls.findAll();
        console.log('categories in LS', models);
        this.add(models);
        if (!this.size()) {
        }
        this.listenTo(this, 'change', this.saveToLS);
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.getCategoriesFromExpenses();
        // when expenses change, we recalculate our data
        this.listenTo(this.expenses, "change", this.getCategoriesFromExpenses);
        // this is how AppView triggers recalculation
        // this makes an infinite loop of triggers
        // this.listenTo(this, "change", this.getCategoriesFromExpenses);
        this.listenTo(this, 'add', this.addToOptions);
    };
    CategoryCollection.prototype.saveToLS = function () {
        var ls = new bbls('Categories');
        this.each(function (model) {
            if (model.get('id')) {
                ls.update(model);
            }
            else {
                ls.create(model);
            }
        });
    };
    CategoryCollection.prototype.getCategoriesFromExpenses = function () {
        var _this = this;
        elapse.time('getCategoriesFromExpenses');
        // this.reset();	// don't reset - loosing colors
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
        this.trigger('change'); // commented because of infinite loop
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
                amount: transaction.get('amount'),
                color: CategoryCollection.pastelColor()
            }, { silent: true });
        }
    };
    CategoryCollection.prototype.triggerChange = function () {
        console.log('CategoryCollection.triggerChange');
        // commented as next line will call it anyway
        //this.getCategoriesFromExpenses();
        this.trigger('change');
    };
    CategoryCollection.prototype.getCategoriesFromExpenses2 = function () {
        var options = [];
        var categories = this.expenses.groupBy('category');
        //console.log('categories', categories);
        _.each(categories, function (value, index) {
            options.push(index);
        });
        return options;
    };
    /**
     * Run once and cache forever.
     * Not using this.models because they are filtered only visible
     * but we need all categories
     * @returns {Array}
     */
    CategoryCollection.prototype.getOptions = function () {
        var options = this.pluck('catName');
        //console.log('getOptions', options);
        options = _.unique(options);
        options = _.sortBy(options);
        return options;
    };
    CategoryCollection.prototype.addToOptions = function (model) {
        console.log('addToOptions', model);
        this.allOptions.push(model.get('catName'));
        this.allOptions = _.unique(this.allOptions);
        this.allOptions = _.sortBy(this.allOptions);
        this.setColors();
        this.triggerChange();
    };
    CategoryCollection.prototype.getColorFor = function (value) {
        // console.log('colors', this.colors);
        // let index = _.find(this.allOptions, (catName, index) => {
        // 	if (value == catName) {
        // 		return index;
        // 	}
        // });
        var color;
        var category = this.findWhere({ catName: value });
        if (category) {
            color = category.get('color');
        }
        else {
            color = '#AAAAAA';
        }
        return color;
    };
    CategoryCollection.pastelColor = function () {
        var r = (Math.round(Math.random() * 55) + 200).toString(16);
        var g = (Math.round(Math.random() * 55) + 200).toString(16);
        var b = (Math.round(Math.random() * 55) + 200).toString(16);
        return '#' + r + g + b;
    };
    return CategoryCollection;
}(bb.Collection));
exports.__esModule = true;
exports["default"] = CategoryCollection;
//# sourceMappingURL=CategoryCollection.js.map