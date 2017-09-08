var BrowserTest = (function (exports) {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var Keyword = (function () {
    function Keyword(attributes) {
        if (!attributes.word) {
            throw new Error('no word in keyword');
        }
        this.word = attributes.word;
        if (!attributes.category) {
            throw new Error('no word in keyword');
        }
        this.category = attributes.category;
    }
    return Keyword;
}());

var _$4 = require('underscore');
var Backbone$4 = require('backbone');
if (window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone$4);
}
var $$5 = require('jquery');
function asyncLoop$1(arr, callback, done) {
    (function loop(i) {
        callback(arr[i], i, arr.length);
        if (i < arr.length) {
            setTimeout(function () {
                loop(++i);
            }, 0);
        }
        else {
            if (done) {
                done();
            }
        }
    }(0));
}
function debug$1(name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.warn.apply(console, [typeof name, ":"].concat(args));
}
var Umsaetze$1 = (function () {
    function Umsaetze() {
        this.router = new Workspace();
        var ok = Backbone$4.history.start({
            root: '/umsaetze/docs/web/'
        });
        console.log('history.start', ok);
        if (!ok) {
            console.log(Backbone$4.history.routes);
        }
        this.inlineEdit();
        this.tour();
        console.log('Umsaetze.constructor() done');
    }
    Umsaetze.prototype.inlineEdit = function () {
        $$5(document).on('click', '.inlineEdit span', function (event) {
            var span = $$5(event.target);
            var container = span.parent();
            var input = container.find('input').show();
            span.hide();
            input.focus().val(span.text().trim());
            input.keyup(function (event) {
                console.log(event.key);
                if (event.keyCode === 13) {
                    $$5(event.target).blur();
                }
            });
            input.blur(function (event) {
                span.html(input.val().trim());
                input.hide();
                span.show();
                var callback = container.data('callback');
                if (typeof callback == 'function') {
                    callback(event, container, container.text().trim());
                }
            });
        });
    };
    Umsaetze.prototype.tour = function () {
        var Tour = require('bootstrap-tour');
        var tour = new Tour({
            steps: [
                {
                    element: "#app",
                    title: "Let me show you how it works",
                    content: "Here you will see all your expenses in a selected month."
                },
            ]
        });
        setTimeout(function () {
        }, 5);
    };
    return Umsaetze;
}());
$$5(function () {
    setTimeout(function () {
        new Umsaetze$1();
    }, 1 * 1000);
});

var _$7 = require('underscore');
var naturalSort = require('javascript-natural-sort');
var ArrayPlus = (function (_super) {
    __extends(ArrayPlus, _super);
    function ArrayPlus(rows) {
        var _this = _super.call(this) || this;
        if (rows) {
            rows.forEach(function (el, i) {
                _this[i] = el;
            });
        }
        return _this;
    }
    ArrayPlus.prototype.forEach = function (callback) {
        var sorted_keys = Object.keys(this).sort(naturalSort);
        for (var i = 0; i < sorted_keys.length; i++) {
            var key = sorted_keys[i];
            var row = this[key];
            if (this.isNumeric(key)) {
                var ok = callback(row, parseInt(key));
                if (ok === false) {
                    break;
                }
            }
        }
    };
    ArrayPlus.prototype.isNumeric = function (object) {
        var stringObject = object && object.toString();
        return !_$7.isArray(object) && (stringObject - parseFloat(stringObject) + 1) >= 0;
    };
    ArrayPlus.prototype.equals = function (array) {
        return this.length == array.length &&
            this.every(function (this_i, i) { return this_i == array[i]; });
    };
    Object.defineProperty(ArrayPlus.prototype, "length", {
        get: function () {
            var len = 0;
            for (var i in this) {
                if (this.isNumeric(i)) {
                    len++;
                }
            }
            return len;
        },
        set: function (len) {
            this.len = len;
        },
        enumerable: true,
        configurable: true
    });
    ArrayPlus.prototype.mode = function () {
        var _this = this;
        return this.sort(function (a, b) {
            return _this.filter(function (v) { return v.equals(a); }).length
                - _this.filter(function (v) { return v.equals(b); }).length;
        }).pop();
    };
    return ArrayPlus;
}(Array));

var accounting$1 = require('accounting-js');
var _$8 = require('underscore');
function detectFloat(source) {
    if (_$8.isUndefined(source))
        return NaN;
    var float = accounting$1.unformat(source);
    var posComma = source.indexOf(',');
    if (posComma > -1) {
        var posDot = source.indexOf('.');
        if (posDot > -1 && posComma > posDot) {
            var germanFloat = accounting$1.unformat(source, ',');
            if (Math.abs(germanFloat) > Math.abs(float)) {
                float = germanFloat;
            }
        }
        else {
            float = accounting$1.unformat(source, ',');
        }
    }
    return float;
}
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

var _$6 = require('underscore');
var accounting = require('accounting-js');
require('../Util/String');
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(rawData) {
        return _super.call(this, rawData) || this;
    }
    Row.prototype.trim = function () {
        var copy = new Row();
        this.forEach(function (el, i) {
            el = (el || '').trim();
            if (el.length) {
                copy[i] = el;
            }
        });
        return copy;
    };
    Row.prototype.getRowTypes = function () {
        var types = [];
        this.forEach(function (el) {
            var float = detectFloat(el);
            var date = Date.parse(el);
            var isDate = !!date && el.indexOf(',') == -1;
            var isEmpty = _$6.isNull(el)
                || _$6.isUndefined(el)
                || el == '';
            var commas = 0;
            if (_$6.isString(el)) {
                commas = el.split(',').length - 1;
            }
            var elWithoutEUR = (el || '').replace('EUR', '').trim();
            var onlyNumbers = /^[\-,\.\d]+$/.test(elWithoutEUR);
            if (float && !isDate && commas == 1 && onlyNumbers) {
                types.push('number');
            }
            else if (isDate) {
                types.push('date');
            }
            else if (isEmpty) {
                types.push('null');
            }
            else {
                types.push('string');
            }
        });
        return new Row(types);
    };
    Row.peek = function (a, b, c) {
        console.log('-- ', a.length, b.length, c ? c.length : '');
        var maxLen = 50;
        a.forEach(function (aa, i) {
            aa = aa || '';
            var bb = b[i] || '';
            var cc = c ? c[i] || '' : '';
            aa = Row.padTo(aa, maxLen);
            bb = Row.padTo(bb, maxLen);
            cc = Row.padTo(cc, maxLen);
            console.log(aa, '\t', bb, '\t', cc);
        });
    };
    Row.padTo = function (aa, maxLen) {
        aa = aa.replace(/(?:\r\n|\r|\n)/g, ' ');
        aa = aa.substr(0, maxLen);
        var paddingLength = maxLen - aa.length;
        var padding = ' '.repeat(paddingLength);
        return aa + padding;
    };
    Row.prototype.filterByCommon = function (data) {
        var _this = this;
        var filtered = data.filter(function (row, i) {
            var rowTypes = row.getRowTypes();
            if (i + 1 == 5) {
                Row.peek(row, rowTypes, _this);
            }
            var match = rowTypes.similar(_this);
            var matchPercent = rowTypes.similarPercent(_this);
            console.log(i + 1, match, '/', _this.length, '=', matchPercent, '%', row.length);
            var restMatch80 = matchPercent >= 80;
            var sameLength = row.length == _this.length;
            var bReturn = restMatch80 && sameLength;
            return bReturn;
        });
        return new Table(filtered);
    };
    Row.prototype.getHeaderFromTypes = function (dataRow, rowNr) {
        var header = new Row();
        var strings = [];
        this.forEach(function (el, i) {
            if (el == 'date' && !header.date) {
                header.date = dataRow[i];
            }
            else if (el == 'number' && !header.amount) {
                header.amount = dataRow[i];
            }
            else if (el == 'string') {
                strings.push(dataRow[i].trim());
            }
        });
        header.note = strings.join(' ');
        return header;
    };
    Row.prototype.similar = function (to) {
        var theSame = 0;
        this.forEach(function (el, i) {
            var bb = to[i];
            theSame += el == bb ? 1 : 0;
        });
        return theSame;
    };
    Row.prototype.similarPercent = function (to) {
        var similar = this.similar(to);
        return similar / this.length * 100;
    };
    Row.prototype.toVanilla = function () {
        return JSON.parse(JSON.stringify(this));
    };
    return Row;
}(ArrayPlus));

var _$5 = require('underscore');
var Table = (function (_super) {
    __extends(Table, _super);
    function Table(rows) {
        var _this = _super.call(this) || this;
        if (rows) {
            rows.forEach(function (el, i) {
                _this[i] = new Row(el);
            });
        }
        return _this;
    }
    Table.fromText = function (text) {
        var self = new Table();
        var lines = self.tryBestSeparator(text);
        lines.forEach(function (row, i) {
            self.push(row);
        });
        return self;
    };
    Table.prototype.tryBestSeparator = function (text) {
        var linesC = Table.CSVToArray(text, ',');
        var linesS = Table.CSVToArray(text, ';');
        var colsC = [];
        var colsS = [];
        for (var i = 0; i < 100 && i < linesC.length && i < linesS.length; i++) {
            colsC.push(linesC[i].length);
            colsS.push(linesS[i].length);
        }
        var sumC = colsC.reduce(function (a, b) { return a + b; });
        var sumS = colsS.reduce(function (a, b) { return a + b; });
        console.log(', => ', sumC, '; => ', sumS);
        var lines;
        if (sumC > sumS) {
            lines = linesC;
        }
        else {
            lines = linesS;
        }
        return lines;
    };
    Table.CSVToArray = function (strData, strDelimiter) {
        strDelimiter = (strDelimiter || ",");
        var objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            var strMatchedDelimiter = arrMatches[1];
            if (strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter) {
                arrData.push([]);
            }
            var strMatchedValue = void 0;
            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            }
            else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return (arrData);
    };
    Table.prototype.trim = function () {
        var rev = this.reverse();
        var startIndex = null;
        rev.forEach(function (row, i) {
            if (startIndex == null
                && row.length && row[0] != '') {
                startIndex = i;
                console.log('trim @', startIndex);
            }
        });
        var data = rev.slice(startIndex);
        data = data.reverse();
        return new Table(data);
    };
    Table.prototype.trimAll = function () {
        var data = new Table();
        this.forEach(function (row, i) {
            var rowObj = new Row(row);
            var rowTrimmed = rowObj.trim();
            if (rowTrimmed.length) {
                data.push(rowObj);
            }
        });
        return data;
    };
    Table.prototype.getRowTypesForSomeRows = function () {
        var typeSet = new Table();
        console.log('getRowTypesForSomeRows', this.length);
        var iter = 0;
        this.forEach(function (row0, i) {
            var row = new Row(row0);
            var types = row.getRowTypes();
            typeSet.push(types);
            iter++;
            if (iter > 100) {
                return false;
            }
        });
        return typeSet;
    };
    Table.prototype.filterMostlyNull = function () {
        var notNull = this.filter(function (row) {
            var countNull = row.filter(function (type) {
                return type == 'null';
            }).length;
            return countNull < row.length / 2;
        });
        return new Table(notNull);
    };
    Table.prototype.toVanilla = function () {
        var copy = [];
        this.forEach(function (row) {
            copy.push(row.toVanilla());
        });
        return copy;
    };
    Table.prototype.toVanillaTable = function () {
        var copy = [];
        this.forEach(function (row) {
            copy.push(Object.values(row.toVanilla()));
        });
        return copy;
    };
    return Table;
}(ArrayPlus));

