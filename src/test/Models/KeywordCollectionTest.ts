import KeywordCollection from "../src/Keyword/KeywordCollection";
import CollectionArray from "../src/Util/CollectionArray";

class KeywordCollectionTest {

	constructor() {
		this.testCollectionFetch();
		this.testFetch();
	}

	testCollectionFetch() {
		const ca = new CollectionArray();
		console.log(ca);
		ca.fetch();
		console.log(ca);
	}

	testFetch() {
		const kc = new KeywordCollection();
		kc.fetch();
		console.log(kc);
	}

}

new KeywordCollectionTest();
