///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        _super.call(this, options);
        this.template = _.template($('#categoryTemplate').html());
        this.setElement($('#categories'));
        this.listenTo(this.model, 'change', this.render);
    }
    CategoryView.prototype.render = function () {
        var _this = this;
        elapse.time('CategoryView.render');
        var content = [];
        var categoryCount = this.model.toJSON();
        var sum = _.reduce(categoryCount, function (memo, item) {
            // only expenses
            return memo + item.amount;
        }, 0);
        //console.log('sum', sum);
        categoryCount = _.sortBy(categoryCount, function (el) {
            return Math.abs(el.amount);
        }).reverse();
        _.each(categoryCount, function (catCount) {
            var width = Math.round(100 * Math.abs(catCount.amount) / Math.abs(sum)) + '%';
            //console.log(catCount.catName, width, catCount.count, catCount.amount);
            content.push(_this.template(_.extend(catCount, {
                width: width,
                amount: Math.round(catCount.amount),
                sign: catCount.amount >= 0 ? 'positive' : 'negative'
            })));
        });
        this.$el.html(content.join('\n'));
        elapse.timeEnd('CategoryView.render');
        return this;
    };
    /**
     * @deprecated
     * @private
     */
    CategoryView.prototype._change = function () {
        console.log('CategoryView changed', this.model.size());
        if (this.model) {
            //console.log('Calling CategoryCollection.change()');
            //this.model.change();	// called automagically
            this.render();
        }
        else {
            console.error('Not rendering since this.model is undefined');
        }
    };
    return CategoryView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CategoryView;
//# sourceMappingURL=CategoryView.js.map