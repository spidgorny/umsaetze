///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sync = (function (_super) {
    __extends(Sync, _super);
    function Sync() {
        _super.call(this);
        this.$el = $('#app');
        this.template = _.template($('#SyncPage').html());
    }
    Sync.prototype.render = function () {
        this.$el.html(this.template());
        var clearButton = this.$('#Clear');
        //console.log(clearButton);
        clearButton.on('click', Sync.clear);
        return this;
    };
    Sync.clear = function () {
        console.log('clear');
        var localStorage = new Backbone.LocalStorage("Expenses");
        localStorage._clear();
    };
    return Sync;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = Sync;
//# sourceMappingURL=Sync.js.map