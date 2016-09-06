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
        var _this = this;
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
        this.startLoading();
        this.model.fetch({
            success: function () {
                _this.stopLoading();
            }
        });
        this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.model, "change", this.table.render);
        //this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
    }
    AppView.prototype.startLoading = function () {
        console.log('startLoading');
        var template = _.template($('#loadingBar').html());
        this.$el.html(template());
    };
    AppView.prototype.stopLoading = function () {
        console.log('stopLoading');
        this.$el.html('Done');
    };
    AppView.prototype.render = function () {
        console.log('AppView.render()', this.model.size());
        if (this.model && this.model.size()) {
            //this.table.render();
            this.$el.html('Table shown');
            this.categories.change();
        }
        else {
            this.startLoading();
        }
        return this;
    };
    return AppView;
}(Backbone.View));
$(function () {
    var app = new AppView();
    app.render();
});
//# sourceMappingURL=umsaetze.js.map