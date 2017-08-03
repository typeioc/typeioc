/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const substituteStorage_1 = require("./substituteStorage");
class Interceptor {
    constructor(_proxy) {
        this._proxy = _proxy;
    }
    interceptPrototype(subject, substitutes) {
        return this.intercept(subject, substitutes);
    }
    interceptInstance(subject, substitutes) {
        return this.intercept(subject, substitutes);
    }
    intercept(subject, substitutes) {
        utils_1.checkNullArgument(subject, 'subject');
        var data = substitutes;
        if (data && !utils_1.Reflection.isArray(data)) {
            data = [substitutes];
        }
        var storage = data ? this.transformSubstitutes(data) : null;
        var result;
        var argument = subject;
        if (utils_1.Reflection.isPrototype(argument)) {
            result = this._proxy.byPrototype(argument, storage);
        }
        else if (utils_1.Reflection.isObject(argument)) {
            result = this._proxy.byInstance(argument, storage);
        }
        else {
            throw new exceptions_1.ArgumentError('subject', 'Subject should be a prototype function or an object');
        }
        return result;
    }
    transformSubstitutes(substitutes) {
        var storage = new substituteStorage_1.SubstituteStorage();
        return substitutes.reduce((storage, current) => {
            var substitute = this.createSubstitute(current);
            storage.add(substitute);
            return storage;
        }, storage);
    }
    createSubstitute(value) {
        if (!value.wrapper) {
            var error = new exceptions_1.ArgumentError('wrapper', 'Missing interceptor wrapper');
            error.data = value;
            throw error;
        }
        return {
            method: value.method,
            type: value.type || 5 /* Any */,
            wrapper: value.wrapper,
            next: null
        };
    }
}
exports.Interceptor = Interceptor;
//# sourceMappingURL=interceptor.js.map