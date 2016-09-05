///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryCount = (function () {
    function CategoryCount() {
    }
    return CategoryCount;
}());
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        _super.call(this, options);
        this.categoryCount = [];
        this.template = _.template($('#categoryTemplate').html());
        this.setElement($('#categories'));
        this.categoryCount = [];
    }
    CategoryView.prototype.render = function () {
        var _this = this;
        var content = [];
        var sum = _.reduce(this.categoryCount, function (memo, item) {
            // only expenses
            if (item.catName != 'Default' && item.amount < 0) {
                return memo + item.amount;
            }
            else {
                return memo;
            }
        }, 0);
        console.log('sum', sum);
        this.categoryCount = _.sortBy(this.categoryCount, function (el) {
            return -el.amount;
        }).reverse();
        _.each(this.categoryCount, function (catCount) {
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
        var _this = this;
        console.log('model changed', this.model.size());
        this.model.each(function (transaction) {
            var categoryName = transaction.get('category');
            var exists = _.findWhere(_this.categoryCount, { catName: categoryName });
            if (exists) {
                exists.count++;
                exists.amount += parseFloat(transaction.get('amount'));
            }
            else {
                _this.categoryCount.push({
                    catName: categoryName,
                    count: 0,
                    amount: 0
                });
            }
        });
        console.log(this.categoryCount);
        this.render();
    };
    return CategoryView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CategoryView;
//# sourceMappingURL=CategoryView.js.map