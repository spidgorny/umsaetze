"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const $ = require("jquery");
const _ = require("underscore");
const Backbone = require("backbone");
const CategoryCount_1 = require("../Category/CategoryCount");
const CategoryPopup_1 = require("./CategoryPopup");
class ExpenseTable extends Backbone.View {
    constructor(options, keywords, categoryList) {
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
        this.categoryList = categoryList;
        this.listenTo(this.categoryList, 'change', this.render);
        this.categoryPopup = new CategoryPopup_1.CategoryPopup(this.$el, this.model, this.categoryList, this.keywords);
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
        this.$el
            .off('change', 'select')
            .on('change', 'select', this.newCategory.bind(this));
        this.$el
            .off('click', 'button.close')
            .on('click', 'button.close', this.deleteRow.bind(this));
        this.$el
            .off('click', 'input.checkedDone')
            .on('click', 'input.checkedDone', this.onCheck.bind(this));
        this.categoryPopup.bindEvents();
        console.profileEnd();
        return this;
    }
    getTransactionAttributesTable() {
        let visible = this.model.getSorted();
        let table = [];
        _.each(visible, (transaction) => {
            const attributes = transaction.toJSON();
            attributes.sDate = transaction.getDate().toString('yyyy-MM-dd');
            attributes.cssClass = attributes.category == CategoryCount_1.default.DEFAULT
                ? 'bg-warning' : '';
            attributes.categoryOptions = this.getCategoryOptions(transaction);
            attributes.background = this.categoryList.getColorFor(transaction.get('category'));
            attributes.checkedDone = transaction.get('done') ? 'checked' : '';
            attributes.amount = attributes.amount.toFixed(2);
            table.push(attributes);
        });
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