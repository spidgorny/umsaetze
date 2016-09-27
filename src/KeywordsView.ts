import Backbone = require('backbone');
import $ = require('jquery');
import KeywordCollection from "./KeywordCollection";

export default class KeywordsView extends Backbone.View {

	$el = $('#app');

	/**
	 * Will be injected by Workspace
	 */
	keywords: KeywordCollection;

	render() {
		let content = this.keywords.getJSON();
		this.$el.html('<pre>'+content+'</pre>');
	}

}
