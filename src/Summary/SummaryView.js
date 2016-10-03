///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Handlebars = require('handlebars');
var Backbone = require('backbone');
var _ = require('underscore');
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
            _this.template = Handlebars.compile(result);
            //console.log(this.template);
            _this.render();
        });
    }
    SummaryView.prototype.render = function () {
        if (!this.template) {
            this.$el.html('Loading...');
            return this;
        }
        var categoryOptions = this.getCategoriesWithTotals();
        var months = _.pluck(categoryOptions[0].perMonth, 'year-month');
        categoryOptions = this.setPerCent(categoryOptions);
        categoryOptions = _.sortBy(categoryOptions, 'catName');
        var content = this.template({
            categoryOptions: categoryOptions,
            count: this.collection.size(),
            months: months
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
                    value: el
                };
            });
            categoryOptions.push({
                catName: category.getName(),
                background: category.get('color'),
                id: category.cid,
                average: averageAmountPerMonth,
                perMonth: monthlyTotals
            });
        });
        return categoryOptions;
    };
    SummaryView.prototype.setPerCent = function (categoryOptions) {
        var sumAverages = categoryOptions.reduce(function (current, b) {
            //console.log(current, b);
            return current + parseFloat(b.average);
        }, 0);
        console.log('sumAverages', sumAverages);
        _.each(categoryOptions, function (el) {
            el.perCent = (el.average / sumAverages * 100).toFixed(2);
            //console.log(el.catName, el.perCent);
        });
        return categoryOptions;
    };
    return SummaryView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = SummaryView;
//# sourceMappingURL=SummaryView.js.map