"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Expenses_1 = require("./Expenses");
var ExpenseTable_1 = require("./ExpenseTable");
var CategoryCollection_1 = require("./CategoryCollection");
var CategoryView_1 = require("./CategoryView");
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView(options) {
        _super.call(this, options);
        console.log('construct AppView');
        this.setElement($('#app'));
        var template = _.template($('#AppView').html());
        this.$el.html(template());
        this.model = new Expenses_1["default"]();
        this.categoryList = new CategoryCollection_1["default"]();
        this.categoryList.setExpenses(this.model);
        this.table = new ExpenseTable_1["default"]({
            model: this.model,
            el: $('#expenseTable')
        });
        this.table.setCategoryList(this.categoryList);
        this.categories = new CategoryView_1["default"]({
            model: this.categoryList
        });
        console.log('category view model', this.categories.model);
        this.model.fetch();
        this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.model, "change", this.table.render);
        //this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
        $('.custom-search-form input').on('keyup', _.debounce(this.onSearch.bind(this), 300));
    }
    AppView.prototype.render = function () {
        console.log('AppView.render()', this.model.size());
        this.table.render();
        //this.$el.html('Table shown');
        this.categories.change();
        return this;
    };
    AppView.prototype.onSearch = function (event) {
        var q = $(event.target).val();
        console.log(q);
        this.model.filterVisible(q);
        // trigger manually since filterVisible is silent
        this.model.trigger('change');
    };
    return AppView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = AppView;
//# sourceMappingURL=AppView.js.map