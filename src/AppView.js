"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExpenseTable_1 = require("./Expenses/ExpenseTable");
var CategoryView_1 = require("./Category/CategoryView");
var MonthSelect_1 = require("./MonthSelect");
var umsaetze_1 = require("./umsaetze");
// import Backbone from 'backbone';
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
// const BS = require('bootstrap');
// let bs = BS;
var AppView = (function (_super) {
    __extends(AppView, _super);
    /**
     * Make sure to provide collection: Expenses in options
     * and this.categoryList as well
     * @param options
     */
    function AppView(options, categoryList) {
        _super.call(this, options);
        this.q = '';
        console.log('construct AppView');
        this.collection = options.collection;
        this.setElement($('#app'));
        this.setTemplate();
        this.categoryList = categoryList;
        this.table = new ExpenseTable_1.default({
            model: this.collection,
            el: $('#expenseTable')
        });
        this.table.setCategoryList(this.categoryList);
        this.categories = new CategoryView_1.default({
            model: this.categoryList,
        });
        this.categories.setExpenses(this.collection);
        //console.log('category view collection', this.categories.model);
        this.ms = new MonthSelect_1.default();
        this.ms.earliest = this.collection.getEarliest();
        this.ms.latest = this.collection.getLatest();
        this.ms.render();
        this.listenTo(this.ms, 'MonthSelect:change', this.monthChange);
        this.collection.selectedMonth = this.ms.getSelected(); // for filtering to know which month we're in
        this.listenTo(this.collection, "change", this.render);
        //this.listenTo(this.collection, "change", this.table.render);
        //this.listenTo(this.collection, "change", this.categories.change); // wrong collection inside ? wft?!
        $('.custom-search-form input').on('keyup', _.debounce(this.onSearch.bind(this), 300));
        this.on("all", umsaetze_1.debug("AppView"));
    }
    AppView.prototype.render = function () {
        //if (!['', '#'].includes(window.location.hash)) return;
        console.log('AppView.render()', this.collection.size());
        this.setTemplate();
        // should not be done as any outside filter stop working
        // this.collection.setAllVisible();
        // this.collection.filterByMonth();
        this.table.render();
        this.categories.render();
        this.$('#applyKeywords').on('click', this.applyKeywords.bind(this));
        // let popover = $('[data-toggle="popover"]').popover();
        // console.log(popover);
        return this;
    };
    AppView.prototype.setTemplate = function () {
        // if no table in DOM, reset it
        if (!this.$('#expenseTable').length) {
            var template = _.template($('#AppView').html());
            this.$el.html(template());
            // not created by constructor yet (already yes in render())
            if (this.table) {
                this.table.$el = $('#expenseTable');
            }
        }
    };
    AppView.prototype.monthChange = function () {
        elapse.time('AppView.monthChange');
        this.collection.setAllVisible(); // silent
        this.collection.filterByMonth(this.ms.getSelected()); // silent
        this.collection.filterVisible(this.q); // silent
        //this.render();	// will be called by getCategoriesFromExpenses()
        // not needed due to the line in the constructor
        // @see this.categoryList.setExpenses()
        // wrong. this is called by this.render()
        this.categoryList.getCategoriesFromExpenses();
        elapse.timeEnd('AppView.monthChange');
    };
    AppView.prototype.onSearch = function (event) {
        this.q = $(event.target).val();
        console.log('Searching: ', this.q);
        this.monthChange(); // reuse
        // trigger manually since filterVisible is silent
        //this.collection.trigger('change');
    };
    AppView.prototype.show = function () {
        elapse.time('AppView.show');
        this.ms.earliest = this.collection.getEarliest();
        this.ms.latest = this.collection.getLatest();
        console.log('MonthSelect range', this.ms.earliest.toString('yyyy-MM-dd'), this.ms.latest.toString('yyyy-MM-dd'), this.collection.size());
        this.ms.show();
        this.render();
        this.categories.show();
        elapse.timeEnd('AppView.show');
    };
    AppView.prototype.hide = function () {
        elapse.time('AppView.hide');
        this.ms.hide();
        if (this.$('#expenseTable').length
            && this.$('#expenseTable').is(':visible')) {
        }
        this.categories.hide();
        elapse.timeEnd('AppView.hide');
    };
    AppView.prototype.applyKeywords = function (event) {
        event.preventDefault();
        console.log('applyKeywords');
        this.table.model.setCategories(this.table.keywords);
    };
    return AppView;
}(Backbone.View));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppView;
//# sourceMappingURL=AppView.js.map