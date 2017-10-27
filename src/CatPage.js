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
import CategoryCount from './Category/CategoryCount';
import { CollectionController } from './CollectionController';
import Handlebars from 'handlebars';
import Backbone from 'backbone-es6/src/Backbone.js';
import $ from 'jquery';
import { _ } from 'underscore';
import Chart from 'chart.js';
import toastr from 'toastr';
import './Util/Object';
var CatPage = (function (_super) {
    __extends(CatPage, _super);
    function CatPage(expenses, categoryList) {
        var _this = _super.call(this) || this;
        _this.$el = $('#app');
        console.log('CatPage.constructor');
        _this.collection = expenses;
        _this.categoryList = categoryList;
        var importTag = $('#CatPage');
        var href = importTag.prop('href');
        console.log(importTag, href);
        $.get(href).then(function (result) {
            _this.setTemplate(Handlebars.compile(result));
        });
        console.log(_this);
        _this.listenTo(_this.categoryList, 'change', _this.render);
        _this.listenTo(_this.categoryList, 'add', _this.render);
        _this.listenTo(_this.categoryList, 'update', _this.render);
        return _this;
    }
    CatPage.prototype.setTemplate = function (html) {
        this.template = html;
        this.render();
    };
    CatPage.prototype.render = function () {
        var _this = this;
        if (window.location.hash != '#CatPage')
            return;
        console.log('CatPage.render');
        if (this.template) {
            var categoryOptions_1 = [];
            this.categoryList.each(function (category) {
                var monthlyTotals = _this.collection.getMonthlyTotalsFor(category);
                category.resetCounters();
                var averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
                categoryOptions_1.push({
                    catName: category.get('catName'),
                    background: category.get('color'),
                    id: category.cid,
                    used: category.get('count'),
                    amount: averageAmountPerMonth,
                    average: averageAmountPerMonth,
                    sparkline: JSON.stringify(monthlyTotals),
                });
            });
            categoryOptions_1 = _.sortBy(categoryOptions_1, 'catName');
            this.$el.html(this.template({
                categoryOptions: categoryOptions_1,
            }));
            this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
            if ($(document).scrollTop() < 1) {
                this.$('input[name="newName"]').focus();
            }
            this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
            this.$('button.close').on('click', this.deleteCategory.bind(this));
            this.$('#categoryCount').html(this.categoryList.size().toString());
            this.$('.inlineEdit').data('callback', this.renameCategory.bind(this));
            setTimeout(function () {
                _this.renderSparkLines();
            }, 5000);
        }
        else {
            this.$el.html('Loading...');
        }
        return this;
    };
    CatPage.prototype.addCategory = function (event) {
        event.preventDefault();
        var $form = $(event.target);
        var newName = $form.find('input').val();
        console.log('newName', newName);
        var categoryObject = new CategoryCount({
            catName: newName,
        });
        console.log('get', categoryObject.get('catName'));
        console.log('get', categoryObject.get('color'));
        this.categoryList.add(categoryObject);
    };
    CatPage.prototype.selectColor = function (event) {
        console.log(event);
        var $input = $(event.target);
        var id = $input.closest('tr').attr('data-id');
        console.log('id', id);
        var category = this.categoryList.get(id);
        console.log('category by id', category);
        if (category) {
            category.set('color', event.target.value);
        }
    };
    CatPage.prototype.deleteCategory = function (event) {
        var button = event.target;
        var tr = $(button).closest('tr');
        var id = tr.attr('data-id');
        console.log('deleteCategory', id);
        this.categoryList.remove(id);
    };
    CatPage.prototype.renderSparkLines = function () {
        var _this = this;
        var $sparkline = $('.sparkline');
        $sparkline.each(function (index, self) {
            self = $(self);
            var ctx = self.get(0).getContext("2d");
            var chartData = JSON.parse(self.attr('data-chart_values'));
            var average = self.attr('data-average');
            var data = object.values(chartData);
            var labels = Object.keys(chartData);
            var datasets = {};
            datasets['strokeColor'] = self.attr('data-chart_StrokeColor');
            datasets['data'] = data;
            var lineSet = {
                type: 'line',
                label: 'Average per month',
                data: [].fill(average, 0, data.length),
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false,
            };
            var dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineSet);
            var catPage = _this;
            var chart = new Chart.Line(ctx, {
                data: dataDesc,
                options: {
                    responsive: true,
                    scaleLineColor: "rgba(0,0,0,0)",
                    scaleShowLabels: false,
                    scaleShowGridLines: false,
                    pointDot: false,
                    datasetFill: false,
                    scaleFontSize: 1,
                    scaleFontColor: "rgba(0,0,0,0)",
                    legend: {
                        display: false,
                    },
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                                ticks: {
                                    padding: 0,
                                }
                            }]
                    },
                    onClick: function (event, aChartElement) {
                        catPage.clickOnChart(labels, event, aChartElement, this);
                    }
                }
            });
            self.prop('chart', chart);
        });
    };
    CatPage.prototype.clickOnChart = function (labels, event, aChartElement, chart) {
        var catPage = this;
        var first = aChartElement.length ? aChartElement[0] : null;
        if (first) {
            console.log(labels, aChartElement);
            var yearMonth = labels[first._index];
            var _a = yearMonth.split('-'), year = _a[0], month = _a[1];
            var categoryID = $(event.target).closest('tr').attr('data-id');
            var category = catPage.categoryList.get(categoryID);
            console.log(yearMonth, year, month, category);
            Backbone.history.navigate('#/' + year + '/' + month + '/' + category.get('catName'));
        }
        else {
            console.log(this, event, event.target);
            var $canvas = $(event.target);
            if ($canvas.height() == 100) {
                $canvas.height(300);
            }
            else {
                $canvas.height(100);
            }
            setTimeout(function () {
                chart.resize();
            }, 1000);
        }
    };
    CatPage.prototype.renameCategory = function (event, container, newName) {
        console.log('Rename', newName);
        var id = container.closest('tr').attr('data-id');
        var category = this.categoryList.get(id);
        console.log(id, category);
        if (category) {
            var oldName = category.getName();
            if (this.categoryList.exists(newName)) {
                toastr.error('This category name is duplicate');
                container.find('span').text(oldName);
            }
            else {
                category.set('catName', newName);
                this.collection.replaceCategory(oldName, newName);
                this.categoryList.saveToLS();
            }
        }
    };
    return CatPage;
}(CollectionController));
export { CatPage };
//# sourceMappingURL=CatPage.js.map