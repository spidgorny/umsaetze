export default class Document {

	createElement(tag: string) {
		const el = new HTMLElement();
		el.tagName = tag;
		return el;
	}

}
