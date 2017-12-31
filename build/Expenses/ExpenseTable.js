"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keyword_1 = require("../Keyword/Keyword");
const main_1 = require("../main");
const Table_1 = require("../Sync/Table");
const $ = require("jquery");
const _ = require("underscore");
const handlebars_1 = require("handlebars");
const Backbone = require("backbone");
class ExpenseTable extends Backbone.View {
    constructor(options, keywords) {
        super(options);
        this.template = _.template($('#rowTemplate').html());
        this.keywords = keywords;
        console.log('ExpenseTable.keywords', this.keywords);
        let $expenseTable = $('#expenseTable');
        if (!$expenseTable.length) {
            const template = _.template($('#AppView').html());
            $('#app').html(template());
        }
        this.setElement($expenseTable);
        this.on("all", () => {
            main_1.debug("ExpenseTable");
        });
    }
    setCategoryList(list) {
        this.categoryList = list;
        this.listenTo(this.categoryList, 'change', this.render);
    }
    render(options) {
        if (options && options.noRender) {
            console.log('ExpenseTable.noRender');
            return;
        }
        console.profile('ExpenseTable.render');
        console.log('ExpenseTable.render()', this.model.size());
        let table = this.getTransactionAttributesTable();
        let rows = [];
        table.forEach((attributes) => {
            rows.push(this.template(attributes));
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
        console.profileEnd();
        return this;
    }
    getTransactionAttributesTable() {
        let visible = this.model.getVisible();
        let table = new Table_1.default();
        _.each(visible, (transaction) => {
            let attributes = transaction.toJSON();
            attributes.sDate = transaction.getDate().toString('yyyy-MM-dd');
            attributes.cssClass = attributes.category == 'Default'
                ? 'bg-warning' : '';
            attributes.categoryOptions = this.getCategoryOptions(transaction);
            attributes.background = this.categoryList.getColorFor(transaction.get('category'));
            attributes.checkedDone = transaction.get('done') ? 'checked' : '';
            attributes.amount = attributes.amount.toFixed(2);
            table.push(attributes);
        });
        table = new Table_1.default(_.sortBy(table, 'date'));
        return table;
    }
    openSelect(event) {
        let $select = $(event.target);
        {
            let defVal = $select.find('option').html();
            $select.find('option').remove();
            let options = this.categoryList.getOptions();
            $.each(options, (key, value) => {
                if (value != defVal) {
                    $select
                        .append($("<option></option>")
                        .attr("value", value)
                        .text(value));
                }
            });
            $select.on('change', this.newCategory.bind(this));
        }
    }
    getCategoryOptions(transaction) {
        let selected = transaction.get('category');
        let sOptions = [];
        let options = this.categoryList.getOptions();
        $.each(options, (key, value) => {
            if (value == selected) {
                sOptions.push('<option selected>' + value + '</option>');
            }
            else {
                sOptions.push('<option>' + value + '</option>');
            }
        });
        return sOptions.join('\n');
    }
    newCategory(event) {
        console.log('newCategory');
        let $select = $(event.target);
        let id = $select.closest('tr').attr('data-id');
        let transaction = this.model.get(id);
        if (transaction) {
            transaction.setCategory($select.val());
        }
        else {
            console.error('Transaction with id=', id, 'not found');
        }
    }
    textSelectedEvent(event) {
        let text = ExpenseTable.getSelectedText().trim();
        if (text) {
            let $contextMenu = $('#contextMenu');
            if (!$contextMenu.length) {
                let template = handlebars_1.default.compile($('#categoryMenu').html());
                let menuHTML = template({
                    catlist: this.categoryList.getOptions(),
                });
                $('body').append(menuHTML);
                $contextMenu = $('#contextMenu');
                console.log($contextMenu, event.clientX, event.clientY);
            }
            this.openMenu($contextMenu, event.clientX, event.clientY, this.applyFilter.bind(this, text));
        }
    }
    static getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        }
        else if (typeof document['selection'] != 'undefined') {
            return document['selection'].createRange().text;
        }
        return '';
    }
    openMenu(menuSelector, clientX, clientY, callback) {
        let $menu = $(menuSelector)
            .show()
            .css({
            position: "absolute",
            left: ExpenseTable.getMenuPosition(clientX, 'width', 'scrollLeft', menuSelector),
            top: ExpenseTable.getMenuPosition(clientY, 'height', 'scrollTop', menuSelector)
        })
            .off('click')
            .on('click', 'a', function (e) {
            let $selectedMenu = $(e.target);
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
    }
    static getMenuPosition(mouse, direction, scrollDir, menuSelector) {
        let $win = $(window);
        let win = $win[direction](), scroll = $win[scrollDir](), menu = $(menuSelector)[direction](), position = mouse + scroll;
        if (mouse + menu > win && menu < mouse)
            position -= menu;
        return position;
    }
    applyFilter(text, menu) {
        let scrollTop = document.body.scrollTop;
        console.log('scrollTop', scrollTop);
        let categoryName = menu.text().trim();
        console.log(text, 'to be', categoryName);
        this.keywords.add(new Keyword_1.default({
            word: text,
            category: categoryName,
        }));
        this.model.setCategories(this.keywords);
        console.log('this.render()');
        this.render();
        setTimeout(() => {
            console.log('Scrolling', scrollTop);
            $('body').scrollTop(scrollTop);
        }, 0);
    }
    deleteRow(event) {
        let button = $(event.target);
        let dataID = button.closest('tr').attr('data-id');
        console.log('deleteRow', dataID);
        this.model.remove(dataID);
        this.model.saveAll();
        console.log('this.render()');
        this.render();
    }
    onCheck(event) {
        let checkbox = $(event.target);
        let id = checkbox.closest('tr').attr('data-id');
        let transaction = this.model.get(id);
        if (transaction) {
            transaction.set('done', true);
        }
    }
}
exports.default = ExpenseTable;
//# sourceMappingURL=ExpenseTable.js.map