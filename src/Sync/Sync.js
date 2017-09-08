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
exports.__esModule = true;
var Transaction_1 = require("../Expenses/Transaction");
var umsaetze_1 = require("../umsaetze");
var ParseCSV_1 = require("./ParseCSV");
var MonthSelect_1 = require("../MonthSelect");
var Number_1 = require("../Util/Number");
var CollectionController_1 = require("../CollectionController");
console.log(Number_1.detectFloat('3.141528'));
console.debug(Number_1.detectFloat('3.141528'));
//debug(detectFloat('3.141528'));
require('file-saver');
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var toastr = require('toastr');
var chance = require('chance').Chance();
var Backbone = require('backbone');
require('backbone.localstorage');
var $ = require('jquery');
var _ = require('underscore');
var Sync = /** @class */ (function (_super) {
    __extends(Sync, _super);
    function Sync(expenses) {
        var _this = _super.call(this) || this;
        _this.$el = $('#app');
        _this.localStorage = new Backbone.LocalStorage("Expenses");
        _this.model = expenses;
        _this.listenTo(_this.model, 'change', _this.render);
        _this.slowUpdateLoadingBar = _.throttle(_this.updateLoadingBar, 128);
        var $SyncPage = $('#SyncPage');
        $SyncPage.load($SyncPage.attr('src'), function (html) {
            _this.template = _.template(html);
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
            //this.$('#Load').on('click', this.load.bind(this));
            FileReaderJS.setupInput(document.getElementById('file-input-csv'), {
                readAsDefault: 'Text',
                on: {
                    load: this.load.bind(this)
                }
            });
            // this.$('#LoadJSON').on('click', this.loadJSON.bind(this));
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
        toastr.success('Refreshing...');
        this.render();
    };
    Sync.prototype.load = function (e, file) {
        console.log(e, file);
        //console.log(e.target.result);
        this.loadSelectedFile(e.target.result);
    };
    Sync.prototype.loadSelectedFile = function (data) {
        var _this = this;
        this.startLoading();
        var parser = new ParseCSV_1["default"](data);
        var csv = parser.parseAndNormalize();
        return this.fetchCSV(csv, {
            success: function () {
                elapse.time('Expense.saveModels2LS');
                console.log('models loaded, saving to LS');
                _this.model.each(function (model) {
                    _this.localStorage.create(model);
                });
                elapse.timeEnd('Expense.saveModels2LS');
            }
        });
    };
    Sync.prototype.fetchCSV = function (csv, options) {
        var processWithoutVisualFeedback = false;
        if (processWithoutVisualFeedback) {
            _.each(csv, this.processRow.bind(this));
            this.processDone(csv.length, options);
        }
        else {
            umsaetze_1.asyncLoop(csv, this.processRow.bind(this), this.processDone.bind(this, csv.length, options));
        }
    };
    Sync.prototype.startLoading = function () {
        console.log('startLoading');
        this.prevPercent = 0;
        var template = _.template($('#loadingBarTemplate').html());
        this.$('.panel-footer').html(template());
    };
    Sync.prototype.processRow = function (row, i, length) {
        this.slowUpdateLoadingBar(i, length);
        if (row && row.amount) {
            this.model.add(new Transaction_1["default"](row), { silent: true });
        }
    };
    Sync.prototype.updateLoadingBar = function (i, length) {
        var percent = Math.round(100 * i / length);
        //console.log('updateLoadingBar', i, percent);
        if (percent != this.prevPercent) {
            //console.log(percent);
            $('.progress#loadingBar .progress-bar').width(percent + '%');
            this.prevPercent = percent;
        }
    };
    Sync.prototype.processDone = function (count, options) {
        console.log('asyncLoop finished', count, options);
        if (options && options.success) {
            options.success();
        }
        // this makes all months visible at once
        // this.model.setAllVisible();
        console.log('Trigger change on Expenses');
        this.model.trigger('change');
        var ms = MonthSelect_1["default"].getInstance();
        ms.update(this.model);
        Backbone.history.navigate('#', {
            trigger: true
        });
    };
    Sync.prototype.loadJSON = function (e, file) {
        var _this = this;
        // console.log('loadJSON', e);
        // console.log(file);
        // console.log(e.target.result);
        try {
            var data = JSON.parse(e.target.result);
            toastr.info('Importing ' + data.length + ' entries');
            _.each(data, function (row) {
                _this.model.add(new Transaction_1["default"](row));
            });
            toastr.success('Imported');
            this.model.trigger('change');
            Backbone.history.navigate('#', {
                trigger: true
            });
        }
        catch (e) {
            alert(e);
        }
    };
    Sync.prototype.save = function () {
        var data = this.model.localStorage.findAll();
        //console.log(data);
        var json = JSON.stringify(data, null, '\t');
        var blob = new Blob([json], {
            type: "application/json;charset=utf-8"
        });
        var filename = "umsaetze-" + Date.today().toString('yyyy-MM-dd') + '.json';
        //console.log(filename);
        saveAs(blob, filename);
    };
    Sync.prototype.clear = function () {
        console.log('clear');
        if (confirm('Delete *ALL* entries from Local Storage? Make sure you have exported data first.')) {
            var localStorage_1 = new Backbone.LocalStorage("Expenses");
            localStorage_1._clear();
            if (this.model) {
                this.model.clear();
            }
            this.render();
        }
    };
    Sync.prototype.generate = function () {
        toastr.info('Generating...');
        var amount = 100;
        var account = chance.word();
        var categories = this.router.categoryList;
        for (var _i = 0, _a = _.range(amount); _i < _a.length; _i++) {
            var i = _a[_i];
            var category = categories.random();
            this.model.add(new Transaction_1["default"]({
                account: account,
                category: category.get('catName') || "Default",
                currency: "EUR",
                amount: chance.floating({ fixed: 2, min: -1000, max: 1000 }),
                payment_type: "DEBIT_CARD",
                date: chance.date({ year: new Date().getFullYear() }),
                note: chance.sentence()
            }));
        }
        toastr.success('Generated ' + amount + ' records.');
        this.model.trigger('change');
        Backbone.history.navigate('#', {
            trigger: true
        });
    };
    Sync.prototype.saveToLS = function () {
        toastr.success('Saving...');
        this.model.saveAll();
        this.render();
    };
    /**
     * Required by Workspace
     */
    Sync.prototype.hide = function () {
    };
    return Sync;
}(CollectionController_1.CollectionController));
exports["default"] = Sync;
