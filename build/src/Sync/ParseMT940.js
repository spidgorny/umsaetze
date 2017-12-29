"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParseMT940 {
    constructor(data) {
        this.data = String.fromCharCode.apply(null, data);
    }
    parseAndNormalize() {
        console.log(this.data);
        let lines = this.data.split(/[\r\n]+/);
        this.data = null;
        let tag;
        let data;
        let flow = [];
        lines.forEach((row) => {
            let parts = row.match(/:([^:]+):(.+)/);
            if (parts.length == 3) {
                if (tag) {
                    flow.push({
                        tag: tag,
                        data: data,
                    });
                }
                tag = parts[1];
                data = parts[2];
            }
            else {
                data += row;
            }
        });
        if (tag) {
            flow.push({
                tag: tag,
                data: data,
            });
        }
        console.log(flow);
        return flow;
    }
}
exports.default = ParseMT940;
//# sourceMappingURL=ParseMT940.js.map