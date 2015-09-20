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
var Proxy = (function () {
    function Proxy(_decorator) {
        this._decorator = _decorator;
        this.restrictedProperties = Utils.Reflection.getAllPropertyNames(Function);
    }
    Proxy.prototype.byPrototype = function (parent, storage) {
        var self = this;
        function Proxy() {
            var _this = this;
            this._parent = Utils.Reflection.construct(parent, arguments);
            Object.getOwnPropertyNames(this._parent)
                .filter(function (name) { return name !== 'constructor' &&
                name !== 'prototype' &&
                (name in _this) === false &&
                (name in Proxy.prototype) === false; })
                .map(function (p) { return self.createStrategyInfo(_this._parent, _this, p); })
                .forEach(function (s) { return self.decorateProperty(s, storage); });
        }
        var source = parent.prototype;
        Utils.Reflection.getAllPropertyNames(source)
            .filter(function (name) { return name !== 'constructor' && name !== 'prototype'; })
            .map(function (p) { return self.createStrategyInfo(source, Proxy.prototype, p, '_parent'); })
            .forEach(function (s) { return self.decorateProperty(s, storage); });
        Object.getOwnPropertyNames(parent)
            .filter(function (name) { return self.restrictedProperties.indexOf(name) === -1; })
            .map(function (p) { return self.createStrategyInfo(parent, Proxy, p); })
            .forEach(function (s) { return self.decorateProperty(s, storage); });
        return Proxy;
    };
    Proxy.prototype.byInstance = function (parent, storage) {
        var _this = this;
        var result = Object.create({});
        Utils.Reflection.getAllPropertyNames(parent)
            .filter(function (name) { return name !== 'constructor'; })
            .map(function (p) { return _this.createStrategyInfo(parent, result, p); })
            .forEach(function (s) { return _this.decorateProperty(s, storage); });
        return result;
    };
    Proxy.prototype.decorateProperty = function (strategyInfo, storage) {
        var _this = this;
        var substitutes = [];
        if (storage) {
            var types = storage.getKnownTypes(strategyInfo.name);
            substitutes = storage.getSubstitutes(strategyInfo.name, types);
        }
        if (substitutes.length) {
            this.checkProxyCompatibility(strategyInfo.name, types, strategyInfo.type);
            substitutes.forEach(function (item) {
                strategyInfo.substitute = item;
                _this._decorator.wrap(strategyInfo);
            });
        }
        else {
            this._decorator.wrap(strategyInfo);
        }
    };
    Proxy.prototype.hasProperType = function (types, type) {
        var hasAny = types.indexOf(5 /* Any */) >= 0;
        var hasType = types.indexOf(type) >= 0;
        if ((types.length == 1 && hasAny) ||
            (types.length == 2 && hasAny && hasType) ||
            (types.length == 1 && hasType))
            return true;
        return false;
    };
    Proxy.prototype.checkProxyCompatibility = function (propertyName, types, propertyType) {
        switch (propertyType) {
            case 1 /* Method */:
                if (this.hasProperType(types, 1 /* Method */) === false)
                    throw this.combineError(propertyName, 'Method', types);
                break;
            case 2 /* Getter */:
                if (this.hasProperType(types, 2 /* Getter */) === false)
                    throw this.combineError(propertyName, 'Getter', types);
                break;
            case 3 /* Setter */:
                if (this.hasProperType(types, 3 /* Setter */) === false)
                    throw this.combineError(propertyName, 'Setter', types);
                break;
            case 4 /* FullProperty */:
                if (this.hasProperType(types, 4 /* GetterSetter */) === false &&
                    this.hasProperType(types, 2 /* Getter */) === false &&
                    this.hasProperType(types, 3 /* Setter */) === false)
                    throw this.combineError(propertyName, 'GetterSetter', types);
                break;
            case 5 /* Field */:
                if (this.hasProperType(types, 6 /* Field */) === false)
                    throw this.combineError(propertyName, 'Field', types);
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
    Proxy.prototype.combineError = function (propertyName, nativeTypeName, types) {
        var type = types.filter(function (t) { return t !== 5 /* Any */; })[0];
        var allTypes = {};
        allTypes[6 /* Field */] = 'Field';
        allTypes[2 /* Getter */] = 'Getter';
        allTypes[3 /* Setter */] = 'Setter';
        allTypes[1 /* Method */] = 'Method';
        allTypes[4 /* GetterSetter */] = 'GetterSetter';
        var typeName = allTypes[type];
        var message = ['Could not match proxy type and property type. Expected: "', nativeTypeName, '", Actual: "', typeName, '"'].join('');
        var error = new Exceptions.ProxyError(message);
        error.data = { method: propertyName, expected: nativeTypeName, actual: typeName };
        return error;
    };
    return Proxy;
})();
exports.Proxy = Proxy;
//# sourceMappingURL=proxy.js.map