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
import ExpenseTable from './Expenses/ExpenseTable';
import CategoryView from './Category/CategoryView';
import MonthSelect from './MonthSelect';
import { debug } from './main';
import { CollectionController } from './CollectionController';
import * as $ from "jquery";
import * as _ from 'underscore';
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView(options, categoryList) {
        var _this = _super.call(this, options) || this;
        _this.q = '';
        console.log('construct AppView');
        _this.collection = options.collection;
        _this.setElement($('#app'));
        _this.setTemplate();
        _this.categoryList = categoryList;
        _this.table = new ExpenseTable({
            model: _this.collection,
            el: $('#expenseTable')
        });
        _this.table.setCategoryList(_this.categoryList);
        _this.categories = new CategoryView({
            model: _this.categoryList
        });
        _this.categories.setExpenses(_this.collection);
        _this.ms = MonthSelect.getInstance();
        _this.ms.earliest = _this.collection.getEarliest();
        _this.ms.latest = _this.collection.getLatest();
        _this.ms.render();
        _this.listenTo(_this.ms, 'MonthSelect:change', _this.monthChange.bind(_this));
        _this.collection.selectedMonth = _this.ms.getSelected();
        _this.listenTo(_this.collection, 'change', _this.render);
        $('.custom-search-form input').on('keyup', _.debounce(_this.onSearch.bind(_this), 300));
        _this.on('all', function () {
            debug('AppView');
        });
        return _this;
    }
    AppView.prototype.render = function () {
        console.log('AppView.render()', this.collection.size());
        this.setTemplate();
        this.table.render();
        this.categories.render();
        this.$('#applyKeywords').on('click', this.applyKeywords.bind(this));
        return this;
    };
    AppView.prototype.setTemplate = function () {
        if (!this.$('#expenseTable').length) {
            var template = _.template($('#AppView').html());
            this.$el.html(template());
            if (this.table) {
                this.table.$el = $('#expenseTable');
            }
        }
    };
    AppView.prototype.monthChange = function () {
        console.profile('AppView.monthChange');
        this.collection.setAllVisible();
        this.collection.filterByMonth(this.ms.getSelected());
        this.collection.filterVisible(this.q);
        this.categoryList.getCategoriesFromExpenses();
        console.profileEnd('AppView.monthChange');
    };
    AppView.prototype.onSearch = function (event) {
        this.q = $(event.target).val();
        console.log('Searching: ', this.q);
        this.monthChange();
    };
    AppView.prototype.show = function () {
        console.profile('AppView.show');
        this.ms.earliest = this.collection.getEarliest();
        this.ms.latest = this.collection.getLatest();
        console.log('MonthSelect range', this.ms.earliest.toString('yyyy-MM-dd'), this.ms.latest.toString('yyyy-MM-dd'), this.collection.size());
        this.ms.show();
        this.render();
        this.categories.show();
        console.profileEnd('AppView.show');
    };
    AppView.prototype.hide = function () {
        console.profile('AppView.hide');
        if (this.$('#expenseTable').length
            && this.$('#expenseTable').is(':visible')) {
        }
        this.categories.hide();
        console.profileEnd('AppView.hide');
    };
    AppView.prototype.applyKeywords = function (event) {
        event.preventDefault();
        console.log('applyKeywords');
        this.table.model.setCategories(this.table.keywords);
    };
    return AppView;
}(CollectionController));
export default AppView;
//# sourceMappingURL=AppView.js.map