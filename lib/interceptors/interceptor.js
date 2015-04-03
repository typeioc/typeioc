/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Exceptions = require('../exceptions/index');
var SubstituteStorageModule = require('./substituteStorage');
var Interceptor = (function () {
    function Interceptor(_proxy) {
        this._proxy = _proxy;
        this._storage = new SubstituteStorageModule.SubstituteStorage();
    }
    Interceptor.prototype.intercept = function (subject, substitutes) {
        var storage = this.transformSubstitutes(substitutes);
        this._proxy.fromPrototype(subject, storage);
    };
    Interceptor.prototype.transformSubstitutes = function (substitutes) {
        var _this = this;
        return substitutes.reduce(function (storage, current) {
            var substitute = _this.createSubstitute(current);
            _this._storage.add(substitute);
            return _this._storage;
        }, this._storage);
    };
    Interceptor.prototype.createSubstitute = function (value) {
        if (!value.wrapper) {
            var error = new Exceptions.ArgumentError('wrapper', 'Missing interceptor wrapper');
            error.data = value;
            throw error;
        }
        return {
            method: value.method,
            type: value.type || 5 /* Any */,
            wrapper: value.wrapper,
            next: null
        };
    };
    return Interceptor;
})();
exports.Interceptor = Interceptor;
//# sourceMappingURL=interceptor.js.map