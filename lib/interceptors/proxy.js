/// <reference path="../../d.ts/typeioc.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var DecoratorModule = require('./decorator');
var Proxy = (function () {
    function Proxy() {
    }
    Proxy.prototype.fromPrototype = function (parent, storage) {
        Utils.checkNullArgument(parent, 'parent');
        function Proxy() {
            this._parent = Utils.Reflection.construct(parent, arguments);
            for (var p in this._parent) {
                if ((p in this) == false) {
                    this[p] = this._parent[p];
                }
            }
        }
        this.decorate(parent.prototype, Proxy.prototype, storage, '_parent');
        this.decorate(parent, Proxy, storage);
        return Proxy;
    };
    Proxy.prototype.decorate = function (source, destination, storage, contextName) {
        for (var p in source) {
            var decorator = new DecoratorModule.Decorator(p, source, destination, contextName);
            if (storage) {
                var types = storage.getKnownTypes(p);
                if (types.length) {
                    this.checkProxyCompatibility(p, types, decorator.propertyType);
                }
                storage.getSubstitutes(p, types).forEach(function (item) {
                    decorator.substitute = item;
                    decorator.wrap();
                });
            }
            decorator.wrap();
        }
    };
    Proxy.prototype.hasProperType = function (types, type) {
        var hasAny = types.indexOf(5 /* Any */) >= 0;
        var hasType = types.indexOf(type) >= 0;
        if ((types.length == 1 && hasAny) || (types.length == 2 && hasAny && hasType) || (types.length == 1 && hasType))
            return true;
        return false;
    };
    Proxy.prototype.getSubstitute = function (name, source, substitutes) {
        return substitutes.filter(function (item) {
            return item.method === name;
        })[0];
    };
    Proxy.prototype.checkProxyCompatibility = function (propertyName, types, propertyType) {
        switch (propertyType) {
            case 1 /* Method */:
                if (this.hasProperType(types, 1 /* Method */) === false)
                    throw this.combineError('Could not match proxy type and property type', propertyName, 1 /* Method */);
                break;
            case 2 /* Getter */:
                if (this.hasProperType(types, 2 /* Getter */) === false)
                    throw this.combineError('Could not match proxy type and property type', propertyName, 2 /* Getter */);
                break;
            case 3 /* Setter */:
                if (this.hasProperType(types, 3 /* Setter */) === false)
                    throw this.combineError('Could not match proxy type and property type', propertyName, 3 /* Setter */);
                break;
            case 4 /* FullProperty */:
                if (this.hasProperType(types, 4 /* GetterSetter */) === false && this.hasProperType(types, 2 /* Getter */) === false && this.hasProperType(types, 3 /* Setter */) === false)
                    throw this.combineError('Could not match proxy type and property type', propertyName, 4 /* GetterSetter */);
                break;
            case 5 /* Field */:
                if (this.hasProperType(types, 6 /* Field */) === false)
                    throw this.combineError('Could not match proxy type and property type', propertyName, 6 /* Field */);
                break;
        }
    };
    Proxy.prototype.combineError = function (message, propertyName, type) {
        var error = new Exceptions.ProxyError(message);
        error.data = { method: propertyName, type: type };
        return error;
    };
    return Proxy;
})();
exports.Proxy = Proxy;
//# sourceMappingURL=proxy.js.map