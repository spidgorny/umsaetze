/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryCount_1 = require("./Category/CategoryCount");
var Handlebars = require('handlebars');
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var Chart = require('chart.js');
Object.values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
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
            Handlebars.compile(result));
        });
        //console.log(this);
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
                category.resetCounters();
                categoryOptions_1.push({
                    catName: category.get('catName'),
                    background: category.get('color'),
                    id: category.cid,
                    used: category.get('count'),
                    amount: category.getAmount(),
                    sparkline: JSON.stringify(_this.collection.getMonthlyTotalsFor(category))
                });
            });
            categoryOptions_1 = _.sortBy(categoryOptions_1, 'catName');
            this.$el.html(this.template({
                categoryOptions: categoryOptions_1
            }));
            this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
            this.$('input[name="newName"]').focus();
            this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
            this.$('button.close').on('click', this.deleteCategory.bind(this));
            this.$('#categoryCount').html(this.categoryList.size());
            this.renderSparkLines();
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
        var categoryObject = new CategoryCount_1["default"]({
            catName: newName
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
        console.log(id);
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
            self = $(self);
            //Get context with jQuery - using jQuery's .get() method.
            var ctx = self.get(0).getContext("2d");
            // Get the chart data and convert it to an array
            var chartData = JSON.parse(self.attr('data-chart_values'));
            // Build the data object
            var data = Object.values(chartData);
            var labels = Object.keys(chartData);
            //console.log(data, labels);
            var datasets = {};
            // Create the dataset
            datasets['strokeColor'] = self.attr('data-chart_StrokeColor');
            datasets['data'] = data;
            // Add to data object
            var dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets);
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
                    // Sadly if you set scaleFontSize to 0, chartjs crashes
                    // Instead we'll set it as small as possible and make it transparent
                    scaleFontSize: 1,
                    scaleFontColor: "rgba(0,0,0,0)",
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                                ticks: {
                                    padding: 0
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
    return CatPage;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CatPage;
//# sourceMappingURL=CatPage.js.map