import TestFramework from './TestFramework';
import KeywordsView from "../src/Keyword/KeywordsView";

class KeywordsViewTest extends TestFramework {

	testConstructor() {
		const kv = new KeywordsView();
	}

}

new KeywordsViewTest().run();
