// should not use =>
Array.prototype.average = function () {
    //console.log('average', this);
    if (this.length) {
        var sum = _.reduce(this, function (a, b) {
            return '' + (parseFloat(a) + parseFloat(b));
        });
        var avg = parseFloat(sum) / this.length;
        //console.log(totals, sum, avg);
        return avg.toFixed(2);
    }
    else {
        return null;
    }
};
//# sourceMappingURL=Array.js.map