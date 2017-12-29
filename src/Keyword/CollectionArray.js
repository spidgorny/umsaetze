"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// import {simplestorage as simpleStorage} from 'simplestorage.js';
var simpleStorage = require('simplestorage.js');
var _ = require('underscore');
var CollectionArray = (function (_super) {
    __extends(CollectionArray, _super);
    function CollectionArray() {
        var arguments2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arguments2[_i - 0] = arguments[_i];
        }
        _super.apply(this, arguments2);
        this.models = [];
        this.name = this.constructor.prototype.name;
    }
    /**
     * Call this after setting this.modelClass
     */
    CollectionArray.prototype.fetch = function () {
        var _this = this;
        var models = simpleStorage.get(this.name) || [];
        models.forEach(function (row) {
            if (row) {
                var model = new _this.modelClass(row);
                _this.add(model);
            }
        });
    };
    CollectionArray.prototype.add = function (model) {
        this.models.push(model);
        this.save();
    };
    CollectionArray.prototype.save = function () {
        simpleStorage.set(this.name, this.models);
        //console.log(this.name+' saved '+this.size()+' records');
    };
    CollectionArray.prototype.each = function (callback) {
        this.models.forEach(function (el) {
            //console.log('each', el);
            callback(el);
        });
    };
    CollectionArray.prototype.getJSON = function () {
        return JSON.stringify(this.models, null, '\t');
    };
    CollectionArray.prototype.size = function () {
        return this.models.length;
    };
    CollectionArray.prototype.random = function () {
        return _.sample(this.models);
    };
    CollectionArray.prototype.remove = function (id, idField) {
        if (idField === void 0) { idField = 'id'; }
        var index = _.findIndex(this.models, function (el) {
            return el[idField] == id;
        });
        console.log(index, id, idField);
        if (index > -1) {
            delete this.models[index];
        }
    };
    return CollectionArray;
}(Array));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CollectionArray;
