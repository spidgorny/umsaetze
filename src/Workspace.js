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
import AppView from './AppView';
import Sync from './Sync/Sync';
import Expenses from './Expenses/Expenses';
import { CatPage } from './CatPage';
import { KeywordsView } from './Keyword/KeywordsView';
import CategoryCollection from './Category/CategoryCollection';
import KeywordCollection from './Keyword/KeywordCollection';
import SummaryView from './Summary/SummaryView';
import HistoryView from './History/HistoryView';
import Backbone from 'backbone-es6/src/Backbone.js';
import $ from 'jquery';
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(options) {
        var _this = _super.call(this, options) || this;
        _this.routes = {
            '': 'AppView',
            ':year/:month': 'MonthSelect',
            ':year/:month/:category': 'MonthSelectCategory',
            'CatPage': 'CatPage',
            'Sync': 'Sync',
            'Keywords': 'Keywords',
            'Summary': 'Summary',
            'History': 'History'
        };
        _this.keywords = new KeywordCollection();
        _this._bindRoutes();
        _this.model = new Expenses();
        _this.model.fetch();
        _this.categoryList = new CategoryCollection();
        _this.categoryList.setExpenses(_this.model);
        return _this;
    }
    Workspace.prototype.activateMenu = function () {
        var url = window.location;
        var element = $('ul.nav#side-menu a')
            .removeClass('active')
            .filter(function () {
            return this.href == url;
        })
            .addClass('active')
            .parent()
            .removeClass('in');
        while (true) {
            if (element.is('li')) {
                element = element.parent().addClass('in').parent();
            }
            else {
                break;
            }
        }
    };
    Workspace.prototype.hideCurrentPage = function () {
        if (this.currentPage) {
            this.currentPage.hide();
        }
    };
    Workspace.prototype.AppView = function () {
        console.warn('AppView');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.appPage) {
            this.appPage = new AppView({
                collection: this.model
            }, this.categoryList);
            this.appPage.table.keywords = this.keywords;
        }
        this.appPage.show();
        this.currentPage = this.appPage;
    };
    Workspace.prototype.Sync = function () {
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
            this.syncPage = new Sync(this.model);
            this.syncPage.router = this;
        }
        this.syncPage.render();
        this.currentPage = this.syncPage;
    };
    Workspace.prototype.CatPage = function () {
        console.warn('CatPage');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.catPage) {
            this.catPage = new CatPage(this.model, this.categoryList);
        }
        this.catPage.render();
        this.currentPage = this.catPage;
    };
    Workspace.prototype.Keywords = function () {
        console.warn('Keywords');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.keywordsPage) {
            this.keywordsPage = new KeywordsView();
            this.keywordsPage.keywords = this.keywords;
        }
        this.keywordsPage.render();
        this.currentPage = this.keywordsPage;
    };
    Workspace.prototype.MonthSelect = function (year, month) {
        console.warn('MonthSelect', year, month);
        if (parseInt(year) && parseInt(month)) {
            this.AppView();
            this.appPage.ms.setYearMonth(year, month);
        }
    };
    Workspace.prototype.MonthSelectCategory = function (year, month, category) {
        console.warn('MonthSelectCategory', year, month, category);
        if (parseInt(year) && parseInt(month)) {
            this.AppView();
            this.appPage.ms.setYearMonth(year, month);
            var cat = this.categoryList.findWhere({ catName: category });
            console.log('MonthSelectCategory cat', cat);
            this.appPage.collection.filterByCategory(cat);
            this.appPage.collection.trigger('change');
        }
    };
    Workspace.prototype.Summary = function () {
        console.log('Summary');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.summaryPage) {
            this.summaryPage = new SummaryView({
                collection: this.categoryList
            }, this.model);
        }
        $('#pieChart').hide();
        $('#categories').hide();
        this.summaryPage.render();
        this.currentPage = this.summaryPage;
    };
    Workspace.prototype.History = function () {
        console.log('History');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.historyPage) {
            this.historyPage = new HistoryView({
                collection: this.model
            });
        }
        $('#pieChart').hide();
        $('#categories').hide();
        this.historyPage.render();
        this.currentPage = this.historyPage;
    };
    return Workspace;
}(Backbone.Router));
export default Workspace;
//# sourceMappingURL=Workspace.js.map