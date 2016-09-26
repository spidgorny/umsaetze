///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>
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
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var Chart = require('chart.js');
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        _super.call(this, options);
        this.template = _.template($('#categoryTemplate').html());
        this.setElement($('#categories'));
        this.listenTo(this.model, 'change', this.render);
        this.$el.on('click', 'a.filterByCategory', this.filterByCategory.bind(this));
    }
    CategoryView.prototype.setExpenses = function (expenses) {
        this.expenses = expenses;
    };
    CategoryView.prototype.render = function () {
        var _this = this;
        elapse.time('CategoryView.render');
        var content = [];
        var categoryCount = this.model.toJSON();
        var sum = _.reduce(categoryCount, function (memo, item) {
            // only expenses
            return memo + Math.abs(item.amount);
        }, 0);
        //console.log('sum', sum);
        categoryCount = _.sortBy(categoryCount, function (el) {
            return Math.abs(el.amount);
        }).reverse();
        _.each(categoryCount, function (catCount) {
            var width = Math.round(100 * Math.abs(catCount.amount) / Math.abs(sum)) + '%';
            //console.log(catCount.catName, width, catCount.count, catCount.amount);
            content.push(_this.template(_.extend(catCount, {
                width: width,
                amount: Math.round(catCount.amount),
                sign: catCount.amount >= 0 ? 'positive' : 'negative'
            })));
        });
        this.$el.html(content.join('\n'));
        this.$el.append('<div class="category text-right">' +
            '<a href="#" class="filterByCategory">Total</a>: ' + sum.toFixed(2) + ' &euro;' +
            '</div>');
        this.showPieChart();
        elapse.timeEnd('CategoryView.render');
        return this;
    };
    /**
     * @deprecated
     * @private
     */
    CategoryView.prototype._change = function () {
        console.log('CategoryView changed', this.model.size());
        if (this.model) {
            //console.log('Calling CategoryCollection.change()');
            //this.model.change();	// called automagically
            this.render();
        }
        else {
            console.error('Not rendering since this.model is undefined');
        }
    };
    CategoryView.prototype.showPieChart = function () {
        var labels = [];
        var data = [];
        var colors = [];
        this.model.each(function (cat) {
            labels.push(cat.get('catName'));
            data.push(Math.abs(cat.getAmount()));
            colors.push(cat.get('color'));
        });
        var data = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors
                }
            ]
        };
        var myPieChart = new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    display: false
                }
            }
        });
    };
    CategoryView.prototype.filterByCategory = function (event) {
        event.preventDefault();
        var link = $(event.target);
        var id = link.attr('data-id');
        console.error('filterByCategory', id);
        var cat = this.model.get(id);
        //console.log(cat);
        //this.expenses.filterByMonth();
        if (cat) {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth();
            this.expenses.filterByCategory(cat);
        }
        else {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth();
        }
        this.expenses.trigger('change'); // slow!
    };
    return CategoryView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CategoryView;
//# sourceMappingURL=CategoryView.js.map