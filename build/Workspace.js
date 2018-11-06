"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const AppView_1 = __importDefault(require("./Expenses/AppView"));
const Sync_1 = __importDefault(require("./Sync/Sync"));
const Expenses_1 = __importDefault(require("./Expenses/Expenses"));
const CatPage_1 = require("./Category/CatPage");
const KeywordsView_1 = require("./Keyword/KeywordsView");
const CategoryCollection_1 = __importDefault(require("./Category/CategoryCollection"));
const KeywordCollection_1 = __importDefault(require("./Keyword/KeywordCollection"));
const SummaryView_1 = __importDefault(require("./Summary/SummaryView"));
const HistoryView_1 = __importDefault(require("./History/HistoryView"));
const jquery_1 = __importDefault(require("jquery"));
const MonthSelect_1 = __importDefault(require("./MonthSelect/MonthSelect"));
const TransactionFactory_1 = require("./Expenses/TransactionFactory");
const backbone_localstorage_1 = require("backbone.localstorage");
const _ = __importStar(require("underscore"));
const Totals_1 = require("./Totals/Totals");
const Backbone = require("backbone");
const log = require('ololog');
class Workspace extends Backbone.Router {
    constructor(options) {
        super(options);
        this.routes = {
            '': 'AppView',
            ':year/:month': 'MonthSelect',
            ':year/:month/:category': 'MonthSelectCategory',
            'CatPage': 'CatPage',
            'Sync': 'Sync',
            'Keywords': 'Keywords',
            'Summary': 'Summary',
            'History': 'History',
            'Totals': '__not_a_function__',
        };
        this.optionalParam = /\((.*?)\)/g;
        this.namedParam = /(\(\?)?:\w+/g;
        this.splatParam = /\*\w+/g;
        this.escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        Workspace.instance = this;
        this._bindRoutes();
    }
    static getInstance() {
        return Workspace.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const expensesStorage = new backbone_localstorage_1.LocalStorage("Expenses");
            log(expensesStorage.findAll().length);
            this.model = new Expenses_1.default([], {}, expensesStorage, null);
            this.tf = new TransactionFactory_1.TransactionFactory(this.model);
            this.model.tf = this.tf;
            yield this.model.asyncFetch();
            const monthSelect = MonthSelect_1.default.getInstance();
            monthSelect.update(this.model);
            let ls = new backbone_localstorage_1.LocalStorage(CategoryCollection_1.default.LS_KEY);
            let catList = ls.findAll();
            this.categoryList = new CategoryCollection_1.default(catList);
            this.categoryList.setExpenses(this.model);
            this.keywords = new KeywordCollection_1.default();
            console.log('this.keywords', this.keywords.size());
            this.Totals = new Totals_1.Totals(this.model);
        });
    }
    activateMenu() {
        this.activateMenu2();
    }
    activateMenu2() {
        let url = '#' + window.location.hash;
        let element = jquery_1.default('ul.nav#side-menu a')
            .removeClass('active')
            .filter(function () {
            let href = jquery_1.default(this).attr('href');
            return href === url;
        })
            .addClass('active');
        let liElement = element
            .parent()
            .removeClass('in');
        if (liElement.length && liElement.is('li')) {
            element = liElement.parent().addClass('in').parent();
        }
        else {
        }
    }
    hideCurrentPage() {
        if (this.currentPage) {
            this.currentPage.hide();
        }
    }
    AppView() {
        console.warn('AppView');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.appPage) {
            this.appPage = new AppView_1.default({
                viewCollection: this.model
            }, this.categoryList, this.keywords, MonthSelect_1.default.getInstance());
        }
        this.appPage.show();
        this.currentPage = this.appPage;
    }
    Sync() {
        console.warn('Sync');
        this.activateMenu();
        this.hideCurrentPage();
        if (this.appPage) {
            this.appPage.hide();
        }
        else {
            jquery_1.default('#MonthSelect').hide();
        }
        if (!this.syncPage) {
            this.syncPage = new Sync_1.default(this.model, this, this.tf);
        }
        this.syncPage.show();
        this.currentPage = this.syncPage;
    }
    CatPage() {
        console.warn('CatPage');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.catPage) {
            this.catPage = new CatPage_1.CatPage(this.model, this.categoryList);
        }
        this.catPage.show();
        this.currentPage = this.catPage;
    }
    Keywords() {
        console.warn('Keywords');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.keywordsPage) {
            this.keywordsPage = new KeywordsView_1.KeywordsView(this.keywords, this.categoryList);
        }
        this.keywordsPage.show();
        this.currentPage = this.keywordsPage;
    }
    MonthSelect(year, month) {
        console.warn('MonthSelect', year, month);
        if (parseInt(year) && parseInt(month)) {
            this.AppView();
            this.appPage.ms.setYearMonth(year, month);
        }
    }
    MonthSelectCategory(year, month, category) {
        console.warn('MonthSelectCategory', year, month, category);
        if (parseInt(year) && parseInt(month)) {
            this.AppView();
            this.appPage.ms.setYearMonth(year, month);
            let cat = this.categoryList.findWhere({ catName: category });
            console.log('MonthSelectCategory cat', cat);
            this.appPage.table.model.setCategory(cat);
            this.appPage.collection.trigger('change');
        }
    }
    Summary() {
        console.warn('Summary');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.summaryPage) {
            this.summaryPage = new SummaryView_1.default({
                collection: this.categoryList,
            }, this.model);
        }
        jquery_1.default('#pieChart').hide();
        jquery_1.default('#categories').hide();
        this.summaryPage.show();
        this.currentPage = this.summaryPage;
    }
    History() {
        console.warn('History');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.historyPage) {
            this.historyPage = new HistoryView_1.default({
                collection: this.model
            });
        }
        jquery_1.default('#pieChart').hide();
        jquery_1.default('#categories').hide();
        this.historyPage.show();
        this.currentPage = this.historyPage;
    }
    route(route, name, callback) {
        if (!_.isRegExp(route))
            route = this._routeToRegExp2(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback)
            callback = this[name];
        Backbone.history.route(route, (fragment) => {
            log('route callback', fragment);
            this.fragment = fragment;
            var args = this._extractParameters2(route, fragment);
            if (this.execute(callback, args, name) !== false) {
                this.trigger.apply(this, ['route:' + name].concat(args));
                this.trigger('route', name, args);
                Backbone.history.trigger('route', this, name, args);
            }
        });
        return this;
    }
    _routeToRegExp2(route) {
        route = route.replace(this.escapeRegExp, '\\$&')
            .replace(this.optionalParam, '(?:$1)?')
            .replace(this.namedParam, function (match, optional) {
            return optional ? match : '([^/?]+)';
        })
            .replace(this.splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    }
    _extractParameters2(route, fragment) {
        const params = route.exec(fragment).slice(1);
        return _.map(params, function (param, i) {
            if (i === params.length - 1)
                return param || null;
            return param ? decodeURIComponent(param) : null;
        });
    }
    execute(callback, args, name) {
        log('execute', callback, args, name);
        console.log('fragment', this.fragment);
        if (callback) {
            return callback.apply(this, args);
        }
        else {
            this.ShowPage(this.fragment);
        }
        return false;
    }
    ShowPage(fragment) {
        if (!fragment) {
            return;
        }
        console.warn(fragment);
        this.activateMenu();
        this.hideCurrentPage();
        if (this[fragment]) {
            this[fragment].show();
            this.currentPage = this[fragment];
        }
        else {
            throw new Error('undefined Workspace page: ' + fragment);
        }
    }
}
exports.default = Workspace;
//# sourceMappingURL=Workspace.js.map