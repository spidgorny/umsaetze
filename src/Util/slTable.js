"use strict";
exports.__esModule = true;
var _ = require('underscore');
var slTable = /** @class */ (function () {
    function slTable(data) {
        if (data === void 0) { data = []; }
        this.data = data;
        console.log('slTable', this.data.length);
    }
    slTable.prototype.toString = function () {
        var content = [];
        content.push('<table class="table">');
        content.push('<thead><tr>');
        this.getColumns().forEach(function (col) {
            content.push('<th>' + col.name + '</th>');
        });
        content.push('</tr></thead>');
        content.push('<tbody>');
        content.push(this.getRowsToString());
        content.push('</tbody>');
        content.push('</table>');
        return content.join("\n");
    };
    slTable.prototype.getColumns = function () {
        var thes = [];
        this.data.forEach(function (row) {
            thes = thes.concat(Object.keys(row));
        });
        thes = _.uniq(thes);
        //console.log(thes);
        var cols = [];
        thes.forEach(function (name) {
            cols.push({ name: name });
        });
        return cols;
    };
    slTable.prototype.getRowsToString = function () {
        var content = [];
        var columns = this.getColumns();
        this.data.forEach(function (row) {
            content.push('<tr>');
            columns.forEach(function (col) {
                content.push('<td>' + row[col.name] + '</td>');
            });
            content.push('</tr>');
        });
        return content.join("\n");
    };
    return slTable;
}());
exports["default"] = slTable;
//# sourceMappingURL=slTable.js.map