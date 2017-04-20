"use strict";
var MockStorage = (function () {
    function MockStorage() {
        this.length = 0;
    }
    MockStorage.prototype.getItem = function ($name) {
        return this[name];
    };
    MockStorage.prototype.setItem = function (name, value) {
        this[name] = value;
        this.length++;
    };
    return MockStorage;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockStorage;
