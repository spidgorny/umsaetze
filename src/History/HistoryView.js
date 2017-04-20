///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MonthSelect_1 = require("../MonthSelect");
var slTable_1 = require("../Util/slTable");
var Handlebars = require('handlebars');
var Backbone = require('backbone');
var _ = require('underscore');
var Chart = require('chart.js');
require('datejs');
var HistoryView = (function (_super) {
    __extends(HistoryView, _super);
    function HistoryView(options) {
        _super.call(this, options);
        this.collection = options.collection;
        this.setElement($('#app'));
        this.ms = MonthSelect_1.default.getInstance();
        this.ms.update(this.collection);
        this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));
        this.template = _.template('<canvas width="1024" height="256" ' +
            'class="sparkline" ' +
            'style="width: 1024px; height: 256px" ' +
            'data-chart_StrokeColor="rgba(151,187,0,1)" ' +
            'data-average="<%= average %>" ' +
            '></canvas>');
        // let nintendo = this.collection.findWhere({id: '6137a425c770c89cfd55d60f91448749'});
        // if (nintendo) {
        // 	nintendo.set('amount', 3714.69);
        // 	console.log(nintendo);
        // }
    }
    HistoryView.prototype.render = function () {
        this.collection.setAllVisible();
        var yearMonth = this.ms.getSelected();
        this.collection.filterByMonth(yearMonth);
        this.collection.stepBackTillSalary();
        var dataThisMonth = this.collection.getSorted();
        var accumulator = 0;
        var onlyMoney = dataThisMonth.map(function (set) {
            accumulator += set.get('amount');
            //console.log(set.get('amount'), accumulator);
            return accumulator;
        });
        var labels = dataThisMonth.map(function (set) {
            var date = set.get('date');
            return date.toString('yyyy.MM.dd');
        });
        var content = '';
        content += this.template({
            average: onlyMoney.average(),
        });
        content += new slTable_1.default(JSON.parse(JSON.stringify(dataThisMonth)));
        content += '<pre>' + JSON.stringify(dataThisMonth, null, 4) + '</pre>';
        this.$el.html(content);
        this.renderSparkLines(labels, onlyMoney);
        return this;
    };
    HistoryView.prototype.hide = function () {
        this.stopListening(this.ms);
    };
    HistoryView.prototype.monthChange = function () {
        //console.error('monthChange event');
        this.render();
    };
    HistoryView.prototype.renderSparkLines = function (labels, data) {
        var _this = this;
        var $sparkline = $('.sparkline');
        $sparkline.each(function (index, self) {
            //console.log($self);
            var $self = $(self);
            //Get context with jQuery - using jQuery's .get() method.
            var ctx = $self.get(0).getContext("2d");
            // Get the chart data and convert it to an array
            var average = $self.attr('data-average');
            var datasets = {};
            // Create the dataset
            datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
            datasets['data'] = data;
            var lineset = {
                type: 'line',
                label: 'Average per month',
                data: Array(data.length).fill(average),
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false,
            };
            // Add to data object
            var dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineset);
            var chart = new Chart.Line(ctx, {
                data: dataDesc,
                options: {
                    responsive: false,
                    responsiveAnimationDuration: 0,
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
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [{
                                ticks: {
                                    padding: 0,
                                }
                            }]
                    },
                    onClick: function (event, aChartElement) {
                        _this.clickOnChart(labels, event, aChartElement, _this);
                    }
                }
            });
            $self.prop('chart', chart);
            // $self.width('100%');
            // $self.height(256);
        });
    };
    HistoryView.prototype.clickOnChart = function (labels, event, aChart, context) {
    };
    return HistoryView;
}(Backbone.View));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HistoryView;
