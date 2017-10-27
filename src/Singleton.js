var Backbone;
(function (Backbone) {
    var Singleton = (function () {
        function Singleton() {
        }
        Singleton.prototype.getInstance = function () {
            if (this._instance === undefined) {
                this._instance = new this();
            }
            return this._instance;
        };
        return Singleton;
    }());
    Backbone.Singleton = Singleton;
})(Backbone || (Backbone = {}));
//# sourceMappingURL=Singleton.js.map