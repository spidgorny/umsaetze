"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppView_1 = require("./AppView");
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
        this.keywords = new KeywordCollection_1.default();
        this._bindRoutes();
        this.model = new Expenses_1.default();
        this.model.fetch();
        this.categoryList = new CategoryCollection_1.default();
        this.categoryList.setExpenses(this.model);
    }
    activateMenu() {
        this.activateMenu2();
    }
    activateMenu2() {
        let url = window.location.href;
        let element = $('ul.nav#side-menu a')
            .removeClass('active')
            .filter(function () {
            return $(this).attr('href') == url;
        })
            .addClass('active');
        let liElement = element
            .parent()
            .removeClass('in');
        while (true) {
            console.log(liElement, element);
            if (liElement.length && liElement.is('li')) {
                element = liElement.parent().addClass('in').parent();
            }
            else {
                break;
            }
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
            }, this.categoryList);
            this.appPage.table.keywords = this.keywords;
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
            this.syncPage = new Sync_1.default(this.model);
            this.syncPage.router = this;
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
            this.keywordsPage = new KeywordsView_1.KeywordsView();
            this.keywordsPage.keywords = this.keywords;
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
        console.log('Summary');
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
        console.log('History');
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