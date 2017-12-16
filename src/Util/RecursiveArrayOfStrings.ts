
type ArrayOfStrings = Array<string>|string;

export default class RecursiveArrayOfStrings extends Array {

	static merge(content: ArrayOfStrings): string {
		let output = [];
		if (typeof content == 'object') {
			content.forEach(sub => {
				if (Array.isArray(sub)) {
					output.push(this.merge(sub));
				} else {
					output.push(sub);
				}
			});
		} else {
			output.push(content);
		}
		return output.join('');
	}

}
