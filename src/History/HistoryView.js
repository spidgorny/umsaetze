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
import MonthSelect from "../MonthSelect";
import { default as SLTable } from "../Util/SLTable";
import Backbone from 'backbone-es6/src/Backbone.js';
import _ from 'underscore';
import Chart from 'chart.js';
var HistoryView = (function (_super) {
    __extends(HistoryView, _super);
    function HistoryView(options) {
        var _this = _super.call(this, options) || this;
        _this.collection = options.collection;
        _this.setElement($('#app'));
        _this.ms = MonthSelect.getInstance();
        _this.ms.update(_this.collection);
        _this.listenTo(_this.ms, 'MonthSelect:change', _this.monthChange.bind(_this));
        _this.template = _.template('<canvas width="1500" height="512" ' +
            'class="sparkline" ' +
            'style="width: 1500px; height: 512px" ' +
            'data-chart_StrokeColor="rgba(151,187,0,1)" ' +
            'data-average="<%= average %>" ' +
            '></canvas>');
        return _this;
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
            return accumulator;
        });
        var labels = dataThisMonth.map(function (set) {
            var date = set.get('date');
            return date.toString('yyyy.MM.dd');
        });
        var content = '';
        content += this.template({
            average: onlyAmounts.average(),
        });
        content += new SLTable(JSON.parse(JSON.stringify(dataThisMonth)));
        this.$el.html(content);
        this.renderSparkLines(labels, onlyAmounts, cumulative);
        return this;
    };
    HistoryView.prototype.hide = function () {
        this.stopListening(this.ms);
    };
    HistoryView.prototype.monthChange = function () {
        this.render();
    };
    HistoryView.prototype.renderSparkLines = function (labels, data, data2) {
        var _this = this;
        var $sparkLine = $('.sparkline');
        $sparkLine.each(function (index, self) {
            var $self = $(self);
            var ctx = $self.get(0).getContext("2d");
            var datasets = {};
            datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
            datasets['data'] = data2;
            var lineSet = {
                type: 'line',
                label: 'Transaction',
                data: data,
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false,
            };
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
        });
    };
    HistoryView.prototype.clickOnChart = function (labels, event, aChart, context) {
        var any = aChart[0];
        var index = any._index;
        var model = this.collection.getSorted()[index];
        var id = model.get('id');
        $(window).scrollTop($("*:contains('" + id + "'):last").offset().top);
        document.location.hash = '#History/' + id;
    };
    return HistoryView;
}(Backbone.View));
export default HistoryView;
//# sourceMappingURL=HistoryView.js.map