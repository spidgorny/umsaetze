"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Category = /** @class */ (function () {
    function Category(props) {
        this.count = 0;
        this.amount = 0;
        this.color = Category.pastelColor();
        this.name = props.name;
        this.count = props.count || 0;
        this.amount = props.amount || 0;
        this.color = props.color || Category.pastelColor();
    }
    Category.pastelColor = function () {
        var r = (Math.round(Math.random() * 55) + 200).toString(16);
        var g = (Math.round(Math.random() * 55) + 200).toString(16);
        var b = (Math.round(Math.random() * 55) + 200).toString(16);
        return '#' + r + g + b;
    };
    return Category;
}());
exports.Category = Category;
//# sourceMappingURL=category.js.map