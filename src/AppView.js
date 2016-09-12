"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExpenseTable_1 = require("./ExpenseTable");
var CategoryView_1 = require("./CategoryView");
var MonthSelect_1 = require("./MonthSelect");
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var AppView = (function (_super) {
    __extends(AppView, _super);
    /**
     * Make sure to provide model: Expenses in options
     * and this.categoryList as well
     * @param options
     */
    function AppView(options) {
        _super.call(this, options);
        this.q = '';
        console.log('construct AppView');
        this.setElement($('#app'));
        this.setTemplate();
        this.categoryList = options.categoryList;
        this.table = new ExpenseTable_1["default"]({
            model: this.model,
            el: $('#expenseTable')
        });
        this.table.setCategoryList(this.categoryList);
        this.categories = new CategoryView_1["default"]({
            model: this.categoryList
        });
        console.log('category view model', this.categories.model);
        this.ms = new MonthSelect_1["default"]();
        this.ms.earliest = this.model.getEarliest();
        this.ms.latest = this.model.getLatest();
        this.ms.render();
        this.listenTo(this.ms, 'MonthSelect:change', this.monthChange);
        this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.model, "change", this.table.render);
        //this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
        $('.custom-search-form input').on('keyup', _.debounce(this.onSearch.bind(this), 300));
    }
    AppView.prototype.render = function () {
        if (!['', '#'].includes(window.location.hash))
            return;
        console.log('AppView.render()', this.model.size());
        this.setTemplate();
        this.table.render();
        this.categoryList.triggerChange();
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
        this.model.setAllVisible(); // silent
        this.model.filterByMonth(this.ms.getSelected()); // silent
        this.model.filterVisible(this.q); // silent
        this.render();
        // not needed due to the line in the constructor
        // @see this.categoryList.setExpenses()
        // wrong. this is called by this.render()
        //this.categoryList.triggerChange();
        elapse.timeEnd('AppView.monthChange');
    };
    AppView.prototype.onSearch = function (event) {
        this.q = $(event.target).val();
        console.log('Searching: ', this.q);
        this.monthChange(); // reuse
        // trigger manually since filterVisible is silent
        //this.model.trigger('change');
    };
    AppView.prototype.show = function () {
        elapse.time('AppView.show');
        this.ms.show();
        if (this.cache) {
            this.$el.html(this.cache);
            this.cache = null;
        }
        else {
            this.render();
        }
        elapse.timeEnd('AppView.show');
    };
    AppView.prototype.hide = function () {
        elapse.time('AppView.hide');
        this.ms.hide();
        if (this.$('#expenseTable').length) {
            this.cache = this.$el.children().detach();
        }
        elapse.timeEnd('AppView.hide');
    };
    return AppView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = AppView;
//# sourceMappingURL=AppView.js.map