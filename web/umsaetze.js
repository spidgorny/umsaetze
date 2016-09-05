/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Transaction = (function (_super) {
    __extends(Transaction, _super);
    function Transaction() {
        _super.apply(this, arguments);
    }
    return Transaction;
}(Backbone.Model));
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses() {
        _super.apply(this, arguments);
        this.attributes = null;
        this.model = Transaction;
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.import.csv';
    }
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        console.log('csvUrl', this.csvUrl);
        return $.get(this.csvUrl, function (response, xhr) {
            var csv = Papa.parse(response, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });
            //console.log(csv);
            _.map(csv.data, function (row) {
                //console.log(row);
                _this.add(new Transaction(row));
            });
            if (options.success) {
                options.success.call();
            }
            _this.trigger('change');
        });
    };
    return Expenses;
}(Backbone.Collection));
var ExpenseTable = (function (_super) {
    __extends(ExpenseTable, _super);
    function ExpenseTable(options) {
        _super.call(this, options);
        /**
         * Too early, wait until initialize()
         * @type {JQuery}
         */
        //el = $('#expenseTable');
        this.template = _.template($('#rowTemplate').html());
        this.setElement($('#expenseTable'));
        this.listenTo(this.model, 'change', this.render);
    }
    ExpenseTable.prototype.render = function () {
        var _this = this;
        console.log('ExpenseTable.render()', this.model.size());
        console.log(this.model);
        var rows = [];
        this.model.each(function (transaction) {
            //console.log(transaction);
            var attributes = transaction.toJSON();
            if (attributes.hasOwnProperty('date')) {
                rows.push(_this.template(attributes));
            }
            else {
                console.log('no date', attributes);
            }
        });
        console.log('rendering', rows.length, 'rows');
        this.$el.append(rows.join('\n'));
        //console.log(this.$el);
        return this;
    };
    return ExpenseTable;
}(Backbone.View));
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView() {
        var _this = this;
        this.table = null;
        console.log('construct AppView');
        this.setElement($('#app'));
        this.model = new Expenses();
        this.table = new ExpenseTable({
            model: this.model,
            el: $('#expenseTable')
        });
        this.startLoading();
        this.model.fetch({
            success: function () {
                _this.stopLoading();
            }
        });
        this.listenTo(this.model, "change", this.render);
    }
    AppView.prototype.startLoading = function () {
        console.log('startLoading');
        var template = _.template($('#loadingBar').html());
        this.$el.html(template());
    };
    AppView.prototype.stopLoading = function () {
        console.log('stopLoading');
        this.$el.html('Done');
    };
    AppView.prototype.render = function () {
        console.log('AppView.render()', this.model);
        if (this.model && this.model.size()) {
            this.table.render();
            this.$el.html('Table shown');
        }
        else {
            this.startLoading();
        }
    };
    return AppView;
}(Backbone.View));
$(function () {
    var app = new AppView();
    app.render();
});
//# sourceMappingURL=umsaetze.js.map