"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpenseTable_1 = require("./Expenses/ExpenseTable");
const CategoryView_1 = require("./Category/CategoryView");
const main_1 = require("./main");
const CollectionController_1 = require("./CollectionController");
const $ = require("jquery");
const _ = require("underscore");
const CategoryCollectionModel_1 = require("./Category/CategoryCollectionModel");
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
        this.table = new ExpenseTable_1.default({
            model: this.collection,
            el: $('#expenseTable')
        }, this.keywords);
        this.table.setCategoryList(this.categoryList);
        const categoryModel = new CategoryCollectionModel_1.default(this.categoryList);
        this.categories = new CategoryView_1.default({
            model: categoryModel
        });
        this.categories.setExpenses(this.collection);
        this.ms.update(this.collection);
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
        console.log('this.table.render()');
        this.table.render();
        this.categories.render();
        CollectionController_1.CollectionController.$('#applyKeywords').off().on('click', this.applyKeywords.bind(this));
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
        this.collection.setCategories(this.keywords);
    }
}
exports.default = AppView;
//# sourceMappingURL=AppView.js.map