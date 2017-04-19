String.prototype.repeat = function(count: number) {
	let accu = '';
	for (let i = 0; i < count; i++) {
		accu += this.toString();
	}
	return accu;
};
