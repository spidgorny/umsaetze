///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Keyword_1 = require("./Keyword");
var umsaetze_1 = require("./umsaetze");
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var handlebars = require('handlebars');
var ExpenseTable = (function (_super) {
    __extends(ExpenseTable, _super);
    function ExpenseTable(options) {
        _super.call(this, options);
        this.template = _.template($('#rowTemplate').html());
        console.log(this.keywords);
        // in case we started with Sync page the table is not visible
        if (!$('#expenseTable').length) {
            var template = _.template($('#AppView').html());
            $('#app').html(template());
        }
        this.setElement($('#expenseTable'));
        this.$el.on('mouseup', 'td.note', this.textSelectedEvent.bind(this));
        // slow re-rendering of the whole table when collection changes
        //this.listenTo(this.collection, 'change', this.render);
        this.on("all", umsaetze_1.debug("ExpenseTable"));
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
        elapse.time('ExpenseTable.render');
        console.log('ExpenseTable.render()', this.model.size());
        var rows = [];
        var visible = this.model.getVisible();
        _.each(visible, function (transaction) {
            var attributes = transaction.toJSON();
            attributes.sDate = transaction.getDate().toString('yyyy-MM-dd');
            attributes.cssClass = attributes.category == 'Default'
                ? 'bg-warning' : '';
            attributes.categoryOptions = _this.getCategoryOptions(transaction);
            attributes.background = _this.categoryList.getColorFor(transaction.get('category'));
            rows.push(_this.template(attributes));
        });
        console.log('rendering', rows.length, 'rows');
        this.$el.html(rows.join('\n'));
        //console.log(this.$el);
        $('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        $('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        $('#numRows').html(this.model.getVisibleCount().toString());
        // does not work in Chrome
        //this.$el.on('click', 'select', this.openSelect.bind(this));
        this.$el.on('change', 'select', this.newCategory.bind(this));
        elapse.timeEnd('ExpenseTable.render');
        return this;
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
        //console.log(event);
        var $select = $(event.target);
        //console.log('selected', $select.val());
        var id = $select.closest('tr').attr('data-id');
        //console.log(id);
        var transaction = this.model.get(id);
        // console.log(transaction);
        if (transaction) {
            // console.log('Transaction id=', id);
            transaction.setCategory($select.val());
        }
        else {
            console.error('Transaction with id=', id, 'not found');
        }
    };
    ExpenseTable.prototype.textSelectedEvent = function (event) {
        //console.log('textSelectedEvent');
        var text = ExpenseTable.getSelectedText().trim();
        if (text) {
            //console.log(text);
            var $contextMenu = $('#contextMenu');
            if (!$contextMenu.length) {
                var template = handlebars.compile($('#categoryMenu').html());
                var menuHTML = template({
                    catlist: this.categoryList.getOptions()
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
        else if (document.selection) {
            return document.selection.createRange().text;
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
    ExpenseTable.prototype.applyFilter = function (text, menu) {
        var categoryName = menu.text().trim();
        console.log(text, 'to be', categoryName);
        this.keywords.add(new Keyword_1["default"]({
            word: text,
            category: categoryName
        }));
        this.model.setCategories(this.keywords);
        var scrollTop = document.body.scrollTop;
        console.log('scrollTop', scrollTop);
        this.render();
        $('body').scrollTop(scrollTop);
    };
    return ExpenseTable;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = ExpenseTable;
//# sourceMappingURL=ExpenseTable.js.map