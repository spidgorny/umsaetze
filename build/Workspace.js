"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppView_1 = require("./Expenses/AppView");
const Sync_1 = require("./Sync/Sync");
const Expenses_1 = require("./Expenses/Expenses");
const CatPage_1 = require("./Category/CatPage");
const KeywordsView_1 = require("./Keyword/KeywordsView");
const CategoryCollection_1 = require("./Category/CategoryCollection");
const KeywordCollection_1 = require("./Keyword/KeywordCollection");
const SummaryView_1 = require("./Summary/SummaryView");
const HistoryView_1 = require("./History/HistoryView");
const Backbone = require("backbone");
const $ = require("jquery");
const CategoryCollectionModel_1 = require("./Category/CategoryCollectionModel");
const MonthSelect_1 = require("./MonthSelect/MonthSelect");
const TransactionFactory_1 = require("./Expenses/TransactionFactory");
const backbone_localstorage_1 = require("backbone.localstorage");
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
            'History': 'History'
        };
        Workspace.instance = this;
        this._bindRoutes();
        const expensesStorage = new backbone_localstorage_1.LocalStorage("Expenses");
        log(expensesStorage.findAll().length);
        this.model = new Expenses_1.default([], {}, expensesStorage, null);
        this.tf = new TransactionFactory_1.TransactionFactory(this.model);
        this.model.tf = this.tf;
        this.model.fetch();
        const monthSelect = MonthSelect_1.default.getInstance();
        monthSelect.update(this.model);
        this.categoryList = new CategoryCollection_1.default();
        this.categoryList.setExpenses(this.model);
        this.keywords = new KeywordCollection_1.default();
        console.log('this.keywords', this.keywords.size());
    }
    static getInstance() {
        return Workspace.instance;
    }
    activateMenu() {
        this.activateMenu2();
    }
    activateMenu2() {
        let url = '#' + window.location.hash;
        let element = $('ul.nav#side-menu a')
            .removeClass('active')
            .filter(function () {
            let href = $(this).attr('href');
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
            $('#MonthSelect').hide();
        }
        if (!this.syncPage) {
            this.syncPage = new Sync_1.default(this.model, this, this.tf);
        }
        this.syncPage.render();
        this.currentPage = this.syncPage;
    }
    CatPage() {
        console.warn('CatPage');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.catPage) {
            this.catPage = new CatPage_1.CatPage(this.model, this.categoryList);
        }
        this.catPage.render();
        this.currentPage = this.catPage;
    }
    Keywords() {
        console.warn('Keywords');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.keywordsPage) {
            this.keywordsPage = new KeywordsView_1.KeywordsView(this.keywords, this.categoryList);
        }
        this.keywordsPage.render();
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
            this.appPage.collection.filterByCategory(cat);
            this.appPage.collection.trigger('change');
        }
    }
    Summary() {
        console.warn('Summary');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.summaryPage) {
            const categoryModel = new CategoryCollectionModel_1.default(this.categoryList);
            this.summaryPage = new SummaryView_1.default({
                collection: this.categoryList,
            }, this.model);
        }
        $('#pieChart').hide();
        $('#categories').hide();
        this.summaryPage.render();
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
        $('#pieChart').hide();
        $('#categories').hide();
        this.historyPage.render();
        this.currentPage = this.historyPage;
    }
}
exports.default = Workspace;
//# sourceMappingURL=Workspace.js.map