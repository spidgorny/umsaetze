/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="Expenses.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Expenses_1 = require('./Expenses');
var ExpenseTable_1 = require('./ExpenseTable');
var CategoryView_1 = require('./CategoryView');
var CategoryCollection_1 = require("./CategoryCollection");
function asyncLoop(arr, callback, done) {
    (function loop(i) {
        callback(arr[i], i, arr.length); //callback when the loop goes on
        if (i < arr.length) {
            setTimeout(function () { loop(++i); }, 1); //rerun when condition is true
        }
        else {
            if (done) {
                done(arr.length); //callback when the loop ends
            }
        }
    }(0)); //start with 0
}
exports.asyncLoop = asyncLoop;
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView(options) {
        _super.call(this, options);
        console.log('construct AppView');
        this.setElement($('#app'));
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
        $('.custom-search-form input').on('keyup', this.onSearch.bind(this));
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
    };
    return AppView;
}(Backbone.View));
$(function () {
    var app = new AppView();
    app.render();
});
//# sourceMappingURL=umsaetze.js.map