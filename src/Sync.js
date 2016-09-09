///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('file-saver');
var Sync = (function (_super) {
    __extends(Sync, _super);
    function Sync(expenses) {
        _super.call(this);
        this.$el = $('#app');
        this.template = _.template($('#SyncPage').html());
        this.model = expenses;
        this.listenTo(this.model, 'change', this.render);
    }
    Sync.prototype.render = function () {
        this.$el.html(this.template({
            memoryRows: this.model.size(),
            lsRows: this.model.localStorage.records.length
        }));
        this.$('#Load').on('click', Sync.load);
        this.$('#Save').on('click', this.save.bind(this));
        this.$('#Clear').on('click', Sync.clear);
        return this;
    };
    Sync.load = function () {
        console.log('Not implemented');
    };
    Sync.prototype.save = function () {
        var data = this.model.localStorage.findAll();
        console.log(data);
        var json = JSON.stringify(data, null, '\t');
        var blob = new Blob([json], {
            type: "application/json;charset=utf-8"
        });
        var filename = "umsaetze-" + Date.today().toString('yyyy-mm-dd') + '.json';
        console.log(filename);
        saveAs(blob, filename);
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