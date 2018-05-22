import TestFramework from '../TestFramework';
import {KeywordsView} from "../../Keyword/KeywordsView";

class KeywordsViewTest extends TestFramework {

	testConstructor() {
		const kv = new KeywordsView();
	}

}

new KeywordsViewTest().run();