var elapse$1 = require('elapse');
elapse$1.configure({
    debug: true
});
var Backbone$3 = require('backbone');
var $$4 = require('jquery');
var _$3 = require('underscore');
var handlebars = require('handlebars');
var ExpenseTable = (function (_super) {
    __extends(ExpenseTable, _super);
    function ExpenseTable(options) {
        var _this = _super.call(this, options) || this;
        _this.template = _$3.template($$4('#rowTemplate').html());
        console.log(_this.keywords);
        if (!$$4('#expenseTable').length) {
            var template = _$3.template($$4('#AppView').html());
            $$4('#app').html(template());
        }
        _this.setElement($$4('#expenseTable'));
        _this.on("all", debug$1("ExpenseTable"));
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
        elapse$1.time('ExpenseTable.render');
        console.log('ExpenseTable.render()', this.model.size());
        var table = this.getTransactionAttributesTable();
        var rows = [];
        table.forEach(function (attributes) {
            rows.push(_this.template(attributes));
        });
        console.log('rendering', rows.length, 'rows');
        this.$el.html(rows.join('\n'));
        $$4('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        $$4('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        $$4('#numRows').html(this.model.getVisibleCount().toString());
        this.$el.on('change', 'select', this.newCategory.bind(this));
        this.$el.on('mouseup', 'td.note', this.textSelectedEvent.bind(this));
        this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
        this.$el.on('click', 'input.checkedDone', this.onCheck.bind(this));
        elapse$1.timeEnd('ExpenseTable.render');
        return this;
    };
    ExpenseTable.prototype.getTransactionAttributesTable = function () {
        var _this = this;
        var visible = this.model.getVisible();
        var table = new Table();
        _$3.each(visible, function (transaction) {
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
        table = _$3.sortBy(table, 'date');
        return table;
    };
    ExpenseTable.prototype.openSelect = function (event) {
        var $select = $$4(event.target);
        {
            var defVal_1 = $select.find('option').html();
            $select.find('option').remove();
            var options = this.categoryList.getOptions();
            $$4.each(options, function (key, value) {
                if (value != defVal_1) {
                    $select
                        .append($$4("<option></option>")
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
        $$4.each(options, function (key, value) {
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
        var $select = $$4(event.target);
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
            var $contextMenu = $$4('#contextMenu');
            if (!$contextMenu.length) {
                var template = handlebars.compile($$4('#categoryMenu').html());
                var menuHTML = template({
                    catlist: this.categoryList.getOptions()
                });
                $$4('body').append(menuHTML);
                $contextMenu = $$4('#contextMenu');
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
        var $menu = $$4(menuSelector)
            .show()
            .css({
            position: "absolute",
            left: this.getMenuPosition(clientX, 'width', 'scrollLeft', menuSelector),
            top: this.getMenuPosition(clientY, 'height', 'scrollTop', menuSelector)
        })
            .off('click')
            .on('click', 'a', function (e) {
            var $selectedMenu = $$4(e.target);
            if ($selectedMenu.length) {
                $menu.hide();
                callback.call(this, $selectedMenu);
            }
        });
        setTimeout(function () {
            $$4('body').click(function () {
                $$4(menuSelector).hide();
                $$4('body').off('click');
            });
        }, 0);
    };
    ExpenseTable.prototype.getMenuPosition = function (mouse, direction, scrollDir, menuSelector) {
        var win = $$4(window)[direction](), scroll = $$4(window)[scrollDir](), menu = $$4(menuSelector)[direction](), position = mouse + scroll;
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
            category: categoryName
        }));
        this.model.setCategories(this.keywords);
        this.render();
        setTimeout(function () {
            console.log('Scrolling', scrollTop);
            $$4('body').scrollTop(scrollTop);
        }, 0);
    };
    ExpenseTable.prototype.deleteRow = function (event) {
        var button = $$4(event.target);
        var dataID = button.closest('tr').attr('data-id');
        console.log('deleteRow', dataID);
        this.model.remove(dataID);
        this.model.saveAll();
        this.render();
    };
    ExpenseTable.prototype.onCheck = function (event) {
        var checkbox = $$4(event.target);
        var id = checkbox.closest('tr').attr('data-id');
        var transaction = this.model.get(id);
        if (transaction) {
            transaction.set('done', true);
        }
    };
    return ExpenseTable;
}(Backbone$3.View));

var elapse$2 = require('elapse');
elapse$2.configure({
    debug: true
});
var Backbone$5 = require('backbone');
var _$9 = require('underscore');
var $$6 = require('jquery');
var Chart = require('chart.js');
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        var _this = _super.call(this, options) || this;
        _this.template = _$9.template($$6('#categoryTemplate').html());
        _this.setElement($$6('#categories'));
        _this.listenTo(_this.model, 'change', _this.render);
        _this.$el.on('click', 'a.filterByCategory', _this.filterByCategory.bind(_this));
        _this.on("all", debug$1("CategoryView"));
        return _this;
    }
    CategoryView.prototype.setExpenses = function (expenses) {
        this.expenses = expenses;
        this.listenTo(this.expenses, 'change', this.recalculate);
    };
    CategoryView.prototype.recalculate = function () {
        console.warn('CategoryView.recalculate');
        this.model.getCategoriesFromExpenses();
    };
    CategoryView.prototype.render = function () {
        var _this = this;
        elapse$2.time('CategoryView.render');
        var categoryCount = this.model.toJSON();
        var incomeRow = _$9.findWhere(categoryCount, {
            catName: 'Income'
        });
        categoryCount = _$9.without(categoryCount, incomeRow);
        var sum = _$9.reduce(categoryCount, function (memo, item) {
            return memo + Math.abs(item.amount);
        }, 0);
        categoryCount = _$9.sortBy(categoryCount, function (el) {
            return Math.abs(el.amount);
        }).reverse();
        var content = [];
        _$9.each(categoryCount, function (catCount) {
            var width = Math.round(100 * Math.abs(catCount.amount) / Math.abs(sum)) + '%';
            content.push(_this.template(_$9.extend(catCount, {
                width: width,
                amount: Math.round(catCount.amount),
                sign: catCount.amount >= 0 ? 'positive' : 'negative'
            })));
        });
        this.$('#catElements').html(content.join('\n'));
        if (!incomeRow) {
            incomeRow = { amount: 0 };
        }
        this.$('.income').html(incomeRow.amount.toFixed(2));
        this.$('.total').html(sum.toFixed(2));
        this.showPieChart(Math.abs(sum));
        elapse$2.timeEnd('CategoryView.render');
        return this;
    };
    CategoryView.prototype._change = function () {
        console.log('CategoryView changed', this.model.size());
        if (this.model) {
            this.render();
        }
        else {
            console.error('Not rendering since this.model is undefined');
        }
    };
    CategoryView.prototype.showPieChart = function (sum) {
        var labels = [];
        var colors = [];
        var dataSet1 = [];
        this.model.comparator = function (el) {
            return -Math.abs(el.getAmount());
        };
        this.model.sort();
        var rest = 0;
        this.model.each(function (cat) {
            if (cat.getName() != 'Income') {
                var amount = Math.abs(cat.getAmount());
                var perCent = 100 * amount / sum;
                if (perCent > 3) {
                    labels.push(cat.get('catName'));
                    dataSet1.push(amount);
                    colors.push(cat.get('color'));
                }
                else {
                    rest += amount;
                }
            }
        });
        labels.push('Rest');
        dataSet1.push(rest.toFixed(2));
        var data = {
            labels: labels,
            datasets: [
                {
                    data: dataSet1,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors
                }
            ]
        };
        if (this.myPieChart) {
            this.myPieChart.destroy();
        }
        this.myPieChart = new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    display: false
                }
            }
        });
    };
    CategoryView.prototype.filterByCategory = function (event) {
        event.preventDefault();
        var link = $$6(event.target);
        var id = link.attr('data-id');
        console.log('filterByCategory', id);
        var cat = this.model.get(id);
        if (cat) {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth();
            this.expenses.filterByCategory(cat);
        }
        else {
            this.expenses.setAllVisible();
            this.expenses.filterByMonth();
        }
        this.expenses.trigger('change');
    };
    CategoryView.prototype.hide = function () {
        this.$el.hide();
        $$6('#pieChart').hide();
    };
    CategoryView.prototype.show = function () {
        this.$el.show();
        $$6('#pieChart').show();
    };
    return CategoryView;
}(Backbone$5.View));

var $$7 = require('jquery');
require('datejs');
var _$10 = require('underscore');
var MonthSelect = (function (_super) {
    __extends(MonthSelect, _super);
    function MonthSelect() {
        var _this = _super.call(this) || this;
        _this.$el = $$7('#MonthSelect');
        _this.yearSelect = _this.$('select');
        _this.monthOptions = _this.$('button');
        _this.selectedYear = parseInt(_this.yearSelect.val()) || new Date().getFullYear();
        _this.selectedMonth = 'Feb';
        _this.earliest = new Date();
        _this.latest = new Date();
        _this.monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        if (!_this.storageProvider) {
            _this.storageProvider = window.localStorage;
        }
        _this.monthOptions.on('click', _this.clickOnMonth.bind(_this));
        _this.yearSelect.on('change', _this.changeYear.bind(_this));
        var year = _this.storageProvider.getItem('MonthSelect.year');
        if (year) {
            _this.selectedYear = parseInt(year);
        }
        var month = _this.storageProvider.getItem('MonthSelect.month');
        if (month) {
            _this.selectedMonth = month;
        }
        return _this;
    }
    MonthSelect.getInstance = function () {
        if (!MonthSelect.instance) {
            MonthSelect.instance = new MonthSelect();
        }
        return MonthSelect.instance;
    };
    MonthSelect.prototype.render = function () {
        var _this = this;
        this.earliest.moveToFirstDayOfMonth();
        var selectedDate = this.getSelected();
        var options = [];
        var minYear = this.earliest.getFullYear();
        var maxYear = this.latest.getFullYear();
        for (var y = minYear; y <= maxYear; y++) {
            var selected = selectedDate.getFullYear() == y ? 'selected' : '';
            options.push('<option ' + selected + '>' + y + '</option>');
        }
        this.yearSelect.html(options.join("\n"));
        this.monthOptions.each(function (i, button) {
            var monthNumber = i + 1;
            var sDate = _this.selectedYear + '-' + monthNumber + '-01';
            var firstOfMonth = new Date(sDate);
            var $button = $$7(button);
            var isAfter = firstOfMonth.isAfter(_this.earliest);
            var isBefore = firstOfMonth.isBefore(_this.latest);
            if (isAfter && isBefore) {
                $button.removeAttr('disabled');
            }
            else {
                $button.attr('disabled', 'disabled');
            }
            var equals = firstOfMonth.equals(selectedDate);
            if (equals) {
                $button.addClass('btn-success').removeClass('btn-default');
            }
            else {
                $button.removeClass('btn-success').addClass('btn-default');
            }
        });
        return this;
    };
    MonthSelect.prototype.show = function () {
        this.$el.show();
        this.render();
    };
    MonthSelect.prototype.hide = function () {
        console.error('MonthSelect.hide');
        this.$el.hide();
    };
    MonthSelect.prototype.getMonthIndex = function () {
        var result = Date.getMonthNumberFromName(this.selectedMonth) + 1;
        return result;
    };
    MonthSelect.prototype.getMonthIndexFor = function (monthName) {
        var result = Date.getMonthNumberFromName(monthName) + 1;
        return result;
    };
    MonthSelect.prototype.getMonthNameFor = function (index) {
        return this.getShortMonthNameFor(index);
    };
    MonthSelect.prototype.changeYear = function (event) {
        Backbone.history.navigate('#/' + this.yearSelect.val() + '/' + this.getMonthIndex());
    };
    MonthSelect.prototype.clickOnMonthAndNavigate = function (event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        var $button = $$7(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        var monthIndex = this.getMonthIndexFor($button.text());
        Backbone.history.navigate('#/' + this.selectedYear + '/' + monthIndex);
    };
    MonthSelect.prototype.clickOnMonth = function (event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        var $button = $$7(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        this.selectedMonth = $button.text();
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setYear = function (year) {
        console.log('setYear', year);
        this.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.selectedYear + '');
        this.render();
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setMonth = function (month) {
        var monthName = this.getMonthNameFor(month);
        console.log('setMonth', month);
        this.selectedMonth = monthName;
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setYearMonth = function (year, month) {
        console.log('setYearMonth', year, month);
        this.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.selectedYear);
        var monthName = this.getMonthNameFor(month);
        this.selectedMonth = monthName;
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.render();
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.trigger = function (what) {
        console.warn(what);
        _super.prototype.trigger.call(this, what);
    };
    MonthSelect.prototype.getSelected = function () {
        var sSelectedDate = this.selectedYear + '-' + this.getMonthIndex() + '-01';
        var selectedDate = new Date(sSelectedDate);
        return selectedDate;
    };
    MonthSelect.prototype.getMonthName = function () {
        throw new Error('getMonthName called when selectedMonth is a string already');
        return this.monthNames[this.selectedMonth];
    };
    MonthSelect.prototype.getShortMonthName = function () {
        return this.getMonthName().substr(0, 3);
    };
    MonthSelect.prototype.getShortMonthNameFor = function (index) {
        return this.monthNames[index - 1].substr(0, 3);
    };
    MonthSelect.prototype.update = function (collection) {
        this.earliest = collection.getEarliest();
        this.latest = collection.getLatest();
        this.selectedYear = this.selectedYear.clamp(this.earliest.getFullYear(), this.latest.getFullYear());
        var selectedMonthIndex = this.getMonthIndex().clamp(this.earliest.getMonth(), this.latest.getMonth());
        this.selectedMonth = this.getShortMonthNameFor(selectedMonthIndex);
        this.show();
    };
    return MonthSelect;
}(Backbone.View));

var Backbone$6 = require('backbone');
console.log(Backbone$6);
var _$11 = require('underscore');
var CollectionController = (function () {
    function CollectionController(options) {
        this.eventSplitter = /\s+/;
        this._listenId = _$11.uniqueId('l');
        this._listeningTo = {};
        this._events = {};
        this._listeners = {};
        this.delegateEventSplitter = /^(\S+)\s*(.*)$/;
        this.viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        this.cid = _$11.uniqueId('view');
        _$11.extend(this, _$11.pick(options, this.viewOptions));
        this._ensureElement();
    }
    CollectionController.prototype.eventsApi = function (iteratee, events, name, callback, opts) {
        var i = 0, names;
        if (name && typeof name === 'object') {
            if (callback !== void 0 && 'context' in opts && opts.context === void 0)
                opts.context = callback;
            for (names = _$11.keys(name); i < names.length; i++) {
                events = this.eventsApi(iteratee, events, names[i], name[names[i]], opts);
            }
        }
        else if (name && this.eventSplitter.test(name)) {
            for (names = name.split(this.eventSplitter); i < names.length; i++) {
                events = iteratee(events, names[i], callback, opts);
            }
        }
        else {
            events = iteratee(events, name, callback, opts);
        }
        return events;
    };
    CollectionController.prototype.on = function (name, callback, context) {
        return this.internalOn(this, name, callback, context, null);
    };
    CollectionController.prototype.internalOn = function (obj, name, callback, context, listening) {
        obj._events = this.eventsApi(this.onApi, obj._events || {}, name, callback, {
            context: context,
            ctx: obj,
            listening: listening
        });
        if (listening) {
            var listeners = obj._listeners || (obj._listeners = {});
            listeners[listening.id] = listening;
        }
        return obj;
    };
    CollectionController.prototype.listenTo = function (obj, name, callback) {
        if (!obj)
            return this;
        var id = obj._listenId || (obj._listenId = _$11.uniqueId('l'));
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var listening = listeningTo[id];
        if (!listening) {
            var thisId = this._listenId || (this._listenId = _$11.uniqueId('l'));
            listening = listeningTo[id] = { obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0 };
        }
        this.internalOn(obj, name, callback, this, listening);
        return this;
    };
    CollectionController.prototype.onApi = function (events, name, callback, options) {
        if (callback) {
            var handlers = events[name] || (events[name] = []);
            var context = options.context, ctx = options.ctx, listening = options.listening;
            if (listening)
                listening.count++;
            handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
        }
        return events;
    };
    CollectionController.prototype.off = function (name, callback, context) {
        if (!this._events)
            return this;
        this._events = this.eventsApi(this.offApi, this._events, name, callback, {
            context: context,
            listeners: this._listeners
        });
        return this;
    };
    CollectionController.prototype.stopListening = function (obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo)
            return this;
        var ids = obj ? [obj._listenId] : _$11.keys(listeningTo);
        for (var i = 0; i < ids.length; i++) {
            var listening = listeningTo[ids[i]];
            if (!listening)
                break;
            listening.obj.off(name, callback, this);
        }
        return this;
    };
    CollectionController.prototype.offApi = function (events, name, callback, options) {
        if (!events)
            return;
        var i = 0, listening;
        var context = options.context, listeners = options.listeners;
        if (!name && !callback && !context) {
            var ids = _$11.keys(listeners);
            for (; i < ids.length; i++) {
                listening = listeners[ids[i]];
                delete listeners[listening.id];
                delete listening.listeningTo[listening.objId];
            }
            return;
        }
        var names = name ? [name] : _$11.keys(events);
        for (; i < names.length; i++) {
            name = names[i];
            var handlers = events[name];
            if (!handlers)
                break;
            var remaining = [];
            for (var j = 0; j < handlers.length; j++) {
                var handler = handlers[j];
                if (callback && callback !== handler.callback &&
                    callback !== handler.callback._callback ||
                    context && context !== handler.context) {
                    remaining.push(handler);
                }
                else {
                    listening = handler.listening;
                    if (listening && --listening.count === 0) {
                        delete listeners[listening.id];
                        delete listening.listeningTo[listening.objId];
                    }
                }
            }
            if (remaining.length) {
                events[name] = remaining;
            }
            else {
                delete events[name];
            }
        }
        return events;
    };
    CollectionController.prototype.once = function (name, callback, context) {
        var events = this.eventsApi(this.onceMap, {}, name, callback, _$11.bind(this.off, this));
        if (typeof name === 'string' && context == null)
            callback = void 0;
        return this.on(events, callback, context);
    };
    CollectionController.prototype.listenToOnce = function (obj, name, callback) {
        var events = this.eventsApi(this.onceMap, {}, name, callback, _$11.bind(this.stopListening, this, obj));
        return this.listenTo(obj, events);
    };
    CollectionController.prototype.onceMap = function (map, name, callback, offer) {
        if (callback) {
            var once_1 = map[name] = _$11.once(function () {
                offer(name, once_1);
                callback.apply(this, arguments);
            });
        }
        return map;
    };
    CollectionController.prototype.trigger = function (name) {
        if (!this._events)
            return this;
        var length = Math.max(0, arguments.length - 1);
        var args = Array(length);
        for (var i = 0; i < length; i++)
            args[i] = arguments[i + 1];
        this.eventsApi(this.triggerApi, this._events, name, void 0, args);
        return this;
    };
    CollectionController.prototype.triggerApi = function (objEvents, name, callback, args) {
        if (objEvents) {
            var events = objEvents[name];
            var allEvents = objEvents.all;
            if (events && allEvents)
                allEvents = allEvents.slice();
            if (events)
                this.triggerEvents(events, args);
            if (allEvents)
                this.triggerEvents(allEvents, [name].concat(args));
        }
        return objEvents;
    };
    CollectionController.prototype.triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1);
                return;
            case 2:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;
            case 3:
                while (++i < l)
                    (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;
            default:
                while (++i < l)
                    (ev = events[i]).callback.apply(ev.ctx, args);
                return;
        }
    };
    CollectionController.prototype.bind = function (name, callback, context) {
        console.error('bind is deprecated');
    };
    CollectionController.prototype.unbind = function (name, callback, context) {
        this.off(name, callback, context);
    };
    CollectionController.prototype.$ = function (selector) {
        return $(selector);
    };
    CollectionController.prototype._ensureElement = function () {
        if (!this.el) {
            var attrs = _$11.extend({}, _$11.result(this, 'attributes'));
            if (this.id)
                attrs.id = _$11.result(this, 'id');
            if (this.className)
                attrs['class'] = _$11.result(this, 'className');
            this.setElement(this._createElement(_$11.result(this, 'tagName')));
            this._setAttributes(attrs);
        }
        else {
            this.setElement(_$11.result(this, 'el'));
        }
    };
    CollectionController.prototype._createElement = function (tagName) {
        return document.createElement(tagName);
    };
    CollectionController.prototype._setAttributes = function (attributes) {
        this.$el.attr(attributes);
    };
    CollectionController.prototype.setElement = function (element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    };
    CollectionController.prototype._setElement = function (el) {
        this.$el = el instanceof Backbone$6.$ ? el : Backbone$6.$(el);
        this.el = this.$el[0];
    };
    CollectionController.prototype.undelegateEvents = function () {
        if (this.$el)
            this.$el.off('.delegateEvents' + this.cid);
        return this;
    };
    CollectionController.prototype.delegateEvents = function (events) {
        events || (events = _$11.result(this, 'events'));
        if (!events)
            return this;
        this.undelegateEvents();
        for (var key in events) {
            var method = events[key];
            if (!_$11.isFunction(method))
                method = this[method];
            if (!method)
                continue;
            var match = key.match(this.delegateEventSplitter);
            this.delegate(match[1], match[2], _$11.bind(method, this));
        }
        return this;
    };
    CollectionController.prototype.delegate = function (eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    };
    CollectionController.prototype.hide = function () {
        this.$el.hide();
    };
    return CollectionController;
}());

var elapse = require('elapse');
elapse.configure({
    debug: true
});
var $$3 = require('jquery');
var _$2 = require('underscore');
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView(options, categoryList) {
        var _this = _super.call(this, options) || this;
        _this.q = '';
        console.log('construct AppView');
        _this.collection = options.collection;
        _this.setElement($$3('#app'));
        _this.setTemplate();
        _this.categoryList = categoryList;
        _this.table = new ExpenseTable({
            model: _this.collection,
            el: $$3('#expenseTable')
        });
        _this.table.setCategoryList(_this.categoryList);
        _this.categories = new CategoryView({
            model: _this.categoryList
        });
        _this.categories.setExpenses(_this.collection);
        _this.ms = MonthSelect.getInstance();
        _this.ms.earliest = _this.collection.getEarliest();
        _this.ms.latest = _this.collection.getLatest();
        _this.ms.render();
        _this.listenTo(_this.ms, 'MonthSelect:change', _this.monthChange.bind(_this));
        _this.collection.selectedMonth = _this.ms.getSelected();
        _this.listenTo(_this.collection, "change", _this.render);
        $$3('.custom-search-form input').on('keyup', _$2.debounce(_this.onSearch.bind(_this), 300));
        _this.on("all", debug$1("AppView"));
        return _this;
    }
    AppView.prototype.render = function () {
        console.log('AppView.render()', this.collection.size());
        this.setTemplate();
        this.table.render();
        this.categories.render();
        this.$('#applyKeywords').on('click', this.applyKeywords.bind(this));
        return this;
    };
    AppView.prototype.setTemplate = function () {
        if (!this.$('#expenseTable').length) {
            var template = _$2.template($$3('#AppView').html());
            this.$el.html(template());
            if (this.table) {
                this.table.$el = $$3('#expenseTable');
            }
        }
    };
    AppView.prototype.monthChange = function () {
        elapse.time('AppView.monthChange');
        this.collection.setAllVisible();
        this.collection.filterByMonth(this.ms.getSelected());
        this.collection.filterVisible(this.q);
        this.categoryList.getCategoriesFromExpenses();
        elapse.timeEnd('AppView.monthChange');
    };
    AppView.prototype.onSearch = function (event) {
        this.q = $$3(event.target).val();
        console.log('Searching: ', this.q);
        this.monthChange();
    };
    AppView.prototype.show = function () {
        elapse.time('AppView.show');
        this.ms.earliest = this.collection.getEarliest();
        this.ms.latest = this.collection.getLatest();
        console.log('MonthSelect range', this.ms.earliest.toString('yyyy-MM-dd'), this.ms.latest.toString('yyyy-MM-dd'), this.collection.size());
        this.ms.show();
        this.render();
        this.categories.show();
        elapse.timeEnd('AppView.show');
    };
    AppView.prototype.hide = function () {
        elapse.time('AppView.hide');
        if (this.$('#expenseTable').length
            && this.$('#expenseTable').is(':visible')) {
        }
        this.categories.hide();
        elapse.timeEnd('AppView.hide');
    };
    AppView.prototype.applyKeywords = function (event) {
        event.preventDefault();
        console.log('applyKeywords');
        this.table.model.setCategories(this.table.keywords);
    };
    return AppView;
}(CollectionController));

