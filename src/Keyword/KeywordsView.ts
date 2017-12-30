import * as $ from 'jquery';
import * as _ from 'underscore';
import KeywordCollection from './KeywordCollection';
import RecursiveArrayOfStrings from '../Util/RecursiveArrayOfStrings'
import Keyword from './Keyword';
import * as toastr from 'toastr';
import {CollectionController} from '../CollectionController';

export class KeywordsView extends CollectionController<KeywordCollection> {

	$el = $('#app');

	/**
	 * Will be injected by Workspace
	 */
	keywords: KeywordCollection;

	template: Function;

	constructor(options?) {
		super();
		//console.log('KeywordsView', this);
		//console.log(super);
		//console.log('new KeywordsView()', this.cid);
	}

	render() {
		console.time('KeywordsView::render');
		if (this.template) {
			this.renderTemplate();
		} else {
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
		let content: string[] = [];
		this.keywords.each((el: Keyword) => {
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
				</tr>`
			);
		});

		content = this.template({
			size: this.keywords.size(),
			list: content.join('\n')
		});

		this.$el.html(RecursiveArrayOfStrings.merge(content));
		this.$el.find('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
		this.$el.find('#importExcel').off().on('click', this.importExcel.bind(this));
		this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
	}

	removeDuplicates(event: MouseEvent) {
		let original = this.keywords.size();
		console.log('removeDuplicates', original);
		this.keywords.models = _.uniq(this.keywords.models, false, (el: Keyword) => {
			return el.word;
		});
		console.log(this.keywords.size());
		let x = this.keywords.size() - original;
		if (x) {
			toastr.success(`Removed ${x} duplicates`);
		} else {
			toastr.error(`No duplicates to remove`);
		}
		this.keywords.save();
		this.render();
	}

	deleteRow(event: MouseEvent) {
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
