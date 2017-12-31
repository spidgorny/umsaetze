"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const _ = require("underscore");
const RecursiveArrayOfStrings_1 = require("../Util/RecursiveArrayOfStrings");
const Keyword_1 = require("./Keyword");
const toastr = require("toastr");
const CollectionController_1 = require("../CollectionController");
const FileReaderJS = require("filereader.js");
const XLSX = require("xlsx");
class KeywordsView extends CollectionController_1.CollectionController {
    constructor(keywords, categories) {
        super();
        this.$el = $('#app');
        this.keywords = keywords;
        this.categories = categories;
    }
    render() {
        console.time('KeywordsView::render');
        if (this.template) {
            this.renderTemplate();
        }
        else {
            this.$el.html('Loading template...');
            let $link = $('#KeywordsTemplate');
            $link.load($link.attr('href'), (html) => {
                this.template = _.template(html);
                this.renderTemplate();
            });
        }
        console.timeEnd('KeywordsView::render');
    }
    renderTemplate() {
        let content = [];
        this.keywords.each((el) => {
            content.push(`
				<tr data-id="${el.word}">
				<td>${el.word}</td>
				<td>${el.category}</td>
				<td class="hover-btn">
					<button type="button" class="close btn-sm" data-dismiss="alert">
						<span aria-hidden="true">×</span>
						<span class="sr-only">Delete</span>
					</button>
				</td>
				</tr>`);
        });
        content = this.template({
            size: this.keywords.size(),
            list: content.join('\n')
        });
        this.$el.html(RecursiveArrayOfStrings_1.default.merge(content));
        this.$el.find('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
        this.$el.find('#importExcel').off().on('click', this.importExcel.bind(this));
        this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
    }
    removeDuplicates(event) {
        let original = this.keywords.size();
        console.log('removeDuplicates', original);
        this.keywords.models = _.uniq(this.keywords.models, false, (el) => {
            return el.word;
        });
        console.log(this.keywords.size());
        let x = this.keywords.size() - original;
        if (x) {
            toastr.success(`Removed ${x} duplicates`);
        }
        else {
            toastr.error(`No duplicates to remove`);
        }
        this.keywords.save();
        this.render();
    }
    deleteRow(event) {
        let button = $(event.target);
        let dataID = button.closest('tr').attr('data-id');
        this.keywords.remove(dataID, 'word');
        this.keywords.save();
        this.render();
    }
    hide() {
    }
    importExcel() {
        console.log('importExcel');
        let fileTag = document.getElementById('fileInput');
        FileReaderJS.setupInput(fileTag, {
            readAsDefault: 'ArrayBuffer',
            on: {
                load: this.loadExcel.bind(this),
            }
        });
        fileTag.click();
    }
    loadExcel(e, file) {
        const excelData = e.target.result;
        const excelDataArray = new Uint8Array(excelData);
        const workbook = XLSX.read(excelDataArray, {
            type: 'array'
        });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const json = XLSX.utils.sheet_to_json(worksheet, {
            header: ['A', 'B'],
        });
        json.forEach((row) => {
            this.keywords.add(new Keyword_1.default({
                word: row['A'],
                category: row['B'],
            }));
            this.categories.addCategory(row['B']);
        });
        this.render();
    }
}
exports.KeywordsView = KeywordsView;
//# sourceMappingURL=KeywordsView.js.map