var Backbone$8 = require('backbone');
var md5 = require('md5');
var bb = require('backbone');
var Transaction = (function (_super) {
    __extends(Transaction, _super);
    function Transaction(attributes, options) {
        var _this = _super.call(this, attributes, options) || this;
        _this.defaults = {
            visible: true
        };
        var dDate;
        var sDate = _this.get('date');
        if (sDate instanceof Date) {
            dDate = sDate.clone();
            sDate = dDate.toString('d.M.yyyy');
        }
        else {
            dDate = new Date(sDate);
            var dDateValid = !isNaN(dDate.getTime());
            if (!dDate || !dDateValid) {
                dDate = Date.parseExact(sDate, "d.M.yyyy");
            }
            _this.set('date', dDate);
        }
        if (!_this.get('id')) {
            _this.set('id', md5(sDate + _this.get('amount')));
        }
        _this.set('amount', parseFloat(_this.get('amount')));
        if (!_this.has('visible')) {
            _this.set('visible', true);
        }
        _this.set('category', _this.get('category') || 'Default');
        _this.set('note', _this.get('note'));
        _this.set('done', _this.get('done'));
        return _this;
    }
    Transaction.prototype.sign = function () {
        return this.get('amount') >= 0 ? 'positive' : 'negative';
    };
    Transaction.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.sign = this.sign();
        json.id = this.id;
        return json;
    };
    Transaction.prototype.setCategory = function (category) {
        this.set('category', category);
        this.collection.localStorage.update(this);
    };
    Transaction.prototype.getDate = function () {
        var date = this.get('date');
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date;
    };
    Transaction.prototype.isVisible = function () {
        return this.get('visible');
    };
    Transaction.prototype.getAmount = function () {
        return this.get('amount');
    };
    return Transaction;
}(Backbone$8.Model));

