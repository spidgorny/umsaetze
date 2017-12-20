"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryCount_1 = require('./Category/CategoryCount');
var CollectionController_1 = require('./CollectionController');
var handlebars_1 = require('handlebars');
// import Backbone from 'backbone-es6/src/Backbone.js';
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var chart_js_1 = require('chart.js');
var toastr_1 = require('toastr');
require('./Util/Object');
var CatPage = (function (_super) {
    __extends(CatPage, _super);
    function CatPage(expenses, categoryList) {
        var _this = this;
        _super.call(this);
        this.$el = $('#app');
        console.log('CatPage.constructor');
        this.collection = expenses;
        this.categoryList = categoryList;
        var importTag = $('#CatPage');
        var href = importTag.prop('href');
        console.log(importTag, href);
        $.get(href).then(function (result) {
            //console.log(result);
            _this.setTemplate(
            //_.template( result )
            handlebars_1.default.compile(result));
        });
        console.log(this);
        this.listenTo(this.categoryList, 'change', this.render);
        this.listenTo(this.categoryList, 'add', this.render);
        this.listenTo(this.categoryList, 'update', this.render);
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
                //console.log(category);
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
            CollectionController_1.CollectionController.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
            if ($(document).scrollTop() < 1) {
                CollectionController_1.CollectionController.$('input[name="newName"]').focus();
            }
            this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
            CollectionController_1.CollectionController.$('button.close').on('click', this.deleteCategory.bind(this));
            CollectionController_1.CollectionController.$('#categoryCount').html(this.categoryList.size().toString());
            CollectionController_1.CollectionController.$('.inlineEdit').data('callback', this.renameCategory.bind(this));
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
        var categoryObject = new CategoryCount_1.default({
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
            //console.log('color', event.target.value);
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
    /**
     * https://codepen.io/ojame/pen/HpKvx
     */
    CatPage.prototype.renderSparkLines = function () {
        var _this = this;
        var $sparkline = $('.sparkline');
        $sparkline.each(function (index, self) {
            //console.log(self);
            var $self = $(self);
            //Get context with jQuery - using jQuery's .get() method.
            var canvas = $self.get(0);
            var ctx = canvas.getContext("2d");
            // Get the chart data and convert it to an array
            var chartData = JSON.parse($self.attr('data-chart_values'));
            var average = $self.attr('data-average');
            // Build the data object
            var data = Object.values(chartData);
            var labels = Object.keys(chartData);
            //console.log(data, labels);
            var datasets = {};
            // Create the dataset
            datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
            datasets['data'] = data;
            var lineSet = {
                type: 'line',
                label: 'Average per month',
                data: [].fill(average, 0, data.length),
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false,
            };
            // Add to data object
            var dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineSet);
            var catPage = _this;
            var chart = new chart_js_1.default.Line(ctx, {
                data: dataDesc,
                options: {
                    responsive: true,
                    scaleLineColor: "rgba(0,0,0,0)",
                    scaleShowLabels: false,
                    scaleShowGridLines: false,
                    pointDot: false,
                    datasetFill: false,
                    // Sadly if you set scaleFontSize to 0, chartjs crashes
                    // Instead we'll set it as small as possible and make it transparent
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
            $self.prop('chart', chart);
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
                toastr_1.default.error('This category name is duplicate');
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
}(CollectionController_1.CollectionController));
exports.CatPage = CatPage;
