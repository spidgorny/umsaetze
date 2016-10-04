"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../typings/index.d.ts"/>
var simpleStorage = require('simpleStorage.js');
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection() {
        _super.call(this, arguments);
        this.models = [];
        this.name = this.constructor.name;
    }
    /**
     * Call this after setting this.modelClass
     */
    Collection.prototype.fetch = function () {
        var _this = this;
        var models = simpleStorage.get(this.name) || [];
        models.forEach(function (row) {
            var model = new _this.modelClass(row);
            _this.add(model);
        });
    };
    Collection.prototype.add = function (model) {
        this.models.push(model);
        this.save();
    };
    Collection.prototype.save = function () {
        simpleStorage.set(this.name, this.models);
        console.log(this.name + ' saved ' + this.size() + ' records');
    };
    Collection.prototype.each = function (callback) {
        this.models.forEach(function (el) {
            //console.log('each', el);
            callback(el);
        });
    };
    Collection.prototype.getJSON = function () {
        return JSON.stringify(this.models, null, '\t');
    };
    Collection.prototype.size = function () {
        return this.models.length;
    };
    return Collection;
}(Array));
exports.__esModule = true;
exports["default"] = Collection;
//# sourceMappingURL=Collection.js.map