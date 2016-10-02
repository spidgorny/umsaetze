
export default class Keyword {

	word: string;

	category: string;

	constructor(attributes: Object) {
		if (!attributes.word) {
			throw new Error('no word in keyword');
		}
		this.word = attributes.word;
		if (!attributes.category) {
			throw new Error('no word in keyword');
		}
		this.category = attributes.category;
	}

}
