import * as $ from 'jquery';
import * as _ from 'underscore';
import KeywordCollection from './KeywordCollection';
import RecursiveArrayOfStrings from '../Util/RecursiveArrayOfStrings'
import Keyword from './Keyword';
import toastr from 'toastr';
import {CollectionController} from '../CollectionController';

export class KeywordsView extends CollectionController<KeywordCollection> {

	$el = $('#app');

	/**
	 * Will be injected by Workspace
	 */
	keywords: KeywordCollection;

	constructor(options?) {
		super(options);
		console.log(this);
		//console.log(super);
		console.log('new KeywordsView()', this.cid);
	}

	render() {
		console.time('KeywordsView::render');
		let content: string[] = ['<table class="table">',
			'<thead>',
			'<tr>',
				'<th>Keyword</th>',
				'<th>Category</th>',
				'<th></th>',
			'</tr>',
			'</thead>',
		];
		content.push('<tbody>');
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
		content.push('</tbody>');
		content.push('</table>');
		// console.log(content);

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

		this.$el.html(RecursiveArrayOfStrings.merge(content));
		CollectionController.$('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
		this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
		console.timeEnd('KeywordsView::render');
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

}