var Papa = require('papaparse');
require('datejs');
var ParseCSV = (function () {
    function ParseCSV(data) {
        this.data = data;
    }
    ParseCSV.prototype.parseAndNormalize = function () {
        var csv;
        if (typeof document == "this code is commented") {
            var csvObj = Papa.parse(this.data, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                comments: "#"
            });
            csv = csvObj.data;
        }
        else {
            csv = Table.fromText(this.data);
        }
        this.data = null;
        console.log('rows after parse', csv.length);
        csv = csv.trim();
        console.log('rows after trim', csv.length);
        csv = this.analyzeCSV(csv);
        console.log('rows after analyze', csv.length);
        csv = this.normalizeCSV(csv);
        console.log('rows after normalize', csv.length);
        csv = this.convertDataTypes(csv);
        console.log('rows after convertDataTypes', csv.length);
        return csv;
    };
    ParseCSV.prototype.analyzeCSV = function (data) {
        var startIndex = 0;
        data.forEach(function (row, i) {
            if (!row.length || (row.length == 1 && row[0] == '')) {
                startIndex = i + 1;
            }
        });
        console.log('slicing ', startIndex, 'first rows');
        var sliced = data.slice(startIndex);
        return new Table(sliced);
    };
    ParseCSV.prototype.normalizeCSV = function (data) {
        var typeSet = data.getRowTypesForSomeRows();
        typeSet = typeSet.filterMostlyNull();
        var aCommon = typeSet.mode();
        var common = new Row(aCommon);
        console.log(JSON.stringify(common), 'common');
        data = common.filterByCommon(data);
        console.log('rows after filterByCommon', data.length);
        var dataWithHeader = new Table();
        data.forEach(function (row, i) {
            var header = common.getHeaderFromTypes(row, i);
            if (i == 0) {
                Row.peek(row, common);
                console.log(JSON.stringify(header), 'header');
            }
            dataWithHeader.push(header);
        });
        return dataWithHeader;
    };
    ParseCSV.prototype.zip = function (names, values) {
        var result = new Row();
        for (var i = 0; i < names.length; i++) {
            result[names[i]] = values[i];
        }
        return result;
    };
    ParseCSV.prototype.convertDataTypes = function (csv) {
        csv.forEach(function (row, i) {
            if (row.amount) {
                row.amount = detectFloat(row.amount);
                var date = Date.parseExact(row.date, 'dd.MM.yyyy');
                if (!date) {
                    date = Date.parseExact(row.date, 'dd.MM.yy');
                    if (!date) {
                        console.warn('Date parse error', row.date, date);
                    }
                }
                if (date) {
                    row.date = date;
                }
            }
            else {
                delete csv[i];
            }
        });
        return csv;
    };
    return ParseCSV;
}());

console.log(detectFloat('3.141528'));
console.debug(detectFloat('3.141528'));
require('file-saver');
var elapse$3 = require('elapse');
elapse$3.configure({
    debug: true
});
var toastr$1 = require('toastr');
var chance = require('chance').Chance();
var Backbone$7 = require('backbone');
require('backbone.localstorage');
var $$8 = require('jquery');
var _$12 = require('underscore');
var Sync = (function (_super) {
    __extends(Sync, _super);
    function Sync(expenses) {
        var _this = _super.call(this) || this;
        _this.$el = $$8('#app');
        _this.localStorage = new Backbone$7.LocalStorage("Expenses");
        _this.model = expenses;
        _this.listenTo(_this.model, 'change', _this.render);
        _this.slowUpdateLoadingBar = _$12.throttle(_this.updateLoadingBar, 128);
        var $SyncPage = $$8('#SyncPage');
        $SyncPage.load($SyncPage.attr('src'), function (html) {
            _this.template = _$12.template(html);
            _this.render();
        });
        return _this;
    }
    Sync.prototype.render = function () {
        if (this.template) {
            this.$el.html(this.template({
                memoryRows: this.model.size(),
                lsRows: this.localStorage.findAll().length
            }));
            this.$('#Refresh').on('click', this.refresh.bind(this));
            this.$('#Generate').on('click', this.generate.bind(this));
            FileReaderJS.setupInput(document.getElementById('file-input-csv'), {
                readAsDefault: 'Text',
                on: {
                    load: this.load.bind(this)
                }
            });
            FileReaderJS.setupInput(document.getElementById('file-input-json'), {
                readAsDefault: 'Text',
                on: {
                    load: this.loadJSON.bind(this)
                }
            });
            this.$('#Save').on('click', this.save.bind(this));
            this.$('#Clear').on('click', this.clear.bind(this));
            this.$('#saveToLS').on('click', this.saveToLS.bind(this));
        }
        else {
            this.$el.html('Loading ...');
        }
        return this;
    };
    Sync.prototype.refresh = function () {
        toastr$1.success('Refreshing...');
        this.render();
    };
    Sync.prototype.load = function (e, file) {
        console.log(e, file);
        this.loadSelectedFile(e.target.result);
    };
    Sync.prototype.loadSelectedFile = function (data) {
        var _this = this;
        this.startLoading();
        var parser = new ParseCSV(data);
        var csv = parser.parseAndNormalize();
        return this.fetchCSV(csv, {
            success: function () {
                elapse$3.time('Expense.saveModels2LS');
                console.log('models loaded, saving to LS');
                _this.model.each(function (model) {
                    _this.localStorage.create(model);
                });
                elapse$3.timeEnd('Expense.saveModels2LS');
            }
        });
    };
    Sync.prototype.fetchCSV = function (csv, options) {
        var processWithoutVisualFeedback = false;
        if (processWithoutVisualFeedback) {
            _$12.each(csv, this.processRow.bind(this));
            this.processDone(csv.length, options);
        }
        else {
            asyncLoop$1(csv, this.processRow.bind(this), this.processDone.bind(this, csv.length, options));
        }
    };
    Sync.prototype.startLoading = function () {
        console.log('startLoading');
        this.prevPercent = 0;
        var template = _$12.template($$8('#loadingBarTemplate').html());
        this.$('.panel-footer').html(template());
    };
    Sync.prototype.processRow = function (row, i, length) {
        this.slowUpdateLoadingBar(i, length);
        if (row && row.amount) {
            this.model.add(new Transaction(row), { silent: true });
        }
    };
    Sync.prototype.updateLoadingBar = function (i, length) {
        var percent = Math.round(100 * i / length);
        if (percent != this.prevPercent) {
            $$8('.progress#loadingBar .progress-bar').width(percent + '%');
            this.prevPercent = percent;
        }
    };
    Sync.prototype.processDone = function (count, options) {
        console.log('asyncLoop finished', count, options);
        if (options && options.success) {
            options.success();
        }
        console.log('Trigger change on Expenses');
        this.model.trigger('change');
        var ms = MonthSelect.getInstance();
        ms.update(this.model);
        Backbone$7.history.navigate('#', {
            trigger: true
        });
    };
    Sync.prototype.loadJSON = function (e, file) {
        var _this = this;
        try {
            var data = JSON.parse(e.target.result);
            toastr$1.info('Importing ' + data.length + ' entries');
            _$12.each(data, function (row) {
                _this.model.add(new Transaction(row));
            });
            toastr$1.success('Imported');
            this.model.trigger('change');
            Backbone$7.history.navigate('#', {
                trigger: true
            });
        }
        catch (e) {
            alert(e);
        }
    };
    Sync.prototype.save = function () {
        var data = this.model.localStorage.findAll();
        var json = JSON.stringify(data, null, '\t');
        var blob = new Blob([json], {
            type: "application/json;charset=utf-8"
        });
        var filename = "umsaetze-" + Date.today().toString('yyyy-MM-dd') + '.json';
        saveAs(blob, filename);
    };
    Sync.prototype.clear = function () {
        console.log('clear');
        if (confirm('Delete *ALL* entries from Local Storage? Make sure you have exported data first.')) {
            var localStorage = new Backbone$7.LocalStorage("Expenses");
            localStorage._clear();
            if (this.model) {
                this.model.clear();
            }
            this.render();
        }
    };
    Sync.prototype.generate = function () {
        toastr$1.info('Generating...');
        var amount = 100;
        var account = chance.word();
        var categories = this.router.categoryList;
        for (var _i = 0, _a = _$12.range(amount); _i < _a.length; _i++) {
            var category = categories.random();
            this.model.add(new Transaction({
                account: account,
                category: category.get('catName') || "Default",
                currency: "EUR",
                amount: chance.floating({ fixed: 2, min: -1000, max: 1000 }),
                payment_type: "DEBIT_CARD",
                date: chance.date({ year: new Date().getFullYear() }),
                note: chance.sentence()
            }));
        }
        toastr$1.success('Generated ' + amount + ' records.');
        this.model.trigger('change');
        Backbone$7.history.navigate('#', {
            trigger: true
        });
    };
    Sync.prototype.saveToLS = function () {
        toastr$1.success('Saving...');
        this.model.saveAll();
        this.render();
    };
    Sync.prototype.hide = function () {
    };
    return Sync;
}(CollectionController));

