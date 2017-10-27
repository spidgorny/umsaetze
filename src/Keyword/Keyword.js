var Keyword = (function () {
    function Keyword(attributes) {
        if (!attributes.word) {
            throw new Error('no word in keyword');
        }
        this.word = attributes.word;
        if (!attributes.category) {
            throw new Error('no word in keyword');
        }
        this.category = attributes.category;
    }
    return Keyword;
}());
export default Keyword;
//# sourceMappingURL=Keyword.js.map