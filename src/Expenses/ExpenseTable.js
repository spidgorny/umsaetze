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
import Keyword from "../Keyword/Keyword";
import { debug } from "../main";
import Table from "../Sync/Table";
import View from 'backbone-es6/src/View.js';
import $ from 'jquery';
import _ from 'underscore';
import handlebars from 'handlebars';
var ExpenseTable = (function (_super) {
    __extends(ExpenseTable, _super);
    function ExpenseTable(options) {
        var _this = _super.call(this, options) || this;
        _this.template = _.template($('#rowTemplate').html());
        console.log(_this.keywords);
        var $expenseTable = $('#expenseTable');
        if (!$expenseTable.length) {
            var template = _.template($('#AppView').html());
            $('#app').html(template());
        }
        _this.setElement($expenseTable);
        _this.on("all", debug("ExpenseTable"));
        return _this;
    }
    ExpenseTable.prototype.setCategoryList = function (list) {
        this.categoryList = list;
        this.listenTo(this.categoryList, 'change', this.render);
    };
    ExpenseTable.prototype.render = function (options) {
        var _this = this;
        if (options && options.noRender) {
            console.log('ExpenseTable.noRender');
            return;
        }
        console.profile('ExpenseTable.render');
        console.log('ExpenseTable.render()', this.model.size());
        var table = this.getTransactionAttributesTable();
        var rows = [];
        table.forEach(function (attributes) {
            rows.push(_this.template(attributes));
        });
        console.log('rendering', rows.length, 'rows');
        this.$el.html(rows.join('\n'));
        $('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        $('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        $('#numRows').html(this.model.getVisibleCount().toString());
        this.$el.on('change', 'select', this.newCategory.bind(this));
        this.$el.on('mouseup', 'td.note', this.textSelectedEvent.bind(this));
        this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
        this.$el.on('click', 'input.checkedDone', this.onCheck.bind(this));
        console.profileEnd('ExpenseTable.render');
        return this;
    };
    ExpenseTable.prototype.getTransactionAttributesTable = function () {
        var _this = this;
        var visible = this.model.getVisible();
        var table = new Table();
        _.each(visible, function (transaction) {
            var attributes = transaction.toJSON();
            attributes.sDate = transaction.getDate().toString('yyyy-MM-dd');
            attributes.cssClass = attributes.category == 'Default'
                ? 'bg-warning' : '';
            attributes.categoryOptions = _this.getCategoryOptions(transaction);
            attributes.background = _this.categoryList.getColorFor(transaction.get('category'));
            attributes.checkedDone = transaction.get('done') ? 'checked' : '';
            attributes.amount = attributes.amount.toFixed(2);
            table.push(attributes);
        });
        table = _.sortBy(table, 'date');
        return table;
    };
    ExpenseTable.prototype.openSelect = function (event) {
        var $select = $(event.target);
        {
            var defVal_1 = $select.find('option').html();
            $select.find('option').remove();
            var options = this.categoryList.getOptions();
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
    ExpenseTable.prototype.getCategoryOptions = function (transaction) {
        var selected = transaction.get('category');
        var sOptions = [];
        var options = this.categoryList.getOptions();
        $.each(options, function (key, value) {
            if (value == selected) {
                sOptions.push('<option selected>' + value + '</option>');
            }
            else {
                sOptions.push('<option>' + value + '</option>');
            }
        });
        return sOptions.join('\n');
    };
    ExpenseTable.prototype.newCategory = function (event) {
        console.log('newCategory');
        var $select = $(event.target);
        var id = $select.closest('tr').attr('data-id');
        var transaction = this.model.get(id);
        if (transaction) {
            transaction.setCategory($select.val());
        }
        else {
            console.error('Transaction with id=', id, 'not found');
        }
    };
    ExpenseTable.prototype.textSelectedEvent = function (event) {
        var text = ExpenseTable.getSelectedText().trim();
        if (text) {
            var $contextMenu = $('#contextMenu');
            if (!$contextMenu.length) {
                var template = handlebars.compile($('#categoryMenu').html());
                var menuHTML = template({
                    catlist: this.categoryList.getOptions(),
                });
                $('body').append(menuHTML);
                $contextMenu = $('#contextMenu');
                console.log($contextMenu, event.clientX, event.clientY);
            }
            this.openMenu($contextMenu, event.clientX, event.clientY, this.applyFilter.bind(this, text));
        }
    };
    ExpenseTable.getSelectedText = function () {
        if (window.getSelection) {
            return window.getSelection().toString();
        }
        else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
    };
    ExpenseTable.prototype.openMenu = function (menuSelector, clientX, clientY, callback) {
        var $menu = $(menuSelector)
            .show()
            .css({
            position: "absolute",
            left: this.getMenuPosition(clientX, 'width', 'scrollLeft', menuSelector),
            top: this.getMenuPosition(clientY, 'height', 'scrollTop', menuSelector)
        })
            .off('click')
            .on('click', 'a', function (e) {
            var $selectedMenu = $(e.target);
            if ($selectedMenu.length) {
                $menu.hide();
                callback.call(this, $selectedMenu);
            }
        });
        setTimeout(function () {
            $('body').click(function () {
                $(menuSelector).hide();
                $('body').off('click');
            });
        }, 0);
    };
    ExpenseTable.prototype.getMenuPosition = function (mouse, direction, scrollDir, menuSelector) {
        var win = $(window)[direction](), scroll = $(window)[scrollDir](), menu = $(menuSelector)[direction](), position = mouse + scroll;
        if (mouse + menu > win && menu < mouse)
            position -= menu;
        return position;
    };
    ExpenseTable.prototype.applyFilter = function (text, menu) {
        var scrollTop = document.body.scrollTop;
        console.log('scrollTop', scrollTop);
        var categoryName = menu.text().trim();
        console.log(text, 'to be', categoryName);
        this.keywords.add(new Keyword({
            word: text,
            category: categoryName,
        }));
        this.model.setCategories(this.keywords);
        this.render();
        setTimeout(function () {
            console.log('Scrolling', scrollTop);
            $('body').scrollTop(scrollTop);
        }, 0);
    };
    ExpenseTable.prototype.deleteRow = function (event) {
        var button = $(event.target);
        var dataID = button.closest('tr').attr('data-id');
        console.log('deleteRow', dataID);
        this.model.remove(dataID);
        this.model.saveAll();
        this.render();
    };
    ExpenseTable.prototype.onCheck = function (event) {
        var checkbox = $(event.target);
        var id = checkbox.closest('tr').attr('data-id');
        var transaction = this.model.get(id);
        if (transaction) {
            transaction.set('done', true);
        }
    };
    return ExpenseTable;
}(View));
export default ExpenseTable;
//# sourceMappingURL=ExpenseTable.js.map