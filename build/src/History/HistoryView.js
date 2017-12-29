"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MonthSelect_1 = require("../MonthSelect");
const SLTable_1 = require("../Util/SLTable");
const Backbone = require("backbone");
const _ = require("underscore");
const chart_js_1 = require("chart.js");
const $ = require("jquery");
const ArrayPlus_1 = require("../Sync/ArrayPlus");
class HistoryView extends Backbone.View {
    constructor(options) {
        super(options);
        this.collection = options.collection;
        this.setElement($('#app'));
        this.ms = MonthSelect_1.default.getInstance();
        this.ms.update(this.collection);
        this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));
        this.template = _.template('<canvas width="1500" height="512" ' +
            'class="sparkline" ' +
            'style="width: 1500px; height: 512px" ' +
            'data-chart_StrokeColor="rgba(151,187,0,1)" ' +
            'data-average="<%= average %>" ' +
            '></canvas>');
    }
    initialize() {
    }
    render() {
        this.collection.setAllVisible();
        const yearMonth = this.ms.getSelected();
        console.log('yearMonth', yearMonth);
        this.collection.filterByMonth(yearMonth);
        this.collection.stepBackTillSalary(this.ms);
        const dataThisMonth = this.collection.getSorted();
        let onlyAmounts = new ArrayPlus_1.default(dataThisMonth.map((set) => {
            return set.get('amount');
        }));
        let accumulator = 0;
        let cumulative = dataThisMonth.map((set) => {
            accumulator += set.get('amount');
            return accumulator;
        });
        let labels = dataThisMonth.map((set) => {
            let date = set.get('date');
            return date.toString('yyyy.MM.dd');
        });
        let content = '';
        content += this.template({
            average: onlyAmounts.average(),
        });
        content += new SLTable_1.default(JSON.parse(JSON.stringify(dataThisMonth)));
        this.$el.html(content);
        this.renderSparkLines(labels, onlyAmounts, cumulative);
        return this;
    }
    hide() {
        this.stopListening(this.ms);
    }
    monthChange() {
        this.render();
    }
    renderSparkLines(labels, data, data2) {
        let $sparkLine = $('.sparkline');
        $sparkLine.each((index, self) => {
            let $self = $(self);
            let ctx = $self.get(0).getContext("2d");
            let datasets = {};
            datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
            datasets['data'] = data2;
            let lineSet = {
                type: 'line',
                label: 'Transaction',
                data: data,
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false,
            };
            let dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineSet);
            let chart = new chart_js_1.Chart.Line(ctx, {
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
                    onClick: (event, aChartElement) => {
                        this.clickOnChart(labels, event, aChartElement, this);
                    }
                }
            });
            $self.prop('chart', chart);
        });
    }
    clickOnChart(labels, event, aChart, context) {
        let any = aChart[0];
        let index = any._index;
        let model = this.collection.getSorted()[index];
        let id = model.get('id');
        $(window).scrollTop($("*:contains('" + id + "'):last").offset().top);
        document.location.hash = '#History/' + id;
    }
}
exports.default = HistoryView;
//# sourceMappingURL=HistoryView.js.map