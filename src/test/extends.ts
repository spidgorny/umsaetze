class A {

	defaults: any;

}

class B extends A {

	a: A;

	constructor() {
		super();
		this.defaults = {};
		this.a = new A();
	}

}

new B();
