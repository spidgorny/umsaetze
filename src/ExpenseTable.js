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
        this.template = _.template($('#rowTemplate').html());
        this.setElement($('#expenseTable'));
        // slow re-rendering of the whole table when model changes
        //this.listenTo(this.model, 'change', this.render);
    }
    ExpenseTable.prototype.setCategoryList = function (list) {
        this.categoryList = list;
    };
    ExpenseTable.prototype.render = function (options) {
        var _this = this;
        if (options && options.noRender) {
            console.log('ExpenseTable.noRender');
            return;
        }
        console.log('ExpenseTable.render()', this.model.size());
        console.log(this.model);
        var rows = [];
        this.model.each(function (transaction) {
            //console.log(transaction);
            var attributes = transaction.toJSON();
            if (attributes.visible) {
                attributes.sDate = attributes.date.toString('yyyy-MM-dd');
                rows.push(_this.template(attributes));
            }
        });
        console.log('rendering', rows.length, 'rows');
        this.$el.html(rows.join('\n'));
        //console.log(this.$el);
        $('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        $('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        this.$el.on('click', 'select', this.openSelect.bind(this));
        return this;
    };
    ExpenseTable.prototype.openSelect = function (event) {
        //console.log('openSelect', this, event);
        var $select = $(event.target);
        if ($select.find('option').length == 1) {
            var defVal_1 = $select.find('option').html();
            var options = this.categoryList.getOptions();
            //console.log(options);
            $.each(options, function (key, value) {
                if (value != defVal_1) {
                    $select
                        .append($("<option></option>")
                        .attr("value", value)
                        .text(value));
                }
            });
            $select.on('change', this.newCategory.bind(this));
        }
    };
    ExpenseTable.prototype.newCategory = function (event) {
        //console.log(event);
        var $select = $(event.target);
        //console.log('selected', $select.val());
        var id = $select.closest('tr').attr('data-id');
        //console.log(id);
        var transaction = this.model.get(id);
        //console.log(transaction);
        if (transaction) {
            transaction.setCategory($select.val());
        }
    };
    return ExpenseTable;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = ExpenseTable;
//# sourceMappingURL=ExpenseTable.js.map