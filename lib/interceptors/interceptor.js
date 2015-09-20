/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/typeioc.addons.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var SubstituteStorageModule = require('./substituteStorage');
var Interceptor = (function () {
    function Interceptor(_proxy) {
        this._proxy = _proxy;
    }
    Interceptor.prototype.interceptPrototype = function (subject, substitutes) {
        return this.intercept(subject, substitutes);
    };
    Interceptor.prototype.interceptInstance = function (subject, substitutes) {
        return this.intercept(subject, substitutes);
    };
    Interceptor.prototype.intercept = function (subject, substitutes) {
        Utils.checkNullArgument(subject, 'subject');
        var data = substitutes;
        if (data && !Utils.Reflection.isArray(data)) {
            data = [substitutes];
        }
        var storage = data ? this.transformSubstitutes(data) : null;
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
        var storage = new SubstituteStorageModule.SubstituteStorage();
        return substitutes.reduce(function (storage, current) {
            var substitute = _this.createSubstitute(current);
            storage.add(substitute);
            return storage;
        }, storage);
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