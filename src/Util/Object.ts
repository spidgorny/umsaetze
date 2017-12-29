declare interface Object {
	values: Function;
}

// this may break jQuery
// Object.prototype.values = obj => Object.keys(obj).map(key => obj[key]);

Object.values = obj => Object.keys(obj).map(key => obj[key]);
