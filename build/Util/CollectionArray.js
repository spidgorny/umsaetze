"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simpleStorage = require('simplestorage.js');
const _ = require("underscore");
class CollectionArray extends Array {
    constructor(...arguments2) {
        super(...arguments2);
        this.models = [];
        this.name = this.constructor.prototype.name;
    }
    fetch() {
        let models = simpleStorage.get(this.name) || [];
        models.forEach((row) => {
            if (row) {
                let model = new this.modelClass(row);
                this.add(model);
            }
        });
    }
    add(model) {
        this.models.push(model);
        this.save();
    }
    save() {
        simpleStorage.set(this.name, this.models);
    }
    each(callback) {
        this.models.forEach((el) => {
            callback(el);
        });
    }
    getJSON() {
        return JSON.stringify(this.models, null, '\t');
    }
    size() {
        return this.models.length;
    }
    random() {
        return _.sample(this.models);
    }
    remove(id, idField = 'id') {
        console.log(this.models);
        let index = _.findIndex(this.models, el => {
            return el[idField] == id;
        });
        console.log('remove', id, index, idField);
        if (index > -1) {
            this.models.splice(index, 1);
        }
    }
}
exports.default = CollectionArray;
//# sourceMappingURL=CollectionArray.js.map