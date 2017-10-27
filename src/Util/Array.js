Array.prototype.average = function () {
    if (this.length) {
        var sum = _.reduce(this, function (a, b) {
            return '' + (parseFloat(a) + parseFloat(b));
        });
        var avg = parseFloat(sum) / this.length;
        return avg.toFixed(2);
    }
    else {
        return null;
    }
};
//# sourceMappingURL=Array.js.map