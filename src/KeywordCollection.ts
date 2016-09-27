///<reference path="../typings/index.d.ts"/>

import Collection from './Collection';
import Keyword from './Keyword';

export default class KeywordCollection extends Collection {

	constructor() {
		super();
		this.modelClass = Keyword;
		this.fetch();
	}

	getJSON() {
		return JSON.stringify(this.models, null, '\t');
	}
}
