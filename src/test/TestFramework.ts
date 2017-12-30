export default class TestFramework {

	constructor() {

	}

	run() {
		// const testFunctions = Object.getOwnPropertyNames(this).filter(function (p: string) {
		let testFunctions = [];
		for (let p in this) {
			// console.log(p);
			if (typeof this[p] === 'function' && p.indexOf('test') == 0) {
				testFunctions.push(p);
			}
		}
		// console.log(testFunctions);
		for (let method of testFunctions) {
			console.log('=== ', method, ' ===');
			this[method].call(this);
		}
	}

	assertEquals(must, is, message?: string) {
		if (must != is) {
			console.error(message, must, is);
		}
	}

}
