"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
var AppView_1 = require('./AppView');
var Sync_1 = require('./Sync');
var Expenses_1 = require("./Expenses");
var CatPage_1 = require("./CatPage");
var CategoryCollection_1 = require("./CategoryCollection");
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(options) {
        _super.call(this, options);
        this.routes = {
            "": "AppView",
            "CatPage": "CatPage",
            "sync": "Sync"
        };
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
        if (!this.app) {
            this.app = new AppView_1["default"]({
                model: this.model,
                categoryList: this.categoryList
            });
        }
        this.app.show();
    };
    Workspace.prototype.Sync = function () {
        console.log('Sync');
        this.activateMenu();
        if (this.app) {
            this.app.hide();
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
        if (this.app) {
            this.app.hide();
        }
        if (!this.catPage) {
            this.catPage = new CatPage_1["default"](this.model, this.categoryList);
        }
        this.catPage.render();
    };
    return Workspace;
}(Backbone.Router));
exports.__esModule = true;
exports["default"] = Workspace;
//# sourceMappingURL=Workspace.js.map