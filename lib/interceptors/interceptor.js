/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/typeioc.addons.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var SubstituteStorageModule = require('./substituteStorage');
var Interceptor = (function () {
    function Interceptor(_proxy) {
        this._proxy = _proxy;
        this._storage = new SubstituteStorageModule.SubstituteStorage();
    }
    Interceptor.prototype.interceptPrototype = function (subject, substitutes) {
        return this.intercept(subject, substitutes);
    };
    Interceptor.prototype.interceptInstance = function (subject, substitutes) {
        return this.intercept(subject, substitutes);
    };
    Interceptor.prototype.intercept = function (subject, substitutes) {
        Utils.checkNullArgument(subject, 'subject');
        var storage = substitutes ? this.transformSubstitutes(substitutes) : null;
        var result;
        var argument = subject;
        if (Utils.Reflection.isPrototype(argument)) {
            result = this._proxy.byPrototype(argument, storage);
        }
        else if (Utils.Reflection.isObject(argument)) {
            result = this._proxy.byInstance(argument, storage);
        }
        else {
            throw new Exceptions.ArgumentError('subject', 'Subject should be a prototype function or an object');
        }
        return result;
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