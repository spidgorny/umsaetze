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
const ExpenseTable_1 = __importDefault(require("./ExpenseTable"));
const CategoryView_1 = __importDefault(require("./CategoryView"));
const main_1 = require("../main");
const CollectionController_1 = require("../CollectionController");
const $ = __importStar(require("jquery"));
const _ = __importStar(require("underscore"));
const CategoryCollectionModel_1 = __importDefault(require("../Category/CategoryCollectionModel"));
const MonthExpenses_1 = require("./MonthExpenses");
class AppView extends CollectionController_1.CollectionController {
    constructor(options, categoryList, keywords, monthSelect) {
        super();
        this.q = '';
        this.collection = options.viewCollection;
        this.setElement($('#app'));
        this.setTemplate();
        this.categoryList = categoryList;
        this.keywords = keywords;
        this.ms = monthSelect;
        let monthExpenses = new MonthExpenses_1.MonthExpenses(this.collection, this.ms.currentMonth);
        this.table = new ExpenseTable_1.default({
            model: monthExpenses,
            el: $('#expenseTable')
        }, this.keywords, this.categoryList);
        const categoryModel = new CategoryCollectionModel_1.default(this.categoryList);
        this.categoryView = new CategoryView_1.default({
            model: categoryModel
        }, this.ms.currentMonth, this.collection);
        this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));
        this.listenTo(this.table, 'Category:change', this.categoryChanged.bind(this));
        this.collection.filterByMonth(this.ms.getSelected());
        this.listenTo(this.collection, 'change', this.render);
        $('.custom-search-form input').on('keyup', _.debounce(this.onSearch.bind(this), 300));
        this.on('all', () => {
            main_1.debug('AppView');
        });
    }
    render() {
        console.log('AppView.render()', this.table.model.size(), '/', this.collection.size());
        this.setTemplate();
        console.log('this.table.render()');
        this.table.render();
        this.categoryView.render();
        this.$el.find('#applyKeywords')
            .off('click')
            .on('click', this.applyKeywords.bind(this));
        return this;
    }
    setTemplate() {
        if (!CollectionController_1.CollectionController.$('#expenseTable').length) {
            let template = _.template($('#AppView').html());
            this.$el.html(template());
            if (this.table) {
                this.table.$el = $('#expenseTable');
            }
        }
    }
    monthChange() {
        console.time('AppView.monthChange');
        this.collection.setAllVisible();
        this.collection.filterByMonth(this.ms.getSelected());
        this.collection.filterVisible(this.q);
        this.categoryList.getCategoriesFromExpenses();
        console.timeEnd('AppView.monthChange');
    }
    categoryChanged() {
        console.time('AppView.categoryChanged');
        this.categoryView.recalculate();
        console.timeEnd('AppView.categoryChanged');
    }
    onSearch(event) {
        this.q = $(event.target).val().toString();
        console.log('Searching: ', this.q);
        this.monthChange();
    }
    show() {
        super.show();
        console.time('AppView.show');
        this.ms.update(this.collection);
        this.render();
        this.categoryView.show();
        console.timeEnd('AppView.show');
    }
    hide() {
        console.time('AppView.hide');
        if (CollectionController_1.CollectionController.$('#expenseTable').length
            && CollectionController_1.CollectionController.$('#expenseTable').is(':visible')) {
        }
        this.categoryView.hide();
        console.timeEnd('AppView.hide');
    }
    applyKeywords(event) {
        event.preventDefault();
        console.log('applyKeywords');
        this.table.model.setCategories(this.keywords);
    }
}
exports.default = AppView;
//# sourceMappingURL=AppView.js.map