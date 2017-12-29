"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpenseTable_1 = require("./Expenses/ExpenseTable");
const CategoryView_1 = require("./Category/CategoryView");
const MonthSelect_1 = require("./MonthSelect");
const main_1 = require("./main");
const CollectionController_1 = require("./CollectionController");
const $ = require("jquery");
const _ = require("underscore");
const CategoryCollectionModel_1 = require("./Category/CategoryCollectionModel");
class AppView extends CollectionController_1.CollectionController {
    constructor(options, categoryList) {
        super();
        this.q = '';
        console.log('construct AppView');
        this.collection = options.viewCollection;
        this.setElement($('#app'));
        this.setTemplate();
        this.categoryList = categoryList;
        this.table = new ExpenseTable_1.default({
            model: this.collection,
            el: $('#expenseTable')
        });
        this.table.setCategoryList(this.categoryList);
        const categoryModel = new CategoryCollectionModel_1.default(this.categoryList);
        this.categories = new CategoryView_1.default({
            model: categoryModel
        });
        this.categories.setExpenses(this.collection);
        this.ms = MonthSelect_1.default.getInstance();
        this.ms.earliest = this.collection.getEarliest();
        this.ms.latest = this.collection.getLatest();
        this.ms.render();
        this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));
        this.collection.selectedMonth = this.ms.getSelected();
        this.listenTo(this.collection, 'change', this.render);
        $('.custom-search-form input').on('keyup', _.debounce(this.onSearch.bind(this), 300));
        this.on('all', () => {
            main_1.debug('AppView');
        });
    }
    render() {
        console.log('AppView.render()', this.collection.size());
        this.setTemplate();
        this.table.render();
        this.categories.render();
        CollectionController_1.CollectionController.$('#applyKeywords').on('click', this.applyKeywords.bind(this));
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
        console.profile('AppView.monthChange');
        this.collection.setAllVisible();
        this.collection.filterByMonth(this.ms.getSelected());
        this.collection.filterVisible(this.q);
        this.categoryList.getCategoriesFromExpenses();
        console.profileEnd();
    }
    onSearch(event) {
        this.q = $(event.target).val().toString();
        console.log('Searching: ', this.q);
        this.monthChange();
    }
    show() {
        console.profile('AppView.show');
        this.ms.earliest = this.collection.getEarliest();
        this.ms.latest = this.collection.getLatest();
        console.log('MonthSelect range', this.ms.earliest.toString('yyyy-MM-dd'), this.ms.latest.toString('yyyy-MM-dd'), this.collection.size());
        this.ms.show();
        this.render();
        this.categories.show();
        console.profileEnd();
    }
    hide() {
        console.profile('AppView.hide');
        if (CollectionController_1.CollectionController.$('#expenseTable').length
            && CollectionController_1.CollectionController.$('#expenseTable').is(':visible')) {
        }
        this.categories.hide();
        console.profileEnd();
    }
    applyKeywords(event) {
        event.preventDefault();
        console.log('applyKeywords');
        this.table.model.setCategories(this.table.keywords);
    }
}
exports.default = AppView;
//# sourceMappingURL=AppView.js.map