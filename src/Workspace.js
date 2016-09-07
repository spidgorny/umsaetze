"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
var AppView_1 = require('./AppView');
var Sync_1 = require('./Sync');
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(options) {
        _super.call(this, options);
        this.routes = {
            "": "AppView",
            "help": "help",
            "sync": "sync"
        };
        this._bindRoutes();
    }
    Workspace.prototype.AppView = function () {
        console.log('AppView');
        var app = new AppView_1["default"]();
        app.render();
    };
    Workspace.prototype.help = function () {
        console.log('help()');
    };
    Workspace.prototype.sync = function () {
        var sync = new Sync_1["default"]();
        sync.render();
    };
    return Workspace;
}(Backbone.Router));
exports.__esModule = true;
exports["default"] = Workspace;
//# sourceMappingURL=Workspace.js.map