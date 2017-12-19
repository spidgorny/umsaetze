"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SummaryLine_1 = require("./SummaryLine");
var handlebars_1 = require('handlebars');
// import Backbone from 'backbone-es6/src/Backbone.js';
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var SummaryView = (function (_super) {
    __extends(SummaryView, _super);
    function SummaryView(options, expenses) {
        var _this = this;
        _super.call(this, options);
        this.expenses = expenses;
        this.setElement($('#app'));
        var importTag = $('#SummaryPage'); // <import>
        var href = importTag.prop('href');
        //console.log(importTag, href);
        $.get(href).then(function (result) {
            //console.log(result);
            _this.template = handlebars_1.default.compile(result);
            //console.log(this.template);
            _this.render();
        });
    }
    SummaryView.prototype.initialize = function () {
    };
    SummaryView.prototype.render = function () {
        if (!this.template) {
            this.$el.html('Loading...');
            return this;
        }
        var categoryOptions = this.getCategoriesWithTotals();
        var months = _.pluck(categoryOptions[0].perMonth, 'year-month');
        categoryOptions = this.setPerCent(categoryOptions);
        categoryOptions = _.sortBy(categoryOptions, 'catName');
        categoryOptions = this.addCategoryTotals(categoryOptions);
        var content = this.template({
            categoryOptions: categoryOptions,
            count: this.collection.size(),
            months: months,
        });
        this.$el.html(content);
        return this;
    };
    SummaryView.prototype.getCategoriesWithTotals = function () {
        var _this = this;
        var categoryOptions = [];
        this.collection.each(function (category) {
            var monthlyTotals = _this.expenses.getMonthlyTotalsFor(category);
            var averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
            monthlyTotals = _.map(monthlyTotals, function (el, key) {
                var _a = key.split('-'), year = _a[0], month = _a[1];
                // console.log(key, year, month);
                return {
                    'year-month': year + '-' + month,
                    year: year,
                    month: month,
                    categoryName: category.getName(),
                    value: el,
                };
            });
            categoryOptions.push(new SummaryLine_1.default({
                catName: category.getName(),
                background: category.get('color'),
                id: category.cid,
                average: averageAmountPerMonth,
                perMonth: monthlyTotals,
            }));
        });
        return categoryOptions;
    };
    SummaryView.prototype.setPerCent = function (categoryOptions) {
        var sumAverages = categoryOptions.reduce(function (current, b) {
            //console.log(current, b);
            return current + (typeof b.average == 'number'
                ? b.average : parseFloat(b.average));
        }, 0);
        console.log('sumAverages', sumAverages);
        _.each(categoryOptions, function (el) {
            el.perCent = (el.average / sumAverages * 100).toFixed(2);
            //console.log(el.catName, el.perCent);
        });
        return categoryOptions;
    };
    SummaryView.prototype.addCategoryTotals = function (categoryOptions) {
        var groupByCategory = {};
        _.each(categoryOptions, function (el) {
            if (!el.catName) {
                console.log(el);
                //throw new Error('addCategoryTotals has element without catName');
                return; // ignore
            }
            var _a = el.catName.split(':'), category = _a[0], specifics = _a[1];
            category = category.trim();
            if (!groupByCategory[category]) {
                groupByCategory[category] = [];
            }
            groupByCategory[category].push(el);
        });
        console.log(groupByCategory);
        // step 2
        _.each(groupByCategory, function (set, setName) {
            if (set.length > 1) {
                var newCat_1 = new SummaryLine_1.default({
                    catName: setName + ' [' + set.length + ']',
                    background: '#FF8800',
                });
                _.each(set, function (el) {
                    newCat_1.combine(el);
                });
                newCat_1.sAverage = newCat_1.average.toFixed(2);
                newCat_1.perCent = typeof newCat_1.perCent == 'number'
                    ? newCat_1.perCent.toFixed(2) : newCat_1.perCent;
                categoryOptions.push(newCat_1);
            }
        });
        categoryOptions = _.sortBy(categoryOptions, 'catName');
        return categoryOptions;
    };
    /**
     * For Workspace
     */
    SummaryView.prototype.hide = function () {
    };
    return SummaryView;
}(Backbone.View));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SummaryView;
