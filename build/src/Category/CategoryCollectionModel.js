"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
class CategoryCollectionModel extends Backbone.Model {
    constructor(collection, options = {}) {
        super({}, options);
        this.innerCollection = collection;
    }
    getCollection() {
        return this.innerCollection;
    }
}
exports.default = CategoryCollectionModel;
//# sourceMappingURL=CategoryCollectionModel.js.map