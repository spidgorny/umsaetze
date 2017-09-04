"use strict";
exports.__esModule = true;
var FakeJQueryXHR = /** @class */ (function () {
    function FakeJQueryXHR() {
    }
    FakeJQueryXHR.prototype.state = function () {
        return undefined;
    };
    FakeJQueryXHR.prototype.statusCode = function (map) {
    };
    FakeJQueryXHR.prototype.always = function (alwaysCallback) {
        var alwaysCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            alwaysCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.done = function (doneCallback) {
        var doneCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            doneCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.fail = function (failCallback) {
        var failCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            failCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.progress = function (progressCallback) {
        var progressCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            progressCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.promise = function (target) {
    };
    FakeJQueryXHR.prototype.pipe = function (doneFilter, failFilter, progressFilter) {
    };
    FakeJQueryXHR.prototype.then = function (doneFilter, failFilter, progressFilter) {
    };
    FakeJQueryXHR.prototype["catch"] = function (failFilter) {
    };
    FakeJQueryXHR.prototype.overrideMimeType = function (mimeType) {
        return undefined;
    };
    FakeJQueryXHR.prototype.abort = function (statusText) {
    };
    FakeJQueryXHR.prototype.error = function (xhr, textStatus, errorThrown) {
    };
    FakeJQueryXHR.prototype.getAllResponseHeaders = function () {
        return undefined;
    };
    FakeJQueryXHR.prototype.getResponseHeader = function (header) {
        return undefined;
    };
    FakeJQueryXHR.prototype.msCachingEnabled = function () {
        return undefined;
    };
    FakeJQueryXHR.prototype.open = function (method, url, async, user, password) {
    };
    FakeJQueryXHR.prototype.send = function (data) {
    };
    FakeJQueryXHR.prototype.setRequestHeader = function (header, value) {
    };
    FakeJQueryXHR.prototype.addEventListener = function (type, listener, useCapture) {
    };
    FakeJQueryXHR.prototype.dispatchEvent = function (evt) {
        return undefined;
    };
    FakeJQueryXHR.prototype.removeEventListener = function (type, listener, options) {
    };
    return FakeJQueryXHR;
}());
exports["default"] = FakeJQueryXHR;
