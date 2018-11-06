"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCount_1 = __importDefault(require("../Category/CategoryCount"));
const CollectionController_1 = require("../CollectionController");
const handlebars_1 = __importDefault(require("handlebars"));
const jquery_1 = __importDefault(require("jquery"));
const _ = __importStar(require("underscore"));
const chart_js_1 = require("chart.js");
const toastr_1 = __importDefault(require("toastr"));
require("../Util/Object");
const Backbone = require("backbone");
class CatPage extends CollectionController_1.CollectionController {
    constructor(expenses, categoryList) {
        super();
        this.$el = jquery_1.default('#app');
        console.log('CatPage.constructor');
        this.collection = expenses;
        this.categoryList = categoryList;
        let importTag = jquery_1.default('#CatPage');
        if (importTag.length) {
            let href = importTag.prop('href');
            console.log('importTag', importTag, href);
            jquery_1.default.get(href).then((result) => {
                this.setTemplate(handlebars_1.default.compile(result));
            });
        }
        else {
            console.error('#CatPage not found');
        }
        this.listenTo(this.categoryList, 'change', this.render);
        this.listenTo(this.categoryList, 'add', this.render);
        this.listenTo(this.categoryList, 'update', this.render);
    }
    setTemplate(html) {
        this.template = html;
        this.render();
    }
    show() {
        super.show();
        this.render();
    }
    render() {
        if (!this.visible) {
            return this;
        }
        if (window.location.hash != '#CatPage') {
            return this;
        }
        if (this.template) {
            let categoryOptions = [];
            this.categoryList.each((category) => {
                let monthlyTotals = this.collection.getMonthlyTotalsFor(category);
                category.resetCounters();
                let averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
                categoryOptions.push({
                    catName: category.get('catName'),
                    background: category.get('color'),
                    id: category.cid,
                    used: category.get('count'),
                    amount: averageAmountPerMonth,
                    average: averageAmountPerMonth,
                    sparkline: JSON.stringify(monthlyTotals),
                });
            });
            categoryOptions = _.sortBy(categoryOptions, 'catName');
            this.$el.html(this.template({
                categoryOptions: categoryOptions,
            }));
            CollectionController_1.CollectionController.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
            if (jquery_1.default(document).scrollTop() < 1) {
                CollectionController_1.CollectionController.$('input[name="newName"]').focus();
            }
            this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
            CollectionController_1.CollectionController.$('button.close').on('click', this.deleteCategory.bind(this));
            CollectionController_1.CollectionController.$('#categoryCount').html(this.categoryList.size().toString());
            CollectionController_1.CollectionController.$('.inlineEdit').data('callback', this.renameCategory.bind(this));
            this.renderSparkLines();
        }
        else {
            this.$el.html('Loading CatPage template...');
        }
        return this;
    }
    addCategory(event) {
        event.preventDefault();
        let $form = jquery_1.default(event.target);
        let newName = $form.find('input').val();
        let categoryObject = new CategoryCount_1.default({
            catName: newName,
        });
        this.categoryList.add(categoryObject);
    }
    selectColor(event) {
        let $input = jquery_1.default(event.target);
        let id = $input.closest('tr').attr('data-id');
        console.log('id', id);
        let category = this.categoryList.get(id);
        console.log('category by id', category);
        if (category) {
            category.set('color', event.target.value);
        }
    }
    deleteCategory(event) {
        let button = event.target;
        let tr = jquery_1.default(button).closest('tr');
        let id = tr.attr('data-id');
        this.categoryList.remove(id);
    }
    renderSparkLines() {
        let $sparkline = jquery_1.default('.sparkline');
        $sparkline.each((index, self) => {
            const $self = jquery_1.default(self);
            const canvas = $self.get(0);
            let ctx = canvas.getContext("2d");
            let chartData = JSON.parse($self.attr('data-chart_values'));
            let average = $self.attr('data-average');
            let data = Object.values(chartData);
            let labels = Object.keys(chartData);
            let datasets = {};
            datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
            datasets['data'] = data;
            let lineSet = {
                type: 'line',
                label: 'Average per month',
                data: [].fill(average, 0, data.length),
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false,
            };
            let dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineSet);
            let catPage = this;
            let chart = new chart_js_1.Chart.Line(ctx, {
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
                    animationEnabled: false,
                    onClick: function (event, aChartElement) {
                        catPage.clickOnChart(labels, event, aChartElement, this);
                    }
                }
            });
            $self.prop('chart', chart);
        });
    }
    clickOnChart(labels, event, aChartElement, chart) {
        let catPage = this;
        let first = aChartElement.length ? aChartElement[0] : null;
        if (first) {
            console.log(labels, aChartElement);
            let yearMonth = labels[first._index];
            let [year, month] = yearMonth.split('-');
            let categoryID = jquery_1.default(event.target).closest('tr').attr('data-id');
            let category = catPage.categoryList.get(categoryID);
            console.log(yearMonth, year, month, category);
            Backbone.history.navigate('#/' + year + '/' + month + '/' + category.get('catName'));
        }
        else {
            console.log(this, event, event.target);
            let $canvas = jquery_1.default(event.target);
            if ($canvas.height() == 100) {
                $canvas.height(300);
            }
            else {
                $canvas.height(100);
            }
        }
    }
    renameCategory(event, container, newName) {
        console.log('Rename', newName);
        let id = container.closest('tr').attr('data-id');
        let category = this.categoryList.get(id);
        console.log(id, category);
        if (category) {
            let oldName = category.getName();
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
    }
    hide() {
    }
}
exports.CatPage = CatPage;
//# sourceMappingURL=CatPage.js.map