///<reference path="../../typings/index.d.ts"/>

import CollectionArray from './CollectionArray';
import Keyword from './Keyword';

export default class KeywordCollection extends CollectionArray {

	constructor() {
		super();
		this.modelClass = Keyword;
		this.fetch();
	}

}
