"use strict";
exports.__esModule = true;
var MockStorage = /** @class */ (function () {
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
    MockStorage.prototype._clear = function () {
        for (var i in Object.getOwnPropertyNames(this)) {
            delete this[i];
        }
        this.length = 0;
    };
    MockStorage.prototype.update = function (object) {
    };
    return MockStorage;
}());
exports["default"] = MockStorage;
//# sourceMappingURL=MockStorage.js.map