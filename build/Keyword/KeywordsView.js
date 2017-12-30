"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const _ = require("underscore");
const RecursiveArrayOfStrings_1 = require("../Util/RecursiveArrayOfStrings");
const toastr = require("toastr");
const CollectionController_1 = require("../CollectionController");
class KeywordsView extends CollectionController_1.CollectionController {
    constructor(options) {
        super();
        this.$el = $('#app');
    }
    render() {
        console.time('KeywordsView::render');
        if (this.template) {
            this.renderTemplate();
        }
        else {
            this.$el.html('Loading template...');
            let $link = $('#KeywordsTemplate');
            console.log($link);
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
        console.log(dataID);
        this.keywords.remove(dataID, 'word');
        this.keywords.save();
        this.render();
    }
    hide() {
    }
    importExcel() {
        console.log('importExcel');
    }
}
exports.KeywordsView = KeywordsView;
//# sourceMappingURL=KeywordsView.js.map