declare interface Object {
	values: Function;
}

Object.prototype.values = obj => Object.keys(obj).map(key => obj[key]);

