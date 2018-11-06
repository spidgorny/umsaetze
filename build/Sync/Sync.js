"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const ParseCSV_1 = __importDefault(require("./ParseCSV"));
const MonthSelect_1 = __importDefault(require("../MonthSelect/MonthSelect"));
const CollectionController_1 = require("../CollectionController");
const toastr = __importStar(require("toastr"));
const chance_1 = __importDefault(require("chance"));
const backbone_localstorage_1 = require("backbone.localstorage");
const jquery_1 = __importDefault(require("jquery"));
const _ = __importStar(require("underscore"));
const filereader_js_1 = require("filereader.js");
const promise_file_reader_1 = require("promise-file-reader");
const Backbone = require("backbone");
const log = require('ololog');
const FileSaver = require('file-saver');
const chance = new chance_1.default();
class Sync extends CollectionController_1.CollectionController {
    constructor(expenses, router, tf) {
        super();
        this.$el = jquery_1.default('#app');
        this.localStorage = new backbone_localstorage_1.LocalStorage("Expenses");
        this.model = expenses;
        this.listenTo(this.model, 'change', this.render);
        this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
        let $SyncPage = jquery_1.default('#SyncPage');
        jquery_1.default.get($SyncPage.attr('href'), (html) => {
            this.template = _.template(html);
            this.render();
        });
        this.router = router;
        this.categories = this.router.categoryList;
        this.tf = tf;
    }
    show() {
        super.show();
        this.render();
    }
    render() {
        if (!this.visible) {
            return this;
        }
        if (!this.template) {
            this.$el.html('Loading ...');
            return this;
        }
        this.$el.html(this.template({
            memoryRows: this.model.size(),
            lsRows: this.localStorage.findAll().length,
        }));
        let fileInputCSV = document.getElementById('file-input-csv');
        filereader_js_1.FileReaderJS.setupInput(fileInputCSV, {
            readAsDefault: 'Text',
            on: {
                beforestart: () => {
                    log('beforestart');
                },
                loadend: () => {
                    log('loadend');
                }
            }
        });
        this.$el.find('#file-submit-csv').on('click', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            log('files', fileInputCSV.files);
            if (fileInputCSV.files.length) {
                const data = yield promise_file_reader_1.readAsText(fileInputCSV.files[0]);
                console.log(data);
                this.loadSelectedFile(data);
            }
        }));
        filereader_js_1.FileReaderJS.setupInput(document.getElementById('file-input-json'), {
            readAsDefault: 'Text',
            on: {
                load: this.loadJSON.bind(this),
            }
        });
        this.$el.find('#Refresh')
            .off('click')
            .on('click', this.refresh.bind(this));
        this.$el.find('#Generate')
            .off('click')
            .on('click', this.generate.bind(this));
        this.$el.find('#Save')
            .off('click')
            .on('click', this.save.bind(this));
        this.$el.find('#Clear')
            .off('click')
            .on('click', this.clear.bind(this));
        this.$el.find('#saveToLS')
            .off('click')
            .on('click', this.saveToLS.bind(this));
        return this;
    }
    refresh() {
        toastr.success('Refreshing...');
        this.render();
    }
    load(e, file) {
        console.log('Sync.load', e, file);
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
        let templateString = jquery_1.default('#loadingBarTemplate').html();
        let template = _.template(templateString);
        CollectionController_1.CollectionController.$('.panel-footer').html(template());
    }
    processRow(row, i, length) {
        this.slowUpdateLoadingBar(i, length);
        if (row && row.amount) {
            this.model.add(this.tf.make(row), { silent: true });
        }
    }
    updateLoadingBar(i, length) {
        let percent = Math.round(100 * i / length);
        if (percent != this.prevPercent) {
            jquery_1.default('.progress#loadingBar .progress-bar').width(percent + '%');
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
            toastr.info('Importing ' + data.length + ' entries');
            _.each(data, (row) => {
                this.model.add(this.tf.make(row));
            });
            toastr.success('Imported');
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
        FileSaver.saveAs(blob, filename);
    }
    clear() {
        console.log('clear');
        if (confirm('Delete *ALL* entries from Local Storage? Make sure you have exported data first.')) {
            let localStorage = new backbone_localstorage_1.LocalStorage("Expenses");
            localStorage._clear();
            if (this.model) {
                this.model.clear();
            }
            this.render();
        }
    }
    generate() {
        toastr.info('Generating...');
        let amount = 100;
        let account = chance.word();
        for (let i of _.range(amount)) {
            let category = this.categories.random();
            console.log('random cat', category);
            this.model.add(this.tf.make({
                account: account,
                category: category
                    ? category.get('catName')
                    : "Default",
                currency: "EUR",
                amount: chance.floating({ fixed: 2, min: -1000, max: 1000 }),
                payment_type: "DEBIT_CARD",
                date: chance.date({ year: new Date().getFullYear() }),
                note: chance.sentence(),
            }));
        }
        toastr.success('Generated ' + amount + ' records.');
        this.model.trigger('change');
        this.categories.addCategory('Default');
        Backbone.history.navigate('#', {
            trigger: true,
        });
    }
    saveToLS() {
        toastr.success('Saving...');
        this.model.saveAll();
        this.render();
    }
    hide() {
        super.hide();
    }
}
exports.default = Sync;
//# sourceMappingURL=Sync.js.map