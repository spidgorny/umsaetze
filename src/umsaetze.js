/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="Expenses.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var Expenses_1 = require('./Expenses');
var ExpenseTable_1 = require('./ExpenseTable');
require('datejs');
var CategoryView_1 = require('./CategoryView');
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView(options) {
        var _this = this;
        _super.call(this, options);
        console.log('construct AppView');
        this.setElement($('#app'));
        this.model = new Expenses_1["default"]();
        this.table = new ExpenseTable_1["default"]({
            model: this.model,
            el: $('#expenseTable')
        });
        this.categories = new CategoryView_1["default"]({
            model: this.model
        });
        this.startLoading();
        this.model.fetch({
            success: function () {
                _this.stopLoading();
            }
        });
        this.listenTo(this.model, "change", this.render.bind(this));
        this.listenTo(this.model, "change", this.categories.change.bind(this.categories));
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
        console.log('AppView.render()', this.model);
        if (this.model && this.model.size()) {
            this.table.render();
            this.$el.html('Table shown');
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