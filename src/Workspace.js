///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppView_1 = require('./AppView');
var Sync_1 = require('./Sync/Sync');
var Expenses_1 = require("./Expenses/Expenses");
var CatPage_1 = require("./CatPage");
var KeywordsView_1 = require("./Keyword/KeywordsView");
var CategoryCollection_1 = require("./Category/CategoryCollection");
var KeywordCollection_1 = require("./Keyword/KeywordCollection");
var SummaryView_1 = require("./Summary/SummaryView");
var Backbone = require('backbone');
var $ = require('jquery');
// let _ = require('underscore');
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(options) {
        _super.call(this, options);
        this.routes = {
            "": "AppView",
            ":year/:month": "MonthSelect",
            ":year/:month/:category": "MonthSelectCategory",
            "CatPage": "CatPage",
            "Sync": "Sync",
            "Keywords": "Keywords",
            "Summary": "Summary"
        };
        this.keywords = new KeywordCollection_1["default"]();
        this._bindRoutes();
        this.model = new Expenses_1["default"]();
        this.model.fetch();
        this.categoryList = new CategoryCollection_1["default"]();
        this.categoryList.setExpenses(this.model);
    }
    Workspace.prototype.activateMenu = function () {
        var url = window.location;
        // var element = $('ul.nav a').filter(function() {
        //     return this.href == url;
        // }).addClass('active').parent().parent().addClass('in').parent();
        var element = $('ul.nav#side-menu a')
            .removeClass('active')
            .filter(function () {
            return this.href == url;
        })
            .addClass('active')
            .parent()
            .removeClass('in');
        while (true) {
            if (element.is('li')) {
                element = element.parent().addClass('in').parent();
            }
            else {
                break;
            }
        }
    };
    Workspace.prototype.AppView = function () {
        console.log('AppView');
        this.activateMenu();
        if (!this.appPage) {
            this.appPage = new AppView_1["default"]({
                collection: this.model
            }, this.categoryList);
            this.appPage.table.keywords = this.keywords;
        }
        this.appPage.show();
    };
    Workspace.prototype.Sync = function () {
        console.log('Sync');
        this.activateMenu();
        if (this.appPage) {
            this.appPage.hide();
        }
        else {
            $('#MonthSelect').hide(); // for consistency
        }
        if (!this.syncPage) {
            this.syncPage = new Sync_1["default"](this.model);
            this.syncPage.router = this;
        }
        this.syncPage.render();
        // quick testing
        // let ms: MonthSelect = new MonthSelect();
        // ms.render();
    };
    Workspace.prototype.CatPage = function () {
        console.log('CatPage');
        this.activateMenu();
        if (this.appPage) {
            this.appPage.hide();
        }
        if (!this.catPage) {
            this.catPage = new CatPage_1["default"](this.model, this.categoryList);
        }
        this.catPage.render();
    };
    Workspace.prototype.Keywords = function () {
        console.log('Keywords');
        this.activateMenu();
        if (this.appPage) {
            this.appPage.hide();
        }
        if (!this.keywordsPage) {
            this.keywordsPage = new KeywordsView_1["default"]();
            this.keywordsPage.keywords = this.keywords;
        }
        this.keywordsPage.render();
    };
    Workspace.prototype.MonthSelect = function (year, month) {
        console.log('MonthSelect', year, month);
        this.AppView();
        this.appPage.ms.setYearMonth(year, month);
    };
    Workspace.prototype.MonthSelectCategory = function (year, month, category) {
        console.log('MonthSelectCategory', year, month, category);
        this.AppView();
        this.appPage.ms.setYearMonth(year, month);
        var cat = this.categoryList.findWhere({ catName: category });
        console.log('MonthSelectCategory cat', cat);
        this.appPage.collection.filterByCategory(cat);
        this.appPage.collection.trigger('change'); // slow!
    };
    Workspace.prototype.Summary = function () {
        console.log('Summary');
        this.activateMenu();
        if (this.appPage) {
            this.appPage.hide();
        }
        if (!this.summaryPage) {
            this.summaryPage = new SummaryView_1["default"]({
                collection: this.categoryList
            }, this.model);
        }
        $('#pieChart').hide();
        $('#categories').hide();
        this.summaryPage.render();
    };
    return Workspace;
}(Backbone.Router));
exports.__esModule = true;
exports["default"] = Workspace;
//# sourceMappingURL=Workspace.js.map