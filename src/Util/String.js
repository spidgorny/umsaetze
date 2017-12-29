String.prototype.repeat = function (count) {
    let accu = '';
    for (let i = 0; i < count; i++) {
        accu += this.toString();
    }
    return accu;
};
//# sourceMappingURL=String.js.map