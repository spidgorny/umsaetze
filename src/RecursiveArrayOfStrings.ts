
type ArrayOfStrings = Array<ArrayOfStrings>|string;

export default class RecursiveArrayOfStrings extends Array {

	static merge(content: ArrayOfStrings): string {
		let output = [];
		content.forEach(sub => {
			if (Array.isArray(sub)) {
				output.push(this.merge(sub));
			} else {
				output.push(sub);
			}
		});
		return output.join('');
	}

}
