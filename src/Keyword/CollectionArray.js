var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import simpleStorage from 'simpleStorage.js';
import _ from 'underscore';
var CollectionArray = (function (_super) {
    __extends(CollectionArray, _super);
    function CollectionArray() {
        var arguments2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arguments2[_i] = arguments[_i];
        }
        var _this = this;
        _this.models = [];
        _this.name = _this.constructor.prototype.name;
        return _this;
    }
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
    };
    CollectionArray.prototype.each = function (callback) {
        this.models.forEach(function (el) {
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
export default CollectionArray;
//# sourceMappingURL=CollectionArray.js.map