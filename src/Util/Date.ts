declare interface Date {
	clone(): Date;
}

Date.prototype.clone = function (): Date {
	return new Date(this.getTime());
};

