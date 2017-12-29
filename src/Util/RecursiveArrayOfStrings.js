"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RecursiveArrayOfStrings extends Array {
    static merge(content) {
        let output = [];
        if (typeof content == 'object') {
            content.forEach(sub => {
                if (Array.isArray(sub)) {
                    output.push(this.merge(sub));
                }
                else {
                    output.push(sub);
                }
            });
        }
        else {
            output.push(content);
        }
        return output.join('');
    }
}
exports.default = RecursiveArrayOfStrings;
//# sourceMappingURL=RecursiveArrayOfStrings.js.map