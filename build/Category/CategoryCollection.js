"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCount_1 = __importDefault(require("./CategoryCount"));
const _ = __importStar(require("underscore"));
const backbone_localstorage_1 = require("backbone.localstorage");
const backbone_1 = require("backbone");
const log = require('ololog');
class CategoryCollection extends backbone_1.Collection {
    constructor(models) {
        super();
        if (models.length) {
            models = _.uniq(models, false, (e1) => {
                return e1.catName;
            });
            _.each(models, m => {
                this.add(new CategoryCount_1.default(m));
            });
            this.models = _.uniq(this.models, (el) => {
                return el.getName();
            });
        }
        if (!this.size()) {
        }
        this.listenTo(this, 'change', this.saveToLS.bind(this));
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
        let ls = new backbone_localstorage_1.LocalStorage(CategoryCollection.LS_KEY);
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
        console.time('CategoryCollection.getCategoriesFromExpenses');
        this.resetCounters();
        let visible = this.expenses.getVisible();
        _.each(visible, (transaction) => {
            let categoryName = transaction.get('category');
            if (categoryName) {
                if (_.isObject(categoryName)) {
                    categoryName = categoryName.name;
                }
                this.incrementCategoryData(categoryName, transaction);
            }
        });
        this.sortBy('amount');
        console.warn('trigger CategoryCollection change', this._events);
        this.trigger('change');
        console.timeEnd('CategoryCollection.getCategoriesFromExpenses');
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
    addCategory(newName) {
        if (!this.exists(newName)) {
            this.add(new CategoryCount_1.default({
                catName: newName
            }));
        }
    }
}
CategoryCollection.LS_KEY = 'Categories';
exports.default = CategoryCollection;
//# sourceMappingURL=CategoryCollection.js.map