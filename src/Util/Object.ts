export declare interface Object {
	values: Function;
}

Object.values = obj => Object.keys(obj).map(key => obj[key]);

