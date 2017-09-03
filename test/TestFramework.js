"use strict";
exports.__esModule = true;
var TestFramework = /** @class */ (function () {
    function TestFramework() {
    }
    TestFramework.prototype.run = function () {
        // const testFunctions = Object.getOwnPropertyNames(this).filter(function (p: string) {
        var testFunctions = [];
        for (var p in this) {
            // console.log(p);
            if (typeof this[p] === 'function' && p.indexOf('test') == 0) {
                testFunctions.push(p);
            }
        }
        // console.log(testFunctions);
        for (var _i = 0, testFunctions_1 = testFunctions; _i < testFunctions_1.length; _i++) {
            var method = testFunctions_1[_i];
            console.log('=== ', method, ' ===');
            this[method].call(this);
        }
    };
    TestFramework.prototype.assertEquals = function (must, is, message) {
        if (must != is) {
            console.error(message, must, is);
        }
    };
    return TestFramework;
}());
exports["default"] = TestFramework;
//# sourceMappingURL=TestFramework.js.map