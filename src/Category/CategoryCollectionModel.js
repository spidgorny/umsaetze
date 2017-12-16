"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
class CategoryCollectionModel extends Backbone.Model {
    constructor(collection, options) {
        super();
        options = options || {};
        options.innerCollection = collection;
    }
    getCollection() {
        return this.get('innerCollection');
    }
}
exports.default = CategoryCollectionModel;
//# sourceMappingURL=CategoryCollectionModel.js.map