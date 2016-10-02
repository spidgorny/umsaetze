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
        console.log(importTag, href);
        $.get(href).then(function (result) {
            //console.log(result);
            _this.template = Handlebars.compile(result);
            _this.render();
        });
    }
    SummaryView.prototype.render = function () {
        var _this = this;
        if (!this.template) {
            this.$el.html('Loading...');
            return this;
        }
        var months = [];
        var categoryOptions = [];
        this.collection.each(function (category) {
            var monthlyTotals = _this.expenses.getMonthlyTotalsFor(category);
            var averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
            months = Object.keys(monthlyTotals);
            categoryOptions.push({
                catName: category.get('catName'),
                background: category.get('color'),
                id: category.cid,
                average: averageAmountPerMonth,
                perMonth: monthlyTotals
            });
        });
        categoryOptions = _.sortBy(categoryOptions, 'catName');
        this.$el.html(this.template({
            categoryOptions: categoryOptions,
            count: this.collection.size(),
            months: months
        }));
        return this;
    };
    return SummaryView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = SummaryView;
//# sourceMappingURL=SummaryView.js.map