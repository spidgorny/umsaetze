"use strict";
///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>
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
var MonthSelect_1 = require("../MonthSelect");
var SLTable_1 = require("../Util/SLTable");
var Handlebars = require('handlebars');
var Backbone = require('backbone');
var _ = require('underscore');
var Chart = require('chart.js');
require('datejs');
require('../Util/Array');
var HistoryView = /** @class */ (function (_super) {
    __extends(HistoryView, _super);
    function HistoryView(options) {
        var _this = _super.call(this, options) || this;
        _this.collection = options.collection;
        _this.setElement($('#app'));
        _this.ms = MonthSelect_1["default"].getInstance();
        _this.ms.update(_this.collection);
        _this.listenTo(_this.ms, 'MonthSelect:change', _this.monthChange.bind(_this));
        _this.template = _.template('<canvas width="1500" height="512" ' +
            'class="sparkline" ' +
            'style="width: 1500px; height: 512px" ' +
            'data-chart_StrokeColor="rgba(151,187,0,1)" ' +
            'data-average="<%= average %>" ' +
            '></canvas>');
        return _this;
        // let nintendo = this.collection.findWhere({id: '6137a425c770c89cfd55d60f91448749'});
        // if (nintendo) {
        // 	nintendo.set('amount', 3714.69);
        // 	console.log(nintendo);
        // }
    }
    HistoryView.prototype.initialize = function () {
    };
    HistoryView.prototype.render = function () {
        this.collection.setAllVisible();
        var yearMonth = this.ms.getSelected();
        console.log('yearMonth', yearMonth);
        this.collection.filterByMonth(yearMonth);
        this.collection.stepBackTillSalary(this.ms);
        var dataThisMonth = this.collection.getSorted();
        var onlyAmounts = dataThisMonth.map(function (set) {
            return set.get('amount');
        });
        var accumulator = 0;
        var cumulative = dataThisMonth.map(function (set) {
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
            average: onlyAmounts.average()
        });
        content += new SLTable_1["default"](JSON.parse(JSON.stringify(dataThisMonth)));
        //content += '<pre>' + JSON.stringify(dataThisMonth, null, 4) + '</pre>';
        this.$el.html(content);
        this.renderSparkLines(labels, onlyAmounts, cumulative);
        return this;
    };
    HistoryView.prototype.hide = function () {
        this.stopListening(this.ms);
    };
    HistoryView.prototype.monthChange = function () {
        //console.error('monthChange event');
        this.render();
    };
    HistoryView.prototype.renderSparkLines = function (labels, data, data2) {
        var _this = this;
        var $sparkLine = $('.sparkline');
        $sparkLine.each(function (index, self) {
            //console.log($self);
            var $self = $(self);
            //Get context with jQuery - using jQuery's .get() method.
            var ctx = $self.get(0).getContext("2d");
            var datasets = {};
            // Create the dataset
            datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
            datasets['data'] = data2;
            var lineSet = {
                type: 'line',
                label: 'Transaction',
                data: data,
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false
            };
            // Add to data object
            var dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineSet);
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
                        display: false
                    },
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [{
                                ticks: {
                                    padding: 0
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
        // console.log(labels);
        // console.log(event);
        // console.log(aChart);
        // console.log(context);
        var any = aChart[0];
        var index = any._index;
        // console.log(index);
        var model = this.collection.getSorted()[index];
        var id = model.get('id');
        // console.log(id);
        $(window).scrollTop($("*:contains('" + id + "'):last").offset().top);
        document.location.hash = '#History/' + id;
    };
    return HistoryView;
}(Backbone.View));
exports["default"] = HistoryView;
//# sourceMappingURL=HistoryView.js.map