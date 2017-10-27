"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
// import Events from 'typhonjs-core-backbone-events/src/Events.js';
var Backbone = require("backbone");
var CollectionController = /** @class */ (function (_super) {
    __extends(CollectionController, _super);
    function CollectionController(options) {
        var _this = _super.call(this) || this;
        _this.cid = Math.random().toString();
        return _this;
    }
    CollectionController.prototype.setElement = function (el) {
        this.$el = el;
    };
    CollectionController.prototype.hide = function () {
        this.$el.hide();
    };
    CollectionController.prototype.$ = function (selector) {
        return $(selector);
    };
    return CollectionController;
}(Backbone.Events));
exports.CollectionController = CollectionController;
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
// applyMixins(CollectionController, [Events]);
