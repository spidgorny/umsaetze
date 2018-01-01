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
			this.runTest(method);
			this[method].call(this);
		}
	}

	runTest(method) {
		console.log('');
		console.log('=== ', method, ' ===');
	}

	error(message: string, must: any, is: any) {
		console.error(message);
	}

	assert(b: boolean, message?: string) {
		if (!b) {
			this.error(message, true, b);
		}
	}

	assertEquals(must, is, message?: string) {
		if (must != is) {
			this.error(message, must, is);
		}
	}

}
