/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Exceptions = require('../exceptions/index');
var Interceptor = (function () {
    function Interceptor(_proxy) {
        this._proxy = _proxy;
    }
    Interceptor.prototype.intercept = function (subject, substitutes) {
        var storage = this.transformSubstitutes(substitutes);
        this._proxy.fromPrototype(subject, storage);
    };
    Interceptor.prototype.transformSubstitutes = function (substitutes) {
        var _this = this;
        return substitutes.reduce(function (storage, current) {
            _this.addToStorage(storage, current);
            return storage;
        }, {
            known: {},
            unknown: {}
        });
    };
    Interceptor.prototype.addToStorage = function (storage, value) {
        var substitute = this.createSubstitute(value);
        var key = value.method;
        if (!key) {
            this.addToTypedStorage(storage.unknown, substitute);
            return;
        }
        var item = storage.known[key];
        if (!item) {
            item = {};
            storage.known[key] = item;
        }
        this.addToTypedStorage(item, substitute);
    };
    Interceptor.prototype.addToTypedStorage = function (storage, substitute) {
        var item = storage[substitute.type];
        if (!item) {
            item = {
                head: substitute,
                tail: substitute
            };
            storage[substitute.type] = item;
        }
        else {
            item.tail.next = substitute;
            item.tail = item.tail.next;
        }
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