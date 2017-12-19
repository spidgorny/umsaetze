"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("../Expenses/Transaction");
const main_1 = require("../main");
const ParseCSV_1 = require("./ParseCSV");
const MonthSelect_1 = require("../MonthSelect");
const Number_1 = require("../Util/Number");
const CollectionController_1 = require("../CollectionController");
const toastr_1 = require("toastr");
const chance_1 = require("chance");
const Backbone = require("backbone");
const backbone_localstorage_1 = require("backbone.localstorage");
const $ = require("jquery");
const _ = require("underscore");
const FileReaderJS = require('filereader.js');
console.log(Number_1.detectFloat('3.141528'));
console.debug(Number_1.detectFloat('3.141528'));
class Sync extends CollectionController_1.CollectionController {
    constructor(expenses) {
        super();
        this.$el = $('#app');
        this.localStorage = new backbone_localstorage_1.default("Expenses");
        this.model = expenses;
        this.listenTo(this.model, 'change', this.render);
        this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
        let $SyncPage = $('#SyncPage');
        $SyncPage.load($SyncPage.attr('src'), (html) => {
            this.template = _.template(html);
            this.render();
        });
    }
    render() {
        if (this.template) {
            this.$el.html(this.template({
                memoryRows: this.model.size(),
                lsRows: this.localStorage.findAll().length,
            }));
            CollectionController_1.CollectionController.$('#Refresh').on('click', this.refresh.bind(this));
            CollectionController_1.CollectionController.$('#Generate').on('click', this.generate.bind(this));
            FileReaderJS.setupInput(document.getElementById('file-input-csv'), {
                readAsDefault: 'Text',
                on: {
                    load: this.load.bind(this),
                }
            });
            FileReaderJS.setupInput(document.getElementById('file-input-json'), {
                readAsDefault: 'Text',
                on: {
                    load: this.loadJSON.bind(this),
                }
            });
            CollectionController_1.CollectionController.$('#Save').on('click', this.save.bind(this));
            CollectionController_1.CollectionController.$('#Clear').on('click', this.clear.bind(this));
            CollectionController_1.CollectionController.$('#saveToLS').on('click', this.saveToLS.bind(this));
        }
        else {
            this.$el.html('Loading ...');
        }
        return this;
    }
    refresh() {
        toastr_1.default.success('Refreshing...');
        this.render();
    }
    load(e, file) {
        console.log(e, file);
        this.loadSelectedFile(e.target.result);
    }
    loadSelectedFile(data) {
        this.startLoading();
        let parser = new ParseCSV_1.default(data);
        let csv = parser.parseAndNormalize();
        return this.fetchCSV(csv, {
            success: () => {
                console.profile('Expense.saveModels2LS');
                console.log('models loaded, saving to LS');
                this.model.each((model) => {
                    this.localStorage.create(model);
                });
                console.profileEnd();
            }
        });
    }
    fetchCSV(csv, options) {
        let processWithoutVisualFeedback = false;
        if (processWithoutVisualFeedback) {
            _.each(csv, this.processRow.bind(this));
            this.processDone(csv.length, options);
        }
        else {
            main_1.asyncLoop(csv, this.processRow.bind(this), this.processDone.bind(this, csv.length, options));
        }
    }
    startLoading() {
        console.log('startLoading');
        this.prevPercent = 0;
        let template = _.template($('#loadingBarTemplate').html());
        CollectionController_1.CollectionController.$('.panel-footer').html(template());
    }
    processRow(row, i, length) {
        this.slowUpdateLoadingBar(i, length);
        if (row && row.amount) {
            this.model.add(new Transaction_1.default(row), { silent: true });
        }
    }
    updateLoadingBar(i, length) {
        let percent = Math.round(100 * i / length);
        if (percent != this.prevPercent) {
            $('.progress#loadingBar .progress-bar').width(percent + '%');
            this.prevPercent = percent;
        }
    }
    processDone(count, options) {
        console.log('asyncLoop finished', count, options);
        if (options && options.success) {
            options.success();
        }
        console.log('Trigger change on Expenses');
        this.model.trigger('change');
        let ms = MonthSelect_1.default.getInstance();
        ms.update(this.model);
        Backbone.history.navigate('#', {
            trigger: true,
        });
    }
    loadJSON(e, file) {
        try {
            let data = JSON.parse(e.target.result);
            toastr_1.default.info('Importing ' + data.length + ' entries');
            _.each(data, (row) => {
                this.model.add(new Transaction_1.default(row));
            });
            toastr_1.default.success('Imported');
            this.model.trigger('change');
            Backbone.history.navigate('#', {
                trigger: true,
            });
        }
        catch (e) {
            alert(e);
        }
    }
    save() {
        let data = this.model.localStorage.findAll();
        let json = JSON.stringify(data, null, '\t');
        let blob = new Blob([json], {
            type: "application/json;charset=utf-8"
        });
        let filename = "umsaetze-" + Date.today().toString('yyyy-MM-dd') + '.json';
        saveAs(blob, filename);
    }
    clear() {
        console.log('clear');
        if (confirm('Delete *ALL* entries from Local Storage? Make sure you have exported data first.')) {
            let localStorage = new backbone_localstorage_1.default("Expenses");
            localStorage._clear();
            if (this.model) {
                this.model.clear();
            }
            this.render();
        }
    }
    generate() {
        toastr_1.default.info('Generating...');
        let amount = 100;
        let account = chance_1.default.word();
        let categories = this.router.categoryList;
        for (let i of _.range(amount)) {
            let category = categories.random();
            this.model.add(new Transaction_1.default({
                account: account,
                category: category.get('catName') || "Default",
                currency: "EUR",
                amount: chance_1.default.floating({ fixed: 2, min: -1000, max: 1000 }),
                payment_type: "DEBIT_CARD",
                date: chance_1.default.date({ year: new Date().getFullYear() }),
                note: chance_1.default.sentence(),
            }));
        }
        toastr_1.default.success('Generated ' + amount + ' records.');
        this.model.trigger('change');
        Backbone.history.navigate('#', {
            trigger: true,
        });
    }
    saveToLS() {
        toastr_1.default.success('Saving...');
        this.model.saveAll();
        this.render();
    }
    hide() {
    }
}
exports.default = Sync;
//# sourceMappingURL=Sync.js.map