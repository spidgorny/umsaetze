/// <reference path="../../typings/index.d.ts" />

import Backbone = require('backbone');
import $ = require('jquery');
import KeywordCollection from "./KeywordCollection";
import RecursiveArrayOfStrings from '../RecursiveArrayOfStrings'

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
			'<div class="panel panel-default">',
			'<div class="panel-heading">',
			'<div class="pull-right">',
			'<button class="btn btn-default btn-xs" id="removeDuplicates">',
			'<span class="glyphicon glyphicon-filter"></span>',
			'</button>',
			'</div>',
			'Kywords ',
			'<span class="badge">', this.keywords.size(), '</span>',
			'</div>',
			'<div class="panel-body">',
			content,
			'</div>',
			'</div>',
		];

		this.$el.html(RecursiveArrayOfStrings.merge(content));
		this.$('#removeDuplicates').on('click', this.removeDuplicates.bind(this));
	}

	removeDuplicates(event: MouseEvent) {

	}

}
