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
function asyncLoop(arr, callback, done) {
    (function loop(i) {
        callback(arr[i], i, arr.length); //callback when the loop goes on
        if (i < arr.length) {
            setTimeout(function () { loop(++i); }, 1); //rerun when condition is true
        }
        else {
            if (done) {
                done(arr.length); //callback when the loop ends
            }
        }
    }(0)); //start with 0
}
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses() {
        _super.apply(this, arguments);
        this.attributes = null;
        this.model = Transaction;
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';
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
            _.each(csv.data, _this.processRow.bind(_this));
            _this.processDone(csv.data.length, options);
            // asyncLoop(csv.data, this.processRow.bind(this),	this.processDone.bind(this));
        });
    };
    Expenses.prototype.processRow = function (row, i, length) {
        var percent = Math.round(100 * i / length);
        //console.log(row);
        $('.progress .progress-bar').width(percent + '%');
        this.add(new Transaction(row));
        //this.trigger('change');
    };
    Expenses.prototype.processDone = function (count, options) {
        console.log('asyncLoop finished', count);
        if (options.success) {
            options.success.call();
        }
        this.trigger('change');
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
var CategoryCount = (function () {
    function CategoryCount() {
    }
    return CategoryCount;
}());
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        _super.call(this, options);
        this.categoryCount = [];
        this.template = _.template($('#categoryTemplate').html());
        this.setElement($('#categories'));
        this.categoryCount = [];
    }
    CategoryView.prototype.render = function () {
        var _this = this;
        var content = [];
        var sum = _.reduce(this.categoryCount, function (memo, item) {
            // only expenses
            if (item.catName != 'Default' && item.amount < 0) {
                return memo + item.amount;
            }
            else {
                return memo;
            }
        }, 0);
        console.log('sum', sum);
        this.categoryCount = _.sortBy(this.categoryCount, function (el) {
            return -el.amount;
        }).reverse();
        _.each(this.categoryCount, function (catCount) {
            if (catCount.catName != 'Default' && catCount.amount < 0) {
                var width = Math.round(100 * (-catCount.amount) / -sum) + '%';
                console.log(catCount.catName, width, catCount.count, catCount.amount);
                content.push(_this.template(_.extend(catCount, {
                    width: width,
                    amount: Math.round(catCount.amount)
                })));
            }
        });
        this.$el.html(content.join('\n'));
        return this;
    };
    CategoryView.prototype.change = function () {
        var _this = this;
        console.log('model changed', this.model.size());
        this.model.each(function (transaction) {
            var categoryName = transaction.get('category');
            var exists = _.findWhere(_this.categoryCount, { catName: categoryName });
            if (exists) {
                exists.count++;
                exists.amount += parseFloat(transaction.get('amount'));
            }
            else {
                _this.categoryCount.push({
                    catName: categoryName,
                    count: 0,
                    amount: 0
                });
            }
        });
        console.log(this.categoryCount);
        this.render();
    };
    return CategoryView;
}(Backbone.View));
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView(options) {
        var _this = this;
        _super.call(this, options);
        console.log('construct AppView');
        this.setElement($('#app'));
        this.model = new Expenses();
        this.table = new ExpenseTable({
            model: this.model,
            el: $('#expenseTable')
        });
        this.categories = new CategoryView({
            model: this.model
        });
        this.startLoading();
        this.model.fetch({
            success: function () {
                _this.stopLoading();
            }
        });
        this.listenTo(this.model, "change", this.render.bind(this));
        this.listenTo(this.model, "change", this.categories.change.bind(this.categories));
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