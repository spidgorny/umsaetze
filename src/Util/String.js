String.prototype.repeat = function (count) {
    var accu = '';
    for (var i = 0; i < count; i++) {
        accu += this.toString();
    }
    return accu;
};
