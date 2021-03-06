"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const jquery_1 = __importDefault(require("jquery"));
const _ = __importStar(require("underscore"));
const CategoryCount_1 = __importDefault(require("../Category/CategoryCount"));
const CategoryPopup_1 = require("./CategoryPopup");
const Backbone = require("backbone");
class ExpenseTable extends Backbone.View {
    constructor(options, keywords, categoryList) {
        super(options);
        this.template = _.template(jquery_1.default('#rowTemplate').html());
        this.CODE_FOR_NEW = '-new-';
        this.keywords = keywords;
        console.log('ExpenseTable.keywords', this.keywords);
        let $expenseTable = jquery_1.default('#expenseTable');
        if (!$expenseTable.length) {
            const template = _.template(jquery_1.default('#AppView').html());
            jquery_1.default('#app').html(template());
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
        jquery_1.default('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        jquery_1.default('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        jquery_1.default('#numRows').html(this.model.getVisibleCount().toString() + '/' +
            this.model.expenses.size());
        this.$el
            .off('change')
            .on('change', 'select', this.setCategory.bind(this));
        this.$el
            .off('click')
            .on('click', 'button.close', this.deleteRow.bind(this));
        this.$el
            .off('click')
            .on('click', 'input.checkedDone', this.onCheck.bind(this));
        this.categoryPopup.$el = this.$el;
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
        let $select = jquery_1.default(event.target);
        {
            let defVal = $select.find('option').html();
            $select.find('option').remove();
            let options = this.categoryList.getOptions();
            jquery_1.default.each(options, (key, value) => {
                if (value != defVal) {
                    $select
                        .append(jquery_1.default("<option></option>")
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
        let wasSelected = false;
        jquery_1.default.each(options, (key, value) => {
            if (_.isObject(value)) {
                value = value.name;
            }
            if (value == selected) {
                sOptions.push('<option selected>' + value + '</option>');
                wasSelected = true;
            }
            else {
                sOptions.push('<option>' + value + '</option>');
            }
        });
        if (!wasSelected) {
            sOptions.push('<option>' + selected + '</option>');
        }
        sOptions.push(`<option 
			value="${this.CODE_FOR_NEW}">-New-</option>`);
        return sOptions.join('\n');
    }
    setCategory(event) {
        console.log('setCategory');
        let $select = jquery_1.default(event.target);
        let id = $select.closest('tr').attr('data-id');
        let transaction = this.model.get(id);
        if (transaction) {
            if ($select.val() == this.CODE_FOR_NEW) {
                const newName = prompt('New category name?');
                if (newName) {
                    transaction.setCategory(newName);
                    this.trigger('Category:change');
                }
            }
            else {
                transaction.setCategory($select.val());
                this.trigger('Category:change');
            }
        }
        else {
            console.error('Transaction with id=', id, 'not found');
        }
    }
    deleteRow(event) {
        let button = jquery_1.default(event.target);
        let dataID = button.closest('tr').attr('data-id');
        console.log('deleteRow', dataID);
        this.model.remove(dataID);
        this.model.saveAll();
        console.log('this.render()');
        this.render();
    }
    onCheck(event) {
        let checkbox = jquery_1.default(event.target);
        let id = checkbox.closest('tr').attr('data-id');
        let transaction = this.model.get(id);
        if (transaction) {
            transaction.set('done', true);
        }
    }
}
exports.default = ExpenseTable;
//# sourceMappingURL=ExpenseTable.js.map