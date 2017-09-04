"use strict";
/// <reference path="../../typings/index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CategoryCount_1 = require("./CategoryCount");
var backbone_1 = require("backbone");
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var Backbone = require('backbone');
require('backbone.localstorage');
var _ = require('underscore');
/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
var CategoryCollection = /** @class */ (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        var _this = _super.call(this, options) || this;
        var ls = new Backbone.LocalStorage('Categories');
        //this.colors = simpleStorage.get('CategoryColors');
        var models = ls.findAll();
        models = _.uniq(models, false, function (e1) {
            return e1.catName;
        });
        //console.log('categories in LS', models);
        //this.add(models);	// makes Backbone.Model instances
        _.each(models, function (m) {
            _this.add(new CategoryCount_1["default"](m));
        });
        // sort
        _this.models = _.uniq(_this.models, function (el) {
            return el.getName();
        });
        if (!_this.size()) {
            //this.getCategoriesFromExpenses();
            // this is not available yet
        }
        _this.listenTo(_this, 'change', _this.saveToLS);
        return _this;
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.getCategoriesFromExpenses();
        // when expenses change, we recalculate our data
        // visibility changes are too often - commented
        //this.listenTo(this.expenses, "change", this.getCategoriesFromExpenses);
        // this is how AppView triggers recalculation
        // this makes an infinite loop of triggers
        //this.listenTo(this, "change", this.getCategoriesFromExpenses);
        //this.listenTo(this, 'add', this.addToOptions);
    };
    CategoryCollection.prototype.saveToLS = function () {
        var ls = new Backbone.LocalStorage('Categories');
        var deleteMe = ls.findAll();
        // console.log('saveToLS', deleteMe.length);
        this.each(function (model) {
            if (model.get('id')) {
                ls.update(model);
                //deleteMe = _.without(deleteMe, _.findWhere(deleteMe, { id: model.get('id') }))
                var findIndex = _.findIndex(deleteMe, { id: model.get('id') });
                if (findIndex > -1) {
                    deleteMe.splice(findIndex, 1);
                }
            }
            else {
                ls.create(model);
            }
        });
        if (deleteMe.length) {
            //console.log(deleteMe.length, _.pluck(deleteMe, 'id'), _.pluck(deleteMe, 'catName'));
            _.each(deleteMe, function (el) {
                ls.destroy(el);
            });
        }
    };
    CategoryCollection.prototype.resetCounters = function () {
        this.each(function (row) {
            row.set('amount', 0, { silent: true });
            row.set('count', 0, { silent: true });
        });
    };
    CategoryCollection.prototype.getCategoriesFromExpenses = function () {
        var _this = this;
        elapse.time('getCategoriesFromExpenses');
        // this.reset();	// don't reset - loosing colors
        this.resetCounters();
        var visible = this.expenses.getVisible();
        //console.log(visible.length);
        _.each(visible, function (transaction) {
            var categoryName = transaction.get('category');
            if (categoryName) {
                _this.incrementCategoryData(categoryName, transaction);
            }
        });
        //console.log(this.categoryCount);
        this.sortBy('amount');
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
                //console.log(amountBefore, amountAfter, amountBefore + amountAfter);
            }
            exists.set('amount', amountBefore + amountAfter, { silent: true });
        }
        else {
            this.add(new CategoryCount_1["default"]({
                catName: categoryName,
                count: 1,
                amount: transaction.get('amount')
            }), { silent: true });
        }
    };
    /**
     * @deprecated - attempt #2 - not finished
     * @returns {Array}
     */
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
            //console.log('color for', value, 'is', color);
        }
        else {
            color = '#AAAAAA';
        }
        return color;
    };
    CategoryCollection.prototype.exists = function (newName) {
        return !!this.findWhere({
            catName: newName
        });
    };
    CategoryCollection.prototype.random = function () {
        return _.sample(this.models);
    };
    return CategoryCollection;
}(backbone_1.Collection));
exports["default"] = CategoryCollection;
