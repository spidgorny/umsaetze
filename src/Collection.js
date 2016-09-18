"use strict";
///<reference path="../typings/index.d.ts"/>
var simpleStorage = require('simpleStorage.js');
var Collection = (function () {
    function Collection() {
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
    };
    return Collection;
}());
exports.__esModule = true;
exports["default"] = Collection;
//# sourceMappingURL=Collection.js.map