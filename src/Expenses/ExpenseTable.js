"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Keyword_1 = require("../Keyword/Keyword");
var main_1 = require("../main");
var Table_1 = require("../Sync/Table");
// import View from 'backbone-es6/src/View.js';
var $ = require("jquery");
var _ = require("underscore");
var handlebars_1 = require("handlebars");
// import elapse from 'elapse';
var Backbone = require("backbone");
// elapse.configure({
// 	debug: true
// });
var ExpenseTable = /** @class */ (function (_super) {
    __extends(ExpenseTable, _super);
    function ExpenseTable(options) {
        var _this = _super.call(this, options) || this;
        _this.template = _.template($('#rowTemplate').html());
        console.log(_this.keywords);
        // in case we started with Sync page the table is not visible
        var $expenseTable = $('#expenseTable');
        if (!$expenseTable.length) {
            var template = _.template($('#AppView').html());
            $('#app').html(template());
        }
        _this.setElement($expenseTable);
        // slow re-rendering of the whole table when collection changes
        //this.listenTo(this.collection, 'update', this.render);
        _this.on("all", function () {
            main_1.debug("ExpenseTable");
        });
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
        //console.log(this.$el);
        $('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        $('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        $('#numRows').html(this.model.getVisibleCount().toString());
        this.$el.on('change', 'select', this.newCategory.bind(this));
        this.$el.on('mouseup', 'td.note', this.textSelectedEvent.bind(this));
        this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
        this.$el.on('click', 'input.checkedDone', this.onCheck.bind(this));
        console.profileEnd();
        return this;
    };
    ExpenseTable.prototype.getTransactionAttributesTable = function () {
        var _this = this;
        var visible = this.model.getVisible();
        var table = new Table_1.default();
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
        // sortBy only works with direct attributes (not Model)
        table = new Table_1.default(_.sortBy(table, 'date'));
        return table;
    };
    /**
     * @deprecated - not working in Chrome
     * @param event
     */
    ExpenseTable.prototype.openSelect = function (event) {
        //console.log('openSelect', this, event);
        var $select = $(event.target);
        //if ($select.find('option').length == 1) {
        {
            var defVal_1 = $select.find('option').html();
            $select.find('option').remove();
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
    ExpenseTable.prototype.getCategoryOptions = function (transaction) {
        var selected = transaction.get('category');
        var sOptions = [];
        var options = this.categoryList.getOptions();
        // console.log('options', options);
        $.each(options, function (key, value) {
            if (value == selected) {
                sOptions.push('<option selected>' + value + '</option>');
            }
            else {
                sOptions.push('<option>' + value + '</option>');
            }
        });
        // console.log('sOptions', sOptions);
        return sOptions.join('\n');
    };
    ExpenseTable.prototype.newCategory = function (event) {
        console.log('newCategory');
        var $select = $(event.target);
        //console.log('selected', $select.val());
        var id = $select.closest('tr').attr('data-id');
        //console.log(id);
        var transaction = this.model.get(id);
        // console.log(transaction);
        if (transaction) {
            // console.log('Transaction id=', id);
            transaction.setCategory($select.val());
            // console.log(transaction.toJSON());
            //this.categoryList.trigger('change');
        }
        else {
            console.error('Transaction with id=', id, 'not found');
        }
    };
    ExpenseTable.prototype.textSelectedEvent = function (event) {
        // console.log('textSelectedEvent');
        var text = ExpenseTable.getSelectedText().trim();
        if (text) {
            //console.log(text);
            var $contextMenu = $('#contextMenu');
            if (!$contextMenu.length) {
                var template = handlebars_1.default.compile($('#categoryMenu').html());
                var menuHTML = template({
                    catlist: this.categoryList.getOptions(),
                });
                $('body').append(menuHTML);
                $contextMenu = $('#contextMenu'); // after append
                console.log($contextMenu, event.clientX, event.clientY);
            }
            this.openMenu($contextMenu, event.clientX, event.clientY, this.applyFilter.bind(this, text));
        }
    };
    ExpenseTable.getSelectedText = function () {
        if (window.getSelection) {
            return window.getSelection().toString();
        }
        else if (typeof document['selection'] != 'undefined') {
            return document['selection'].createRange().text;
        }
        return '';
    };
    /**
     * Opens a popup menu at the specified position
     * @param menuSelector
     * @param clientX
     * @param clientY
     * @param callback
     */
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
        //console.log($menu);
        // make sure menu closes on any click
        // since we use onmouseup we can't immediately close the popup
        setTimeout(function () {
            $('body').click(function () {
                $(menuSelector).hide();
                $('body').off('click'); // once
            });
        }, 0);
    };
    ExpenseTable.prototype.getMenuPosition = function (mouse, direction, scrollDir, menuSelector) {
        var win = $(window)[direction](), scroll = $(window)[scrollDir](), menu = $(menuSelector)[direction](), position = mouse + scroll;
        // opening menu would pass the side of the page
        if (mouse + menu > win && menu < mouse)
            position -= menu;
        return position;
    };
    /**
     * When clicking on the category item from the popup menu
     * @param text
     * @param menu
     */
    ExpenseTable.prototype.applyFilter = function (text, menu) {
        var scrollTop = document.body.scrollTop;
        console.log('scrollTop', scrollTop);
        var categoryName = menu.text().trim();
        console.log(text, 'to be', categoryName);
        this.keywords.add(new Keyword_1.default({
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
        //console.log(checkbox, id, transaction);
        if (transaction) {
            transaction.set('done', true);
        }
    };
    return ExpenseTable;
}(Backbone.View));
exports.default = ExpenseTable;
