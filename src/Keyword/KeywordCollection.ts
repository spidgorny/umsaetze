import CollectionArray from '../Util/CollectionArray';
import Keyword from './Keyword';

export default class KeywordCollection extends CollectionArray {

	constructor(...arguments2) {
		super(...arguments2);
		this.modelClass = Keyword;
		if (typeof this.fetch === 'function') {
			this.fetch();
		}
	}


}
