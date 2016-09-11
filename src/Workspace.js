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
    }
    Workspace.prototype.AppView = function () {
        console.log('AppView');
        if (!this.app) {
            this.app = new AppView_1["default"]({
                model: this.model
            });
            this.app.render();
        }
        else {
            this.app.show();
        }
    };
    Workspace.prototype.Sync = function () {
        console.log('Sync');
        if (this.app) {
            this.app.hide();
        }
        if (!this.syncPage) {
            this.syncPage = new Sync_1["default"](this.model);
        }
        this.syncPage.render();
        // quick testing
        // let ms: MonthSelect = new MonthSelect();
        // ms.render();
    };
    Workspace.prototype.CatPage = function () {
        if (!this.catPage) {
            this.catPage = new CatPage_1["default"](this.model);
        }
        this.catPage.render();
    };
    return Workspace;
}(Backbone.Router));
exports.__esModule = true;
exports["default"] = Workspace;
//# sourceMappingURL=Workspace.js.map