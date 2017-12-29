"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const _ = require("underscore");
const RecursiveArrayOfStrings_1 = require("../Util/RecursiveArrayOfStrings");
const toastr_1 = require("toastr");
const CollectionController_1 = require("../CollectionController");
class KeywordsView extends CollectionController_1.CollectionController {
    constructor(options) {
        super();
        this.$el = $('#app');
        console.log(this);
        console.log('new KeywordsView()', this.cid);
    }
    render() {
        console.time('KeywordsView::render');
        let content = ['<table class="table">',
            '<thead>',
            '<tr>',
            '<th>Keyword</th>',
            '<th>Category</th>',
            '<th></th>',
            '</tr>',
            '</thead>',
        ];
        content.push('<tbody>');
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
        content.push('</tbody>');
        content.push('</table>');
        content = [
            `<div class="panel panel-default">
				<div class="panel-heading">
					<div class="pull-right">
						<button class="btn btn-default btn-xs" id="removeDuplicates">
							<span class="glyphicon glyphicon-filter"></span>
						</button>
				</div>
				Keywords
				<span class="badge">${this.keywords.size()}</span>
			</div>
			<div class="panel-body">`,
            ...content,
            '</div>',
            '</div>',
        ];
        this.$el.html(RecursiveArrayOfStrings_1.default.merge(content));
        CollectionController_1.CollectionController.$('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
        this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
        console.timeEnd('KeywordsView::render');
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
            toastr_1.default.success(`Removed ${x} duplicates`);
        }
        else {
            toastr_1.default.error(`No duplicates to remove`);
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
}
exports.KeywordsView = KeywordsView;
//# sourceMappingURL=KeywordsView.js.map