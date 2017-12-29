var Backbone;
(function (Backbone) {
    default class Singleton {
        getInstance() {
            if (this._instance === undefined) {
                this._instance = new this();
            }
            return this._instance;
        }
    }
    Backbone.Singleton = Singleton;
})(Backbone || (Backbone = {}));
//# sourceMappingURL=Singleton.js.map