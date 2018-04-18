"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const _ = require("underscore");
const $ = require("jquery");
const chart_js_1 = require("chart.js");
const main_1 = require("../main");
class CategoryView extends Backbone.View {
    constructor(options, currentMonth, expenses) {
        super(options);
        this.template = _.template($('#categoryTemplate').html());
        this.INCOME_CATEGORY = 'Income';
        this.categories = this.model.getCollection();
        this.categories.on('change', this.render.bind(this));
        this.currentMonth = currentMonth;
        this.setElement($('#categories'));
        this.on("all", () => {
            main_1.debug("CategoryView");
        });
        this.expenses = expenses;
        this.listenTo(this.expenses, 'change', this.recalculate.bind(this));
    }
    recalculate() {
        console.warn('CategoryView.recalculate');
        this.model.getCollection().getCategoriesFromExpenses();
    }
    render() {
        console.time('CategoryView.render');
        let categoryCount = this.categories.toJSON();
        console.log('categoryCount', categoryCount.length);
        let incomeRow = _.findWhere(categoryCount, {
            catName: this.INCOME_CATEGORY,
        });
        console.log('incomeRow', incomeRow);
        categoryCount = _.without(categoryCount, incomeRow);
        let sum = _.reduce(categoryCount, (memo, item) => {
            return memo + Math.abs(item.amount);
        }, 0);
        const content = this.renderTableRows(categoryCount, sum);
        this.$('#catElements').html(content.join('\n'));
        if (!incomeRow) {
            incomeRow = { amount: 0 };
        }
        this.$('.income').html(incomeRow.amount.toFixed(2));
        this.$('.total').html(sum.toFixed(2));
        this.showPieChart(Math.abs(sum));
        console.timeEnd('CategoryView.render');
        return this;
    }
    renderTableRows(categoryCount, sum) {
        categoryCount = _.sortBy(categoryCount, (el) => {
            return Math.abs(el.amount);
        }).reverse();
        let content = [];
        _.each(categoryCount, (catCount) => {
            let width = Math.round(100 * Math.abs(catCount.amount) / Math.abs(sum)) + '%';
            content.push(this.template(_.extend(catCount, {
                width: width,
                amount: Math.round(catCount.amount),
                sign: catCount.amount >= 0 ? 'positive' : 'negative',
                color: catCount.color,
                id: catCount.id,
                catName: catCount.catName,
                count: catCount.count,
                linkToCategory: this.currentMonth.getURL() + '/'
                    + catCount.catName,
            })));
        });
        return content;
    }
    _change() {
        console.log('CategoryView changed', this.model.getCollection().size());
        if (this.model) {
            this.render();
        }
        else {
            console.error('Not rendering since this.model is undefined');
        }
    }
    showPieChart(sum) {
        let labels = [];
        let colors = [];
        let dataSet1 = [];
        if (this.model) {
            this.model.getCollection().comparator = function (el) {
                return -Math.abs(el.getAmount());
            };
        }
        this.model.getCollection().sort();
        let rest = 0;
        this.model.getCollection().each((cat) => {
            if (cat.getName() != 'Income') {
                let amount = Math.abs(cat.getAmount());
                let perCent = 100 * amount / sum;
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
        let data = {
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
        this.myPieChart = new chart_js_1.Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    display: false,
                },
                animation: false,
            }
        });
    }
    filterByCategory(event) {
        event.preventDefault();
        let link = $(event.target);
        let id = link.attr('data-id');
        console.log('filterByCategory', id);
        let cat = this.model.get(id);
        if (cat) {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth(this.currentMonth.getSelected());
            this.expenses.filterByCategory(cat);
        }
        else {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth(this.currentMonth.getSelected());
        }
        this.expenses.trigger('change');
    }
    hide() {
        this.$el.hide();
        $('#pieChart').hide();
    }
    show() {
        this.$el.show();
        $('#pieChart').show();
    }
}
exports.default = CategoryView;
//# sourceMappingURL=CategoryView.js.map