var FakeJQueryXHR = (function () {
    function FakeJQueryXHR() {
    }
    FakeJQueryXHR.prototype.state = function () {
        return undefined;
    };
    FakeJQueryXHR.prototype.statusCode = function (map) {
    };
    FakeJQueryXHR.prototype.always = function (alwaysCallback) {
        var alwaysCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            alwaysCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.done = function (doneCallback) {
        var doneCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            doneCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.fail = function (failCallback) {
        var failCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            failCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.progress = function (progressCallback) {
        var progressCallbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            progressCallbacks[_i - 1] = arguments[_i];
        }
    };
    FakeJQueryXHR.prototype.promise = function (target) {
    };
    FakeJQueryXHR.prototype.pipe = function (doneFilter, failFilter, progressFilter) {
    };
    FakeJQueryXHR.prototype.then = function (doneFilter, failFilter, progressFilter) {
    };
    FakeJQueryXHR.prototype["catch"] = function (failFilter) {
    };
    FakeJQueryXHR.prototype.overrideMimeType = function (mimeType) {
        return undefined;
    };
    FakeJQueryXHR.prototype.abort = function (statusText) {
    };
    FakeJQueryXHR.prototype.error = function (xhr, textStatus, errorThrown) {
    };
    FakeJQueryXHR.prototype.getAllResponseHeaders = function () {
        return undefined;
    };
    FakeJQueryXHR.prototype.getResponseHeader = function (header) {
        return undefined;
    };
    FakeJQueryXHR.prototype.msCachingEnabled = function () {
        return undefined;
    };
    FakeJQueryXHR.prototype.open = function (method, url, async, user, password) {
    };
    FakeJQueryXHR.prototype.send = function (data) {
    };
    FakeJQueryXHR.prototype.setRequestHeader = function (header, value) {
    };
    FakeJQueryXHR.prototype.addEventListener = function (type, listener, useCapture) {
    };
    FakeJQueryXHR.prototype.dispatchEvent = function (evt) {
        return undefined;
    };
    FakeJQueryXHR.prototype.removeEventListener = function (type, listener, options) {
    };
    return FakeJQueryXHR;
}());

var Backbone$9 = require('backbone');
var Backbone$9 = require('backbone');
require('backbone.localstorage');
require('datejs');
var elapse$4 = require('elapse');
elapse$4.configure({
    debug: true
});
var _$13 = require('underscore');
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses(models, options) {
        var _this = _super.call(this, models, options) || this;
        _this.localStorage = new Backbone$9.LocalStorage("Expenses");
        _this.listenTo(_this, 'change', function () {
            console.log('Expenses changed event');
            _this.saveAll();
        });
        _this.on("all", debug$1("Expenses"));
        return _this;
    }
    Expenses.prototype.comparator = function (compare, to) {
        return compare.date == to.date
            ? 0 : (compare.date > to.date ? 1 : -1);
    };
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var models = this.localStorage.findAll();
        console.log('models from LS', models.length);
        if (models.length) {
            _$13.each(models, function (el) {
                _this.add(new Transaction(el));
            });
            this.trigger('change');
        }
        console.log('read', this.length);
        return new FakeJQueryXHR();
    };
    Expenses.prototype.getDateFrom = function () {
        var visible = this.getVisible();
        var min = new Date().addYears(10).valueOf();
        _$13.each(visible, function (row) {
            var date = row.getDate().valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getDateTill = function () {
        var visible = this.getVisible();
        var min = new Date('1970-01-01').valueOf();
        _$13.each(visible, function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getEarliest = function () {
        if (!this.size()) {
            return new Date();
        }
        var min = new Date().addYears(10).valueOf();
        this.each(function (row) {
            var dDate = row.getDate();
            var date = dDate.valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getLatest = function () {
        if (!this.size()) {
            return new Date();
        }
        var min = new Date('1970-01-01').valueOf();
        this.each(function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.setAllVisible = function () {
        this.each(function (model) {
            model.set('visible', true, { silent: true });
        });
    };
    Expenses.prototype.filterVisible = function (q) {
        if (!q.length)
            return;
        elapse$4.time('Expense.filterVisible');
        var lowQ = q.toLowerCase();
        this.each(function (row) {
            if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
                row.set('visible', false, { silent: true });
            }
        });
        elapse$4.timeEnd('Expense.filterVisible');
        this.saveAll();
    };
    Expenses.prototype.filterByMonth = function (selectedMonth) {
        elapse$4.time('Expense.filterByMonth');
        if (selectedMonth) {
            this.selectedMonth = selectedMonth;
        }
        else if (this.selectedMonth) {
            selectedMonth = this.selectedMonth;
        }
        else {
            var ms = MonthSelect.getInstance();
            selectedMonth = ms.getSelected();
        }
        console.log('filterMyMonth', selectedMonth);
        if (selectedMonth) {
            var inThisMonth = this.whereMonth(selectedMonth);
            var allOthers = _$13.difference(this.models, inThisMonth);
            allOthers.forEach(function (row) {
                row.set('visible', false, { silent: true });
            });
            this.saveAll();
        }
        elapse$4.timeEnd('Expense.filterByMonth');
    };
    Expenses.prototype.whereMonth = function (selectedMonth) {
        var filtered = [];
        this.each(function (row) {
            var tDate = row.get('date');
            var sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
            var sameMonth = tDate.getMonth() == selectedMonth.getMonth();
            if (sameYear && sameMonth) {
                filtered.push(row);
            }
        });
        return filtered;
    };
    Expenses.prototype.filterByCategory = function (category) {
        elapse$4.time('Expense.filterByCategory');
        this.each(function (row) {
            if (row.isVisible()) {
                var rowCat = row.get('category');
                var isVisible = category.getName() == rowCat;
                row.set('visible', isVisible, { silent: true });
            }
        });
        this.saveAll();
        elapse$4.timeEnd('Expense.filterByCategory');
    };
    Expenses.prototype.saveAll = function () {
        var _this = this;
        elapse$4.time('Expense.saveAll');
        this.localStorage._clear();
        this.each(function (model) {
            _this.localStorage.update(model);
        });
        elapse$4.timeEnd('Expense.saveAll');
    };
    Expenses.prototype.unserializeDate = function () {
        elapse$4.time('Expense.unserializeDate');
        this.each(function (model) {
            var sDate = model.get('date');
            var dateObject = new Date(sDate);
            console.log(sDate, dateObject);
            model.set('date', dateObject);
        });
        elapse$4.timeEnd('Expense.unserializeDate');
    };
    Expenses.prototype.getVisible = function () {
        return this.where({ visible: true });
    };
    Expenses.prototype.getVisibleCount = function () {
        return this.getVisible().length;
    };
    Expenses.prototype.getSorted = function () {
        this.sort();
        var visible = this.getVisible();
        return visible;
    };
    Expenses.prototype.setCategories = function (keywords) {
        this.each(function (row) {
            if (row.get('category') == 'Default') {
                keywords.each(function (key) {
                    var note = row.get('note');
                    if (note.indexOf(key.word) > -1) {
                        console.log(note, 'contains', key.word, 'gets', key.category);
                        row.set('category', key.category, { silent: true });
                    }
                });
            }
        });
        this.trigger('change');
    };
    Expenses.prototype.getMonthlyTotalsFor = function (category) {
        var sparks = {};
        var from = this.getEarliest().moveToFirstDayOfMonth();
        var till = this.getLatest().moveToLastDayOfMonth();
        var count = 0;
        var _loop_1 = function (month) {
            var month1 = month.clone();
            month1.addMonths(1).add({ minutes: -1 });
            var sum = 0;
            this_1.each(function (transaction) {
                var sameCategory = transaction.get('category') == category.getName();
                var sameMonth = transaction.getDate().between(month, month1);
                if (sameCategory && sameMonth) {
                    sum += transaction.getAmount();
                    count++;
                    category.incrementCount();
                }
            });
            sparks[month.toString('yyyy-MM')] = Math.abs(sum).toFixed(2);
        };
        var this_1 = this;
        for (var month = from; month.compareTo(till) == -1; month.addMonths(1)) {
            _loop_1(month);
        }
        category.set('count', count, { silent: true });
        return sparks;
    };
    Expenses.prototype.replaceCategory = function (oldName, newName) {
        this.each(function (transaction) {
            if (transaction.get('category') == oldName) {
                transaction.set('category', newName, { silent: true });
            }
        });
    };
    Expenses.prototype.clear = function () {
        this.reset(null);
    };
    Expenses.prototype.map = function (fn) {
        return _$13.map(this.models, fn);
    };
    Expenses.prototype.stepBackTillSalary = function (ms) {
        var selectedMonth = ms.getSelected();
        if (selectedMonth) {
            var selectedMonthMinus1 = selectedMonth.clone().addMonths(-1);
            var prevMonth = this.whereMonth(selectedMonthMinus1);
            var max_1 = _$13.reduce(prevMonth, function (acc, row) {
                return Math.max(acc, row.get('amount'));
            }, 0);
            var doAppend_1 = false;
            prevMonth.forEach(function (row) {
                if (row.get('amount') == max_1) {
                    doAppend_1 = true;
                }
                if (doAppend_1) {
                    row.set('visible', true, { silent: true });
                }
            });
        }
    };
    return Expenses;
}(Backbone$9.Collection));

var Backbone$11 = require('backbone');
var object$1 = require('../Util/Object');
var CategoryCount = (function (_super) {
    __extends(CategoryCount, _super);
    function CategoryCount() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.set('catName', args[0].catName);
        _this.set('color', args[0].color);
        _this.set('count', args[0].count);
        _this.set('amount', args[0].amount);
        _this.set('id', args[0].id);
        var color = _this.get('color');
        if (!color) {
            _this.set('color', _this.pastelColor());
        }
        var count = _this.get('count');
        if (!count) {
            _this.set('count', 0);
        }
        var amount = _this.get('amount');
        if (!amount) {
            _this.set('amount', 0);
        }
        return _this;
    }
    CategoryCount.prototype.setColor = function (color) {
        this.set('color', color);
    };
    CategoryCount.prototype.pastelColor = function () {
        var r = (Math.round(Math.random() * 55) + 200).toString(16);
        var g = (Math.round(Math.random() * 55) + 200).toString(16);
        var b = (Math.round(Math.random() * 55) + 200).toString(16);
        return '#' + r + g + b;
    };
    CategoryCount.prototype.getName = function () {
        return this.get('catName');
    };
    CategoryCount.prototype.getAmount = function () {
        return this.get('amount').toFixed(2);
    };
    CategoryCount.prototype.resetCounters = function () {
        this.set('count', 0, { silent: true });
    };
    CategoryCount.prototype.incrementCount = function () {
        this.set('count', this.get('count') + 1, { silent: true });
    };
    CategoryCount.prototype.incrementAmountBy = function (by) {
        this.set('amount', this.get('amount') + by, { silent: true });
    };
    CategoryCount.prototype.getAverageAmountPerMonth = function (totalsPerMonth) {
        var totals = object$1.values(totalsPerMonth);
        var sum = totals.reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
        var avg = sum / totals.length;
        return avg.toFixed(2);
    };
    return CategoryCount;
}(Backbone$11.Model));

var Handlebars = require('handlebars');
var Backbone$10 = require('backbone');
var $$9 = require('jquery');
var _$14 = require('underscore');
var Chart$1 = require('chart.js');
var toastr$2 = require('toastr');
var object = require('./Util/Object');
var CatPage = (function (_super) {
    __extends(CatPage, _super);
    function CatPage(expenses, categoryList) {
        var _this = _super.call(this) || this;
        _this.$el = $$9('#app');
        console.log('CatPage.constructor');
        _this.collection = expenses;
        _this.categoryList = categoryList;
        var importTag = $$9('#CatPage');
        var href = importTag.prop('href');
        console.log(importTag, href);
        $$9.get(href).then(function (result) {
            _this.setTemplate(Handlebars.compile(result));
        });
        console.log(_this);
        _this.listenTo(_this.categoryList, 'change', _this.render);
        _this.listenTo(_this.categoryList, 'add', _this.render);
        _this.listenTo(_this.categoryList, 'update', _this.render);
        return _this;
    }
    CatPage.prototype.setTemplate = function (html) {
        this.template = html;
        this.render();
    };
    CatPage.prototype.render = function () {
        var _this = this;
        if (window.location.hash != '#CatPage')
            return;
        console.log('CatPage.render');
        if (this.template) {
            var categoryOptions_1 = [];
            this.categoryList.each(function (category) {
                var monthlyTotals = _this.collection.getMonthlyTotalsFor(category);
                category.resetCounters();
                var averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
                categoryOptions_1.push({
                    catName: category.get('catName'),
                    background: category.get('color'),
                    id: category.cid,
                    used: category.get('count'),
                    amount: averageAmountPerMonth,
                    average: averageAmountPerMonth,
                    sparkline: JSON.stringify(monthlyTotals)
                });
            });
            categoryOptions_1 = _$14.sortBy(categoryOptions_1, 'catName');
            this.$el.html(this.template({
                categoryOptions: categoryOptions_1
            }));
            this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
            if ($$9(document).scrollTop() < 1) {
                this.$('input[name="newName"]').focus();
            }
            this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
            this.$('button.close').on('click', this.deleteCategory.bind(this));
            this.$('#categoryCount').html(this.categoryList.size().toString());
            this.$('.inlineEdit').data('callback', this.renameCategory.bind(this));
            setTimeout(function () {
                _this.renderSparkLines();
            }, 5000);
        }
        else {
            this.$el.html('Loading...');
        }
        return this;
    };
    CatPage.prototype.addCategory = function (event) {
        event.preventDefault();
        var $form = $$9(event.target);
        var newName = $form.find('input').val();
        console.log('newName', newName);
        var categoryObject = new CategoryCount({
            catName: newName
        });
        console.log('get', categoryObject.get('catName'));
        console.log('get', categoryObject.get('color'));
        this.categoryList.add(categoryObject);
    };
    CatPage.prototype.selectColor = function (event) {
        console.log(event);
        var $input = $$9(event.target);
        var id = $input.closest('tr').attr('data-id');
        console.log('id', id);
        var category = this.categoryList.get(id);
        console.log('category by id', category);
        if (category) {
            category.set('color', event.target.value);
        }
    };
    CatPage.prototype.deleteCategory = function (event) {
        var button = event.target;
        var tr = $$9(button).closest('tr');
        var id = tr.attr('data-id');
        console.log('deleteCategory', id);
        this.categoryList.remove(id);
    };
    CatPage.prototype.renderSparkLines = function () {
        var _this = this;
        var $sparkline = $$9('.sparkline');
        $sparkline.each(function (index, self) {
            self = $$9(self);
            var ctx = self.get(0).getContext("2d");
            var chartData = JSON.parse(self.attr('data-chart_values'));
            var average = self.attr('data-average');
            var data = object.values(chartData);
            var labels = Object.keys(chartData);
            var datasets = {};
            datasets['strokeColor'] = self.attr('data-chart_StrokeColor');
            datasets['data'] = data;
            var lineSet = {
                type: 'line',
                label: 'Average per month',
                data: [].fill(average, 0, data.length),
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false
            };
            var dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineSet);
            var catPage = _this;
            var chart = new Chart$1.Line(ctx, {
                data: dataDesc,
                options: {
                    responsive: true,
                    scaleLineColor: "rgba(0,0,0,0)",
                    scaleShowLabels: false,
                    scaleShowGridLines: false,
                    pointDot: false,
                    datasetFill: false,
                    scaleFontSize: 1,
                    scaleFontColor: "rgba(0,0,0,0)",
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                                ticks: {
                                    padding: 0
                                }
                            }]
                    },
                    onClick: function (event, aChartElement) {
                        catPage.clickOnChart(labels, event, aChartElement, this);
                    }
                }
            });
            self.prop('chart', chart);
        });
    };
    CatPage.prototype.clickOnChart = function (labels, event, aChartElement, chart) {
        var catPage = this;
        var first = aChartElement.length ? aChartElement[0] : null;
        if (first) {
            console.log(labels, aChartElement);
            var yearMonth = labels[first._index];
            var _a = yearMonth.split('-'), year = _a[0], month = _a[1];
            var categoryID = $$9(event.target).closest('tr').attr('data-id');
            var category = catPage.categoryList.get(categoryID);
            console.log(yearMonth, year, month, category);
            Backbone$10.history.navigate('#/' + year + '/' + month + '/' + category.get('catName'));
        }
        else {
            console.log(this, event, event.target);
            var $canvas = $$9(event.target);
            if ($canvas.height() == 100) {
                $canvas.height(300);
            }
            else {
                $canvas.height(100);
            }
            setTimeout(function () {
                chart.resize();
            }, 1000);
        }
    };
    CatPage.prototype.renameCategory = function (event, container, newName) {
        console.log('Rename', newName);
        var id = container.closest('tr').attr('data-id');
        var category = this.categoryList.get(id);
        console.log(id, category);
        if (category) {
            var oldName = category.getName();
            if (this.categoryList.exists(newName)) {
                toastr$2.error('This category name is duplicate');
                container.find('span').text(oldName);
            }
            else {
                category.set('catName', newName);
                this.collection.replaceCategory(oldName, newName);
                this.categoryList.saveToLS();
            }
        }
    };
    return CatPage;
}(CollectionController));

var RecursiveArrayOfStrings = (function (_super) {
    __extends(RecursiveArrayOfStrings, _super);
    function RecursiveArrayOfStrings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RecursiveArrayOfStrings.merge = function (content) {
        var _this = this;
        var output = [];
        content.forEach(function (sub) {
            if (Array.isArray(sub)) {
                output.push(_this.merge(sub));
            }
            else {
                output.push(sub);
            }
        });
        return output.join('');
    };
    return RecursiveArrayOfStrings;
}(Array));

var _$15 = require('underscore');
var KeywordsView = (function (_super) {
    __extends(KeywordsView, _super);
    function KeywordsView(options) {
        var _this = _super.call(this, options) || this;
        _this.$el = $('#app');
        console.log(_this);
        console.log('new KeywordsView()', _this.cid);
        return _this;
    }
    KeywordsView.prototype.render = function () {
        console.time('KeywordsView::render');
        var content = ['<table class="table">',
            '<thead>',
            '<tr>',
            '<th>Keyword</th>',
            '<th>Category</th>',
            '<th></th>',
            '</tr>',
            '</thead>',
        ];
        content.push('<tbody>');
        this.keywords.each(function (el) {
            content.push("\n\t\t\t\t<tr data-id=\"" + el.word + "\">\n\t\t\t\t<td>" + el.word + "</td>\n\t\t\t\t<td>" + el.category + "</td>\n\t\t\t\t<td class=\"hover-btn\">\n\t\t\t\t\t<button type=\"button\" class=\"close btn-sm\" data-dismiss=\"alert\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">\u00D7</span>\n\t\t\t\t\t\t<span class=\"sr-only\">Delete</span>\n\t\t\t\t\t</button>\n\t\t\t\t</td>\n\t\t\t\t</tr>");
        });
        content.push('</tbody>');
        content.push('</table>');
        content = [
            "<div class=\"panel panel-default\">\n\t\t\t\t<div class=\"panel-heading\">\n\t\t\t\t\t<div class=\"pull-right\">\n\t\t\t\t\t\t<button class=\"btn btn-default btn-xs\" id=\"removeDuplicates\">\n\t\t\t\t\t\t\t<span class=\"glyphicon glyphicon-filter\"></span>\n\t\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\tKeywords \n\t\t\t\t<span class=\"badge\">" + this.keywords.size() + "</span>\n\t\t\t</div>\n\t\t\t<div class=\"panel-body\">"
        ].concat(content, [
            '</div>',
            '</div>',
        ]);
        this.$el.html(RecursiveArrayOfStrings.merge(content));
        this.$('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
        this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
        console.timeEnd('KeywordsView::render');
    };
    KeywordsView.prototype.removeDuplicates = function (event) {
        var original = this.keywords.size();
        console.log('removeDuplicates', original);
        this.keywords.models = _$15.uniq(this.keywords.models, false, function (el) {
            return el.word;
        });
        console.log(this.keywords.size());
        var x = this.keywords.size() - original;
        if (x) {
            toastr.success("Removed " + x + " duplicates");
        }
        else {
            toastr.error("No duplicates to remove");
        }
        this.keywords.save();
        this.render();
    };
    KeywordsView.prototype.deleteRow = function (event) {
        var button = $(event.target);
        var dataID = button.closest('tr').attr('data-id');
        console.log(dataID);
        this.keywords.remove(dataID, 'word');
        this.keywords.save();
        this.render();
    };
    KeywordsView.prototype.hide = function () {
    };
    return KeywordsView;
}(CollectionController));

var Backbone$12 = require('backbone');
var elapse$5 = require('elapse');
elapse$5.configure({
    debug: true
});
require('backbone.localstorage');
var _$16 = require('underscore');
var CategoryCollection = (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        var _this = _super.call(this, options) || this;
        var ls = new Backbone$12.LocalStorage('Categories');
        var models = ls.findAll();
        models = _$16.uniq(models, false, function (e1) {
            return e1.catName;
        });
        _$16.each(models, function (m) {
            _this.add(new CategoryCount(m));
        });
        _this.models = _$16.uniq(_this.models, function (el) {
            return el.getName();
        });
        if (!_this.size()) {
        }
        _this.listenTo(_this, 'change', _this.saveToLS);
        return _this;
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.getCategoriesFromExpenses();
    };
    CategoryCollection.prototype.saveToLS = function () {
        var ls = new Backbone$12.LocalStorage('Categories');
        var deleteMe = ls.findAll();
        this.each(function (model) {
            if (model.get('id')) {
                ls.update(model);
                var findIndex = _$16.findIndex(deleteMe, { id: model.get('id') });
                if (findIndex > -1) {
                    deleteMe.splice(findIndex, 1);
                }
            }
            else {
                ls.create(model);
            }
        });
        if (deleteMe.length) {
            _$16.each(deleteMe, function (el) {
                ls.destroy(el);
            });
        }
    };
    CategoryCollection.prototype.resetCounters = function () {
        this.each(function (row) {
            row.set('amount', 0, { silent: true });
            row.set('count', 0, { silent: true });
        });
    };
    CategoryCollection.prototype.getCategoriesFromExpenses = function () {
        var _this = this;
        elapse$5.time('getCategoriesFromExpenses');
        this.resetCounters();
        var visible = this.expenses.getVisible();
        _$16.each(visible, function (transaction) {
            var categoryName = transaction.get('category');
            if (categoryName) {
                _this.incrementCategoryData(categoryName, transaction);
            }
        });
        this.sortBy('amount');
        elapse$5.timeEnd('getCategoriesFromExpenses');
        this.trigger('change');
    };
    CategoryCollection.prototype.incrementCategoryData = function (categoryName, transaction) {
        var exists = this.findWhere({ catName: categoryName });
        if (exists) {
            exists.set('count', exists.get('count') + 1, { silent: true });
            var amountBefore = exists.get('amount');
            var amountAfter = transaction.get('amount');
            exists.set('amount', amountBefore + amountAfter, { silent: true });
        }
        else {
            this.add(new CategoryCount({
                catName: categoryName,
                count: 1,
                amount: transaction.get('amount')
            }), { silent: true });
        }
    };
    CategoryCollection.prototype.getCategoriesFromExpenses2 = function () {
        var options = [];
        var categories = this.expenses.groupBy('category');
        _$16.each(categories, function (value, index) {
            options.push(index);
        });
        return options;
    };
    CategoryCollection.prototype.getOptions = function () {
        var options = this.pluck('catName');
        options = _$16.unique(options);
        options = _$16.sortBy(options);
        return options;
    };
    CategoryCollection.prototype.getColorFor = function (value) {
        var color;
        var category = this.findWhere({ catName: value });
        if (category) {
            color = category.get('color');
        }
        else {
            color = '#AAAAAA';
        }
        return color;
    };
    CategoryCollection.prototype.exists = function (newName) {
        return !!this.findWhere({
            catName: newName
        });
    };
    CategoryCollection.prototype.random = function () {
        return _$16.sample(this.models);
    };
    return CategoryCollection;
}(Backbone$12.Collection));

var simpleStorage = require('simpleStorage.js');
var _$17 = require('underscore');
var CollectionArray = (function (_super) {
    __extends(CollectionArray, _super);
    function CollectionArray() {
        var arguments2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arguments2[_i] = arguments[_i];
        }
        var _this = this;
        _this.models = [];
        _this.name = _this.constructor.prototype.name;
        return _this;
    }
    CollectionArray.prototype.fetch = function () {
        var _this = this;
        var models = simpleStorage.get(this.name) || [];
        models.forEach(function (row) {
            if (row) {
                var model = new _this.modelClass(row);
                _this.add(model);
            }
        });
    };
    CollectionArray.prototype.add = function (model) {
        this.models.push(model);
        this.save();
    };
    CollectionArray.prototype.save = function () {
        simpleStorage.set(this.name, this.models);
    };
    CollectionArray.prototype.each = function (callback) {
        this.models.forEach(function (el) {
            callback(el);
        });
    };
    CollectionArray.prototype.getJSON = function () {
        return JSON.stringify(this.models, null, '\t');
    };
    CollectionArray.prototype.size = function () {
        return this.models.length;
    };
    CollectionArray.prototype.random = function () {
        return _$17.sample(this.models);
    };
    CollectionArray.prototype.remove = function (id, idField) {
        if (idField === void 0) { idField = 'id'; }
        var index = _$17.findIndex(this.models, function (el) {
            return el[idField] == id;
        });
        console.log(index, id, idField);
        if (index > -1) {
            delete this.models[index];
        }
    };
    return CollectionArray;
}(Array));

var KeywordCollection = (function (_super) {
    __extends(KeywordCollection, _super);
    function KeywordCollection() {
        var arguments2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arguments2[_i] = arguments[_i];
        }
        var _this = _super.apply(this, arguments2) || this;
        _this.modelClass = Keyword;
        _this.fetch();
        return _this;
    }
    return KeywordCollection;
}(CollectionArray));

