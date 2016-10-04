/// <reference path="../../typings/index.d.ts" />

import Backbone = require('backbone');
import $ = require('jquery');
const _ = require('underscore');
import KeywordCollection from "./KeywordCollection";
import RecursiveArrayOfStrings from '../RecursiveArrayOfStrings'
import Keyword from "./Keyword";
import toastr = require('toastr');

export default class KeywordsView extends Backbone.View {

	$el = $('#app');

	/**
	 * Will be injected by Workspace
	 */
	keywords: KeywordCollection;

	constructor() {
		super();
	}

	render() {
		console.time('KeywordsView::render');
		let content = ['<table class="table">',
			'<thead>',
			'<tr>',
				'<th>Keyword</th>',
				'<th>Category</th>',
			'</tr>',
			'</thead>',
		];
		content.push('<tbody>');
		this.keywords.each(el => {
			content.push([
				'<tr>',
				'<td>', el.word, '</td>',
				'<td>', el.category, '</td>',
				'</tr>',
			]);
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
			content,
			'</div>',
			'</div>',
		];

		this.$el.html(RecursiveArrayOfStrings.merge(content));
		this.$('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
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

}
