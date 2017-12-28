"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
class SLTable {
    constructor(data = []) {
        this.data = data;
        console.log('SLTable', this.data.length);
    }
    toString() {
        let content = [];
        content.push('<table class="table">');
        content.push('<thead><tr>');
        this.getColumns().forEach(col => {
            content.push('<th>' + col.name + '</th>');
        });
        content.push('</tr></thead>');
        content.push('<tbody>');
        content.push(this.getRowsToString());
        content.push('</tbody>');
        content.push('</table>');
        return content.join("\n");
    }
    getColumns() {
        let thes = [];
        this.data.forEach(row => {
            thes = thes.concat(Object.keys(row));
        });
        thes = _.uniq(thes);
        let cols = [];
        thes.forEach(name => {
            cols.push({ name: name });
        });
        return cols;
    }
    getRowsToString() {
        let content = [];
        const columns = this.getColumns();
        this.data.forEach(row => {
            content.push('<tr>');
            columns.forEach(col => {
                content.push('<td>' + row[col.name] + '</td>');
            });
            content.push('</tr>');
        });
        return content.join("\n");
    }
}
exports.default = SLTable;
//# sourceMappingURL=SLTable.js.map