var _$19 = require('underscore');
var SummaryLine = (function () {
    function SummaryLine(params) {
        this.average = 0;
        this.perCent = 0;
        this.perMonth = [];
        if (params) {
            _$19.extend(this, params);
        }
    }
    SummaryLine.prototype.combine = function (sl2) {
        this.average += parseFloat(sl2.average);
        this.perCent = parseFloat(this.perCent) + parseFloat(sl2.perCent);
        if (this.perMonth.length) {
            this.perMonth = _$19.map(this.perMonth, function (el, index) {
                el.value = parseFloat(el.value) + parseFloat(sl2.perMonth[index].value);
                el.value = el.value.toFixed(2);
                return el;
            });
        }
        else {
            this.perMonth = _$19.map(sl2.perMonth, _$19.clone);
        }
    };
    return SummaryLine;
}());

var Handlebars$1 = require('handlebars');
var Backbone$13 = require('backbone');
var _$18 = require('underscore');
var SummaryView = (function (_super) {
    __extends(SummaryView, _super);
    function SummaryView(options, expenses) {
        var _this = _super.call(this, options) || this;
        _this.expenses = expenses;
        _this.setElement($('#app'));
        var importTag = $('#SummaryPage');
        var href = importTag.prop('href');
        $.get(href).then(function (result) {
            _this.template = Handlebars$1.compile(result);
            _this.render();
        });
        return _this;
    }
    SummaryView.prototype.initialize = function () {
    };
    SummaryView.prototype.render = function () {
        if (!this.template) {
            this.$el.html('Loading...');
            return this;
        }
        var categoryOptions = this.getCategoriesWithTotals();
        var months = _$18.pluck(categoryOptions[0].perMonth, 'year-month');
        categoryOptions = this.setPerCent(categoryOptions);
        categoryOptions = _$18.sortBy(categoryOptions, 'catName');
        categoryOptions = this.addCategoryTotals(categoryOptions);
        var content = this.template({
            categoryOptions: categoryOptions,
            count: this.collection.size(),
            months: months
        });
        this.$el.html(content);
        return this;
    };
    SummaryView.prototype.getCategoriesWithTotals = function () {
        var _this = this;
        var categoryOptions = [];
        this.collection.each(function (category) {
            var monthlyTotals = _this.expenses.getMonthlyTotalsFor(category);
            var averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
            monthlyTotals = _$18.map(monthlyTotals, function (el, key) {
                var _a = key.split('-'), year = _a[0], month = _a[1];
                return {
                    'year-month': year + '-' + month,
                    year: year,
                    month: month,
                    categoryName: category.getName(),
                    value: el
                };
            });
            categoryOptions.push(new SummaryLine({
                catName: category.getName(),
                background: category.get('color'),
                id: category.cid,
                average: averageAmountPerMonth,
                perMonth: monthlyTotals
            }));
        });
        return categoryOptions;
    };
    SummaryView.prototype.setPerCent = function (categoryOptions) {
        var sumAverages = categoryOptions.reduce(function (current, b) {
            return current + (typeof b.average == 'number'
                ? b.average : parseFloat(b.average));
        }, 0);
        console.log('sumAverages', sumAverages);
        _$18.each(categoryOptions, function (el) {
            el.perCent = (el.average / sumAverages * 100).toFixed(2);
        });
        return categoryOptions;
    };
    SummaryView.prototype.addCategoryTotals = function (categoryOptions) {
        var groupByCategory = {};
        _$18.each(categoryOptions, function (el) {
            if (!el.catName) {
                console.log(el);
                return;
            }
            var _a = el.catName.split(':'), category = _a[0];
            category = category.trim();
            if (!groupByCategory[category]) {
                groupByCategory[category] = [];
            }
            groupByCategory[category].push(el);
        });
        console.log(groupByCategory);
        _$18.each(groupByCategory, function (set, setName) {
            if (set.length > 1) {
                var newCat_1 = new SummaryLine({
                    catName: setName + ' [' + set.length + ']',
                    background: '#FF8800'
                });
                _$18.each(set, function (el) {
                    newCat_1.combine(el);
                });
                newCat_1.average = typeof newCat_1.average == 'number'
                    ? newCat_1.average.toFixed(2) : newCat_1.average;
                newCat_1.perCent = typeof newCat_1.perCent == 'number'
                    ? newCat_1.perCent.toFixed(2) : newCat_1.perCent;
                categoryOptions.push(newCat_1);
            }
        });
        categoryOptions = _$18.sortBy(categoryOptions, 'catName');
        return categoryOptions;
    };
    SummaryView.prototype.hide = function () {
    };
    return SummaryView;
}(Backbone$13.View));

