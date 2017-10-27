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
import CategoryCount from "./CategoryCount";
import Backbone from 'backbone-es6/src/Backbone.js';
import _ from 'underscore';
var CategoryCollection = (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        var _this = _super.call(this, options) || this;
        var ls = new Backbone.LocalStorage('Categories');
        var models = ls.findAll();
        models = _.uniq(models, false, function (e1) {
            return e1.catName;
        });
        _.each(models, function (m) {
            _this.add(new CategoryCount(m));
        });
        _this.models = _.uniq(_this.models, function (el) {
            return el.getName();
        });
        if (!_this.size()) {
        }
        _this.listenTo(_this, 'change', _this.saveToLS);
        return _this;
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.getCategoriesFromExpenses();
    };
    CategoryCollection.prototype.saveToLS = function () {
        var ls = new Backbone.LocalStorage('Categories');
        var deleteMe = ls.findAll();
        this.each(function (model) {
            if (model.get('id')) {
                ls.update(model);
                var findIndex = _.findIndex(deleteMe, { id: model.get('id') });
                if (findIndex > -1) {
                    deleteMe.splice(findIndex, 1);
                }
            }
            else {
                ls.create(model);
            }
        });
        if (deleteMe.length) {
            _.each(deleteMe, function (el) {
                ls.destroy(el);
            });
        }
    };
    CategoryCollection.prototype.resetCounters = function () {
        this.each(function (row) {
            row.set('amount', 0, { silent: true });
            row.set('count', 0, { silent: true });
        });
    };
    CategoryCollection.prototype.getCategoriesFromExpenses = function () {
        var _this = this;
        console.profile('getCategoriesFromExpenses');
        this.resetCounters();
        var visible = this.expenses.getVisible();
        _.each(visible, function (transaction) {
            var categoryName = transaction.get('category');
            if (categoryName) {
                _this.incrementCategoryData(categoryName, transaction);
            }
        });
        this.sortBy('amount');
        console.profileEnd('getCategoriesFromExpenses');
        this.trigger('change');
    };
    CategoryCollection.prototype.incrementCategoryData = function (categoryName, transaction) {
        var exists = this.findWhere({ catName: categoryName });
        if (exists) {
            exists.set('count', exists.get('count') + 1, { silent: true });
            var amountBefore = exists.get('amount');
            var amountAfter = transaction.get('amount');
            if (categoryName == 'Income') {
            }
            exists.set('amount', amountBefore + amountAfter, { silent: true });
        }
        else {
            this.add(new CategoryCount({
                catName: categoryName,
                count: 1,
                amount: transaction.get('amount'),
            }), { silent: true });
        }
    };
    CategoryCollection.prototype.getCategoriesFromExpenses2 = function () {
        var options = [];
        var categories = this.expenses.groupBy('category');
        _.each(categories, function (value, index) {
            options.push(index);
        });
        return options;
    };
    CategoryCollection.prototype.getOptions = function () {
        var options = this.pluck('catName');
        options = _.unique(options);
        options = _.sortBy(options);
        return options;
    };
    CategoryCollection.prototype.getColorFor = function (value) {
        var color;
        var category = this.findWhere({ catName: value });
        if (category) {
            color = category.get('color');
        }
        else {
            color = '#AAAAAA';
        }
        return color;
    };
    CategoryCollection.prototype.exists = function (newName) {
        return !!this.findWhere({
            catName: newName,
        });
    };
    CategoryCollection.prototype.random = function () {
        return _.sample(this.models);
    };
    return CategoryCollection;
}(Backbone.Collection));
export default CategoryCollection;
//# sourceMappingURL=CategoryCollection.js.map