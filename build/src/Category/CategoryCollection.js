"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCount_1 = require("./CategoryCount");
const _ = require("underscore");
const Backbone = require('backbone');
const backbone_localstorage_1 = require("backbone.localstorage");
const backbone_1 = require("backbone");
class CategoryCollection extends backbone_1.Collection {
    constructor(options) {
        super();
        let ls = new backbone_localstorage_1.default('Categories');
        let models = ls.findAll();
        models = _.uniq(models, false, (e1) => {
            return e1.catName;
        });
        _.each(models, m => {
            this.add(new CategoryCount_1.default(m));
        });
        this.models = _.uniq(this.models, (el) => {
            return el.getName();
        });
        if (!this.size()) {
        }
        this.listenTo(this, 'change', this.saveToLS);
    }
    get length() {
        return this.models.length;
    }
    initialize() {
    }
    fetch() {
        return {};
    }
    setExpenses(ex) {
        this.expenses = ex;
        this.getCategoriesFromExpenses();
    }
    saveToLS() {
        let ls = new backbone_localstorage_1.default('Categories');
        let deleteMe = ls.findAll();
        this.each((model) => {
            if (model.get('id')) {
                ls.update(model);
                let findIndex = _.findIndex(deleteMe, { id: model.get('id') });
                if (findIndex > -1) {
                    deleteMe.splice(findIndex, 1);
                }
            }
            else {
                ls.create(model);
            }
        });
        if (deleteMe.length) {
            _.each(deleteMe, (el) => {
                ls.destroy(el);
            });
        }
    }
    resetCounters() {
        this.each((row) => {
            row.set('amount', 0, { silent: true });
            row.set('count', 0, { silent: true });
        });
    }
    getCategoriesFromExpenses() {
        console.profile('getCategoriesFromExpenses');
        this.resetCounters();
        let visible = this.expenses.getVisible();
        _.each(visible, (transaction) => {
            let categoryName = transaction.get('category');
            if (categoryName) {
                this.incrementCategoryData(categoryName, transaction);
            }
        });
        this.sortBy('amount');
        console.profileEnd();
        this.trigger('change');
    }
    incrementCategoryData(categoryName, transaction) {
        let exists = this.findWhere({ catName: categoryName });
        if (exists) {
            exists.set('count', exists.get('count') + 1, { silent: true });
            let amountBefore = exists.get('amount');
            let amountAfter = transaction.get('amount');
            if (categoryName == 'Income') {
            }
            exists.set('amount', amountBefore + amountAfter, { silent: true });
        }
        else {
            this.add(new CategoryCount_1.default({
                catName: categoryName,
                count: 1,
                amount: transaction.get('amount'),
            }), { silent: true });
        }
    }
    getCategoriesFromExpenses2() {
        let options = [];
        let categories = this.expenses.groupBy('category');
        _.each(categories, (value, index) => {
            options.push(index);
        });
        return options;
    }
    getOptions() {
        let options = this.pluck('catName');
        options = _.unique(options);
        options = _.sortBy(options);
        return options;
    }
    getColorFor(value) {
        let color;
        let category = this.findWhere({ catName: value });
        if (category) {
            color = category.get('color');
        }
        else {
            color = '#AAAAAA';
        }
        return color;
    }
    exists(newName) {
        return !!this.findWhere({
            catName: newName,
        });
    }
    random() {
        return _.sample(this.models);
    }
}
exports.default = CategoryCollection;
//# sourceMappingURL=CategoryCollection.js.map