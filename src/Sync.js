///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Transaction_1 = require("./Transaction");
var umsaetze_1 = require("./umsaetze");
require('file-saver');
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var toastr = require('toastr');
var chance = require('chance').Chance();
var Papa = require('papaparse');
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var Sync = (function (_super) {
    __extends(Sync, _super);
    function Sync(expenses) {
        var _this = this;
        _super.call(this);
        this.$el = $('#app');
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';
        this.localStorage = new Backbone.LocalStorage("Expenses");
        this.model = expenses;
        this.listenTo(this.model, 'change', this.render);
        this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
        var $SyncPage = $('#SyncPage');
        $SyncPage.load($SyncPage.attr('src'), function (html) {
            _this.template = _.template(html);
            _this.render();
        });
    }
    Sync.prototype.render = function () {
        if (this.template) {
            this.$el.html(this.template({
                memoryRows: this.model.size(),
                lsRows: this.localStorage.records.length
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
        console.log(e.target.result);
        this.loadSelectedFile(e.target.result);
    };
    Sync.prototype.loadSelectedFile = function (data) {
        var _this = this;
        //var file = prompt('file');
        // let file = this.csvUrl;
        var options = {
            data: data
        };
        return this.fetchCSV(options, {
            success: function () {
                elapse.time('Expense.saveModels2LS');
                console.log('models loaded, saving to LS');
                _this.model.each(function (model) {
                    _this.localStorage.create(model);
                });
                elapse.timeEnd('Expense.saveModels2LS');
            }
        });
        ;
    };
    Sync.prototype.fetchCSV = function (options) {
        console.log('csvUrl', this.csvUrl);
        console.log('options', options);
        this.startLoading();
        // not ajax anymore
        //return $.get(this.csvUrl, (response, xhr) => {
        var response = options.data;
        var csv = Papa.parse(response, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        });
        //console.log(csv);
        var processWithoutVisualFeedback = false;
        if (processWithoutVisualFeedback) {
            _.each(csv.data, this.processRow.bind(this));
            this.processDone(csv.data.length, options);
        }
        else {
            umsaetze_1.asyncLoop(csv.data, this.processRow.bind(this), this.processDone.bind(this, csv.data.length, options));
        }
        // });
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
        this.model.setAllVisible();
        console.log('Trigger change on Expenses');
        this.model.trigger('change');
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
            this.render();
        }
        catch (e) {
            alert(e);
        }
    };
    Sync.prototype.save = function () {
        var data = this.model.localStorage.findAll();
        console.log(data);
        var json = JSON.stringify(data, null, '\t');
        var blob = new Blob([json], {
            type: "application/json;charset=utf-8"
        });
        var filename = "umsaetze-" + Date.today().toString('yyyy-MM-dd') + '.json';
        console.log(filename);
        saveAs(blob, filename);
    };
    Sync.prototype.clear = function () {
        console.log('clear');
        if (confirm('Delete *ALL* entries from Local Storage? Make sure you have exported data first.')) {
            var localStorage_1 = new Backbone.LocalStorage("Expenses");
            localStorage_1._clear();
            this.model.clear();
            this.render();
        }
    };
    Sync.prototype.generate = function () {
        toastr.info('Generating...');
        var amount = 100;
        var account = chance.word();
        for (var _i = 0, _a = _.range(amount); _i < _a.length; _i++) {
            var i = _a[_i];
            this.model.add(new Transaction_1["default"]({
                account: account,
                category: "Default",
                currency: "EUR",
                amount: chance.floating({ fixed: 2, min: -1000, max: 1000 }),
                payment_type: "DEBIT_CARD",
                date: chance.date({ year: new Date().getFullYear() }),
                note: chance.sentence()
            }));
        }
        toastr.success('Generated ' + amount + ' records.');
        // this.model.setAllVisible();
        this.model.trigger('change');
        // this.router.AppView();
        Backbone.history.navigate('#', {
            trigger: true
        });
    };
    return Sync;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = Sync;
//# sourceMappingURL=Sync.js.map