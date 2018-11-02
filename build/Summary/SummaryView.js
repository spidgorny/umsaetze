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
const SummaryLine_1 = __importDefault(require("./SummaryLine"));
const handlebars_1 = __importDefault(require("handlebars"));
const _ = __importStar(require("underscore"));
const $ = __importStar(require("jquery"));
const Controller_1 = __importDefault(require("../Controller"));
class SummaryView extends Controller_1.default {
    constructor(options, expenses) {
        super(options);
        this.expenses = expenses;
        this.setElement($('#app'));
        let importTag = $('#SummaryPage');
        let href = importTag.prop('href');
        $.get(href).then((result) => {
            this.template = handlebars_1.default.compile(result);
            this.render();
        });
    }
    initialize() {
    }
    show() {
        super.show();
        this.render();
    }
    render() {
        if (!this.template) {
            this.$el.html('Loading...');
            return this;
        }
        let categoryOptions = this.getCategoriesWithTotals();
        let months = _.pluck(categoryOptions[0].perMonth, 'year-month');
        categoryOptions = this.setPerCent(categoryOptions);
        categoryOptions = _.sortBy(categoryOptions, 'catName');
        categoryOptions = this.addCategoryTotals(categoryOptions);
        let content = this.template({
            categoryOptions: categoryOptions,
            count: this.collection.size(),
            months: months,
        });
        this.$el.html(content);
        return this;
    }
    getCategoriesWithTotals() {
        let categoryOptions = [];
        this.collection.each((category) => {
            let monthlyTotals = this.expenses.getMonthlyTotalsFor(category);
            let averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
            monthlyTotals = _.map(monthlyTotals, (el, key) => {
                let [year, month] = key.split('-');
                return {
                    'year-month': year + '-' + month,
                    year: year,
                    month: month,
                    categoryName: category.getName(),
                    value: el,
                };
            });
            categoryOptions.push(new SummaryLine_1.default({
                catName: category.getName(),
                background: category.get('color'),
                id: category.cid,
                average: averageAmountPerMonth,
                perMonth: monthlyTotals,
            }));
        });
        return categoryOptions;
    }
    setPerCent(categoryOptions) {
        let sumAverages = categoryOptions.reduce(function (current, b) {
            return current + (typeof b.average == 'number'
                ? b.average : parseFloat(b.average));
        }, 0);
        console.log('sumAverages', sumAverages);
        _.each(categoryOptions, (el) => {
            el.perCent = (el.average / sumAverages * 100).toFixed(2);
        });
        return categoryOptions;
    }
    addCategoryTotals(categoryOptions) {
        let groupByCategory = {};
        _.each(categoryOptions, (el) => {
            if (!el.catName) {
                console.log(el);
                return;
            }
            let [category, specifics] = el.catName.split(':');
            category = category.trim();
            if (!groupByCategory[category]) {
                groupByCategory[category] = [];
            }
            groupByCategory[category].push(el);
        });
        console.log(groupByCategory);
        _.each(groupByCategory, (set, setName) => {
            if (set.length > 1) {
                let newCat = new SummaryLine_1.default({
                    catName: setName + ' [' + set.length + ']',
                    background: '#FF8800',
                });
                _.each(set, (el) => {
                    newCat.combine(el);
                });
                newCat.sAverage = newCat.average.toFixed(2);
                newCat.perCent = typeof newCat.perCent == 'number'
                    ? newCat.perCent.toFixed(2) : newCat.perCent;
                categoryOptions.push(newCat);
            }
        });
        categoryOptions = _.sortBy(categoryOptions, 'catName');
        return categoryOptions;
    }
    hide() {
    }
}
exports.default = SummaryView;
//# sourceMappingURL=SummaryView.js.map