/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var Proxy = (function () {
    function Proxy(_decoratorService) {
        this._decoratorService = _decoratorService;
    }
    Proxy.prototype.byPrototype = function (parent, storage) {
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
    Proxy.prototype.byInstance = function (parent, storage) {
        var result = Object.create(null);
        this.decorate(parent, result, storage);
        return result;
    };
    Proxy.prototype.decorate = function (source, destination, storage, contextName) {
        var decorator = this._decoratorService.create();
        for (var p in source) {
            if (p === 'constructor')
                continue;
            var strategyInfo = this.createStrategyInfo(source, destination, p, contextName);
            var substitutes = [];
            if (storage) {
                var types = storage.getKnownTypes(p);
                substitutes = storage.getSubstitutes(p, types);
            }
            if (substitutes.length) {
                this.checkProxyCompatibility(p, types, strategyInfo.type);
                substitutes.forEach(function (item) {
                    strategyInfo.substitute = item;
                    decorator.wrap(strategyInfo);
                });
            }
            else {
                decorator.wrap(strategyInfo);
            }
        }
    };
    Proxy.prototype.hasProperType = function (types, type) {
        var hasAny = types.indexOf(5 /* Any */) >= 0;
        var hasType = types.indexOf(type) >= 0;
        if ((types.length == 1 && hasAny) || (types.length == 2 && hasAny && hasType) || (types.length == 1 && hasType))
            return true;
        return false;
    };
    Proxy.prototype.checkProxyCompatibility = function (propertyName, types, propertyType) {
        switch (propertyType) {
            case 1 /* Method */:
                if (this.hasProperType(types, 1 /* Method */) === false)
                    throw this.combineError('Could not match proxy type and property type for method', propertyName, 1 /* Method */);
                break;
            case 2 /* Getter */:
                if (this.hasProperType(types, 2 /* Getter */) === false)
                    throw this.combineError('Could not match proxy type and property type for getter', propertyName, 2 /* Getter */);
                break;
            case 3 /* Setter */:
                if (this.hasProperType(types, 3 /* Setter */) === false)
                    throw this.combineError('Could not match proxy type and property type for setter', propertyName, 3 /* Setter */);
                break;
            case 4 /* FullProperty */:
                if (this.hasProperType(types, 4 /* GetterSetter */) === false && this.hasProperType(types, 2 /* Getter */) === false && this.hasProperType(types, 3 /* Setter */) === false)
                    throw this.combineError('Could not match proxy type and property type for getter-setter', propertyName, 4 /* GetterSetter */);
                break;
            case 5 /* Field */:
                if (this.hasProperType(types, 6 /* Field */) === false)
                    throw this.combineError('Could not match proxy type and property type for field', propertyName, 6 /* Field */);
                break;
        }
    };
    Proxy.prototype.createStrategyInfo = function (source, destination, name, contextName) {
        var descriptor = Utils.Reflection.getPropertyDescriptor(source, name);
        var propertyType = Utils.Reflection.getPropertyType(name, descriptor);
        return {
            type: propertyType,
            descriptor: descriptor,
            substitute: null,
            name: name,
            source: source,
            destination: destination,
            contextName: contextName
        };
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