var _$21 = require('underscore');
var SLTable = (function () {
    function SLTable(data) {
        if (data === void 0) { data = []; }
        this.data = data;
        console.log('SLTable', this.data.length);
    }
    SLTable.prototype.toString = function () {
        var content = [];
        content.push('<table class="table">');
        content.push('<thead><tr>');
        this.getColumns().forEach(function (col) {
            content.push('<th>' + col.name + '</th>');
        });
        content.push('</tr></thead>');
        content.push('<tbody>');
        content.push(this.getRowsToString());
        content.push('</tbody>');
        content.push('</table>');
        return content.join("\n");
    };
    SLTable.prototype.getColumns = function () {
        var thes = [];
        this.data.forEach(function (row) {
            thes = thes.concat(Object.keys(row));
        });
        thes = _$21.uniq(thes);
        var cols = [];
        thes.forEach(function (name) {
            cols.push({ name: name });
        });
        return cols;
    };
    SLTable.prototype.getRowsToString = function () {
        var content = [];
        var columns = this.getColumns();
        this.data.forEach(function (row) {
            content.push('<tr>');
            columns.forEach(function (col) {
                content.push('<td>' + row[col.name] + '</td>');
            });
            content.push('</tr>');
        });
        return content.join("\n");
    };
    return SLTable;
}());

var Handlebars$2 = require('handlebars');
var Backbone$14 = require('backbone');
var _$20 = require('underscore');
var Chart$2 = require('chart.js');
require('datejs');
require('../Util/Array');
var HistoryView = (function (_super) {
    __extends(HistoryView, _super);
    function HistoryView(options) {
        var _this = _super.call(this, options) || this;
        _this.collection = options.collection;
        _this.setElement($('#app'));
        _this.ms = MonthSelect.getInstance();
        _this.ms.update(_this.collection);
        _this.listenTo(_this.ms, 'MonthSelect:change', _this.monthChange.bind(_this));
        _this.template = _$20.template('<canvas width="1500" height="512" ' +
            'class="sparkline" ' +
            'style="width: 1500px; height: 512px" ' +
            'data-chart_StrokeColor="rgba(151,187,0,1)" ' +
            'data-average="<%= average %>" ' +
            '></canvas>');
        return _this;
    }
    HistoryView.prototype.initialize = function () {
    };
    HistoryView.prototype.render = function () {
        this.collection.setAllVisible();
        var yearMonth = this.ms.getSelected();
        console.log('yearMonth', yearMonth);
        this.collection.filterByMonth(yearMonth);
        this.collection.stepBackTillSalary(this.ms);
        var dataThisMonth = this.collection.getSorted();
        var onlyAmounts = dataThisMonth.map(function (set) {
            return set.get('amount');
        });
        var accumulator = 0;
        var cumulative = dataThisMonth.map(function (set) {
            accumulator += set.get('amount');
            return accumulator;
        });
        var labels = dataThisMonth.map(function (set) {
            var date = set.get('date');
            return date.toString('yyyy.MM.dd');
        });
        var content = '';
        content += this.template({
            average: onlyAmounts.average()
        });
        content += new SLTable(JSON.parse(JSON.stringify(dataThisMonth)));
        this.$el.html(content);
        this.renderSparkLines(labels, onlyAmounts, cumulative);
        return this;
    };
    HistoryView.prototype.hide = function () {
        this.stopListening(this.ms);
    };
    HistoryView.prototype.monthChange = function () {
        this.render();
    };
    HistoryView.prototype.renderSparkLines = function (labels, data, data2) {
        var _this = this;
        var $sparkLine = $('.sparkline');
        $sparkLine.each(function (index, self) {
            var $self = $(self);
            var ctx = $self.get(0).getContext("2d");
            var datasets = {};
            datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
            datasets['data'] = data2;
            var lineSet = {
                type: 'line',
                label: 'Transaction',
                data: data,
                borderColor: '#FF0000',
                borderWidth: 1,
                fill: false
            };
            var dataDesc = {};
            dataDesc['labels'] = labels;
            dataDesc['datasets'] = Array(datasets, lineSet);
            var chart = new Chart$2.Line(ctx, {
                data: dataDesc,
                options: {
                    responsive: false,
                    responsiveAnimationDuration: 0,
                    scaleLineColor: "rgba(0,0,0,0)",
                    scaleShowLabels: false,
                    scaleShowGridLines: false,
                    pointDot: false,
                    datasetFill: false,
                    scaleFontSize: 1,
                    scaleFontColor: "rgba(0,0,0,0)",
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [{
                                ticks: {
                                    padding: 0
                                }
                            }]
                    },
                    onClick: function (event, aChartElement) {
                        _this.clickOnChart(labels, event, aChartElement, _this);
                    }
                }
            });
            $self.prop('chart', chart);
        });
    };
    HistoryView.prototype.clickOnChart = function (labels, event, aChart, context) {
        var any = aChart[0];
        var index = any._index;
        var model = this.collection.getSorted()[index];
        var id = model.get('id');
        $(window).scrollTop($("*:contains('" + id + "'):last").offset().top);
        document.location.hash = '#History/' + id;
    };
    return HistoryView;
}(Backbone$14.View));

var Backbone$2 = require('backbone');
var $$2 = require('jquery');
var _$1 = require('underscore');
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(options) {
        var _this = _super.call(this, options) || this;
        _this.routes = {
            "": "AppView",
            ":year/:month": "MonthSelect",
            ":year/:month/:category": "MonthSelectCategory",
            "CatPage": "CatPage",
            "Sync": "Sync",
            "Keywords": "Keywords",
            "Summary": "Summary",
            "History": "History"
        };
        _this.keywords = new KeywordCollection();
        _this._bindRoutes();
        _this.model = new Expenses();
        _this.model.fetch();
        _this.categoryList = new CategoryCollection();
        _this.categoryList.setExpenses(_this.model);
        return _this;
    }
    Workspace.prototype.activateMenu = function () {
        var url = window.location;
        var element = $$2('ul.nav#side-menu a')
            .removeClass('active')
            .filter(function () {
            return this.href == url;
        })
            .addClass('active')
            .parent()
            .removeClass('in');
        while (true) {
            if (element.is('li')) {
                element = element.parent().addClass('in').parent();
            }
            else {
                break;
            }
        }
    };
    Workspace.prototype.hideCurrentPage = function () {
        if (this.currentPage) {
            this.currentPage.hide();
        }
    };
    Workspace.prototype.AppView = function () {
        console.warn('AppView');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.appPage) {
            this.appPage = new AppView({
                collection: this.model
            }, this.categoryList);
            this.appPage.table.keywords = this.keywords;
        }
        this.appPage.show();
        this.currentPage = this.appPage;
    };
    Workspace.prototype.Sync = function () {
        console.warn('Sync');
        this.activateMenu();
        this.hideCurrentPage();
        if (this.appPage) {
            this.appPage.hide();
        }
        else {
            $$2('#MonthSelect').hide();
        }
        if (!this.syncPage) {
            this.syncPage = new Sync(this.model);
            this.syncPage.router = this;
        }
        this.syncPage.render();
        this.currentPage = this.syncPage;
    };
    Workspace.prototype.CatPage = function () {
        console.warn('CatPage');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.catPage) {
            this.catPage = new CatPage(this.model, this.categoryList);
        }
        this.catPage.render();
        this.currentPage = this.catPage;
    };
    Workspace.prototype.Keywords = function () {
        console.warn('Keywords');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.keywordsPage) {
            this.keywordsPage = new KeywordsView();
            this.keywordsPage.keywords = this.keywords;
        }
        this.keywordsPage.render();
        this.currentPage = this.keywordsPage;
    };
    Workspace.prototype.MonthSelect = function (year, month) {
        console.warn('MonthSelect', year, month);
        if (parseInt(year) && parseInt(month)) {
            this.AppView();
            this.appPage.ms.setYearMonth(year, month);
        }
    };
    Workspace.prototype.MonthSelectCategory = function (year, month, category) {
        console.warn('MonthSelectCategory', year, month, category);
        if (parseInt(year) && parseInt(month)) {
            this.AppView();
            this.appPage.ms.setYearMonth(year, month);
            var cat = this.categoryList.findWhere({ catName: category });
            console.log('MonthSelectCategory cat', cat);
            this.appPage.collection.filterByCategory(cat);
            this.appPage.collection.trigger('change');
        }
    };
    Workspace.prototype.Summary = function () {
        console.log('Summary');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.summaryPage) {
            this.summaryPage = new SummaryView({
                collection: this.categoryList
            }, this.model);
        }
        $$2('#pieChart').hide();
        $$2('#categories').hide();
        this.summaryPage.render();
        this.currentPage = this.summaryPage;
    };
    Workspace.prototype.History = function () {
        console.log('History');
        this.activateMenu();
        this.hideCurrentPage();
        if (!this.historyPage) {
            this.historyPage = new HistoryView({
                collection: this.model
            });
        }
        $$2('#pieChart').hide();
        $$2('#categories').hide();
        this.historyPage.render();
        this.currentPage = this.historyPage;
    };
    return Workspace;
}(Backbone$2.Router));

var _ = require('underscore');
var Backbone$1 = require('backbone');
if (window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone$1);
}
var $$1 = require('jquery');
function asyncLoop(arr, callback, done) {
    (function loop(i) {
        callback(arr[i], i, arr.length);
        if (i < arr.length) {
            setTimeout(function () {
                loop(++i);
            }, 0);
        }
        else {
            if (done) {
                done();
            }
        }
    }(0));
}
function debug(name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.warn.apply(console, [typeof name, ":"].concat(args));
}
var Umsaetze = (function () {
    function Umsaetze() {
        this.router = new Workspace();
        var ok = Backbone$1.history.start({
            root: '/umsaetze/docs/web/'
        });
        console.log('history.start', ok);
        if (!ok) {
            console.log(Backbone$1.history.routes);
        }
        this.inlineEdit();
        this.tour();
        console.log('Umsaetze.constructor() done');
    }
    Umsaetze.prototype.inlineEdit = function () {
        $$1(document).on('click', '.inlineEdit span', function (event) {
            var span = $$1(event.target);
            var container = span.parent();
            var input = container.find('input').show();
            span.hide();
            input.focus().val(span.text().trim());
            input.keyup(function (event) {
                console.log(event.key);
                if (event.keyCode === 13) {
                    $$1(event.target).blur();
                }
            });
            input.blur(function (event) {
                span.html(input.val().trim());
                input.hide();
                span.show();
                var callback = container.data('callback');
                if (typeof callback == 'function') {
                    callback(event, container, container.text().trim());
                }
            });
        });
    };
    Umsaetze.prototype.tour = function () {
        var Tour = require('bootstrap-tour');
        var tour = new Tour({
            steps: [
                {
                    element: "#app",
                    title: "Let me show you how it works",
                    content: "Here you will see all your expenses in a selected month."
                },
            ]
        });
        setTimeout(function () {
        }, 5);
    };
    return Umsaetze;
}());
$$1(function () {
    setTimeout(function () {
        new Umsaetze();
    }, 1 * 1000);
});

exports.asyncLoop = asyncLoop;
exports.debug = debug;

return exports;

}({}));
//# sourceMappingURL=bundle.js.map
