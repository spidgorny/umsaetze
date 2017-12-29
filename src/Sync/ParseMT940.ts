
export default class ParseMT940 {

	data: string;

	constructor(data) {
		// http://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
		this.data = String.fromCharCode.apply(null, data);
	}

	parseAndNormalize() {
		console.log(this.data);
		let lines = this.data.split(/[\r\n]+/);
		this.data = null;	// memory

		let tag;
		let data;
		let flow = [];
		lines.forEach((row) => {
			let parts = row.match(/:([^:]+):(.+)/);
			if (parts.length == 3) {
				if (tag) {
					flow.push({
						tag: tag,
						data: data,
					});
				}
				tag = parts[1];
				data = parts[2];
			} else {
				data += row;
			}
		});
		if (tag) {
			flow.push({
				tag: tag,
				data: data,
			});
		}

		console.log(flow);
		return flow;
	}

}
