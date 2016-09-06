///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        _super.call(this, options);
        this.template = _.template($('#categoryTemplate').html());
        this.setElement($('#categories'));
    }
    CategoryView.prototype.render = function () {
        var _this = this;
        var content = [];
        var categoryCount = this.model.getCategoryCount();
        var sum = _.reduce(categoryCount, function (memo, item) {
            // only expenses
            if (item.catName != 'Default' && item.amount < 0) {
                return memo + item.amount;
            }
            else {
                return memo;
            }
        }, 0);
        console.log('sum', sum);
        categoryCount = _.sortBy(categoryCount, function (el) {
            return -el.amount;
        }).reverse();
        _.each(categoryCount, function (catCount) {
            if (catCount.catName != 'Default' && catCount.amount < 0) {
                var width = Math.round(100 * (-catCount.amount) / -sum) + '%';
                console.log(catCount.catName, width, catCount.count, catCount.amount);
                content.push(_this.template(_.extend(catCount, {
                    width: width,
                    amount: Math.round(catCount.amount)
                })));
            }
        });
        this.$el.html(content.join('\n'));
        return this;
    };
    CategoryView.prototype.change = function () {
        console.log('model changed', this.model.size());
        this.model.change();
        this.render();
    };
    return CategoryView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CategoryView;
//# sourceMappingURL=CategoryView.js.map