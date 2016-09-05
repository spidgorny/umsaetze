"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        $('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        $('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        this.$el.on('click', 'select', this.openSelect.bind(this));
        return this;
    };
    ExpenseTable.prototype.openSelect = function (event) {
        console.log('openSelect', this, event);
        var $select = $(event.target);
        if ($select.find('option').length == 1) {
            this.
            ;
        }
    };
    return ExpenseTable;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = ExpenseTable;
//# sourceMappingURL=ExpenseTable.js.map