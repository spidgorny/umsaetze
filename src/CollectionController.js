/// <reference path="../node_modules/@types/backbone/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// import Events from 'typhonjs-core-backbone-events/src/Events.js';
// import Backbone = require('backbone');
var Backbone = require('backbone');
var CollectionController = (function (_super) {
    __extends(CollectionController, _super);
    function CollectionController() {
        _super.apply(this, arguments);
    }
    /**
     * It has no constructor
     * @param options
     */
    CollectionController.prototype.init = function (options) {
        this.cid = Math.random().toString();
    };
    CollectionController.prototype.setElement = function (el) {
        this.$el = el;
    };
    CollectionController.prototype.hide = function () {
        this.$el.hide();
    };
    CollectionController.$ = function (selector) {
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
