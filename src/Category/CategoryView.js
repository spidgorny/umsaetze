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
import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Chart from 'chart.js';
import { debug } from '../main';
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        var _this = _super.call(this, options) || this;
        _this.template = _.template($('#categoryTemplate').html());
        _this.setElement($('#categories'));
        _this.listenTo(_this.model, 'change', _this.render);
        _this.$el.on('click', 'a.filterByCategory', _this.filterByCategory.bind(_this));
        _this.on("all", debug("CategoryView"));
        return _this;
    }
    CategoryView.prototype.setExpenses = function (expenses) {
        this.expenses = expenses;
        this.listenTo(this.expenses, 'change', this.recalculate);
    };
    CategoryView.prototype.recalculate = function () {
        console.warn('CategoryView.recalculate');
        this.model.getCategoriesFromExpenses();
    };
    CategoryView.prototype.render = function () {
        var _this = this;
        console.profile('CategoryView.render');
        var categoryCount = this.model.toJSON();
        var incomeRow = _.findWhere(categoryCount, {
            catName: 'Income',
        });
        categoryCount = _.without(categoryCount, incomeRow);
        var sum = _.reduce(categoryCount, function (memo, item) {
            return memo + Math.abs(item.amount);
        }, 0);
        categoryCount = _.sortBy(categoryCount, function (el) {
            return Math.abs(el.amount);
        }).reverse();
        var content = [];
        _.each(categoryCount, function (catCount) {
            var width = Math.round(100 * Math.abs(catCount.amount) / Math.abs(sum)) + '%';
            content.push(_this.template(_.extend(catCount, {
                width: width,
                amount: Math.round(catCount.amount),
                sign: catCount.amount >= 0 ? 'positive' : 'negative',
            })));
        });
        this.$('#catElements').html(content.join('\n'));
        if (!incomeRow) {
            incomeRow = { amount: 0 };
        }
        this.$('.income').html(incomeRow.amount.toFixed(2));
        this.$('.total').html(sum.toFixed(2));
        this.showPieChart(Math.abs(sum));
        console.profileEnd('CategoryView.render');
        return this;
    };
    CategoryView.prototype._change = function () {
        console.log('CategoryView changed', this.model.size());
        if (this.model) {
            this.render();
        }
        else {
            console.error('Not rendering since this.model is undefined');
        }
    };
    CategoryView.prototype.showPieChart = function (sum) {
        var labels = [];
        var colors = [];
        var dataSet1 = [];
        this.model.comparator = function (el) {
            return -Math.abs(el.getAmount());
        };
        this.model.sort();
        var rest = 0;
        this.model.each(function (cat) {
            if (cat.getName() != 'Income') {
                var amount = Math.abs(cat.getAmount());
                var perCent = 100 * amount / sum;
                if (perCent > 3) {
                    labels.push(cat.get('catName'));
                    dataSet1.push(amount);
                    colors.push(cat.get('color'));
                }
                else {
                    rest += amount;
                }
            }
        });
        labels.push('Rest');
        dataSet1.push(rest.toFixed(2));
        var data = {
            labels: labels,
            datasets: [
                {
                    data: dataSet1,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors,
                }
            ]
        };
        if (this.myPieChart) {
            this.myPieChart.destroy();
        }
        this.myPieChart = new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    display: false,
                }
            }
        });
    };
    CategoryView.prototype.filterByCategory = function (event) {
        event.preventDefault();
        var link = $(event.target);
        var id = link.attr('data-id');
        console.log('filterByCategory', id);
        var cat = this.model.get(id);
        if (cat) {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth();
            this.expenses.filterByCategory(cat);
        }
        else {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth();
        }
        this.expenses.trigger('change');
    };
    CategoryView.prototype.hide = function () {
        this.$el.hide();
        $('#pieChart').hide();
    };
    CategoryView.prototype.show = function () {
        this.$el.show();
        $('#pieChart').show();
    };
    return CategoryView;
}(Backbone.View));
export default CategoryView;
//# sourceMappingURL=CategoryView.js.map