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
class Proxy {
    constructor(_decorator) {
        this._decorator = _decorator;
        this.restrictedProperties = utils_1.Reflection.getAllPropertyNames(Function);
    }
    byPrototype(parent, storage) {
        var self = this;
        function Proxy() {
            this._parent = utils_1.Reflection.construct(parent, arguments);
            Object.getOwnPropertyNames(this._parent)
                .filter(name => name !== 'constructor' &&
                name !== 'prototype' &&
                (name in this) === false &&
                (name in Proxy.prototype) === false)
                .map(p => self.createStrategyInfo(this._parent, this, p))
                .forEach(s => self.decorateProperty(s, storage));
        }
        var source = parent.prototype;
        utils_1.Reflection.getAllPropertyNames(source)
            .filter(name => name !== 'constructor' && name !== 'prototype')
            .map(p => self.createStrategyInfo(source, Proxy.prototype, p, '_parent'))
            .forEach(s => self.decorateProperty(s, storage));
        Object.getOwnPropertyNames(parent)
            .filter(name => self.restrictedProperties.indexOf(name) === -1)
            .map(p => self.createStrategyInfo(parent, Proxy, p))
            .forEach(s => self.decorateProperty(s, storage));
        return Proxy;
    }
    byInstance(parent, storage) {
        var result = Object.create({});
        utils_1.Reflection.getAllPropertyNames(parent)
            .filter(name => name !== 'constructor')
            .map(p => this.createStrategyInfo(parent, result, p))
            .forEach(s => this.decorateProperty(s, storage));
        return result;
    }
    decorateProperty(strategyInfo, storage) {
        var substitutes = [];
        if (storage) {
            var types = storage.getKnownTypes(strategyInfo.name);
            substitutes = storage.getSubstitutes(strategyInfo.name, types);
        }
        if (substitutes.length) {
            this.checkProxyCompatibility(strategyInfo.name, types, strategyInfo.type);
            substitutes.forEach(item => {
                strategyInfo.substitute = item;
                this._decorator.wrap(strategyInfo);
            });
        }
        else {
            this._decorator.wrap(strategyInfo);
        }
    }
    hasProperType(types, type) {
        var hasAny = types.indexOf(5 /* Any */) >= 0;
        var hasType = types.indexOf(type) >= 0;
        if ((types.length == 1 && hasAny) ||
            (types.length == 2 && hasAny && hasType) ||
            (types.length == 1 && hasType))
            return true;
        return false;
    }
    checkProxyCompatibility(propertyName, types, propertyType) {
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
    }
    createStrategyInfo(source, destination, name, contextName) {
        var descriptor = utils_1.Reflection.getPropertyDescriptor(source, name);
        var propertyType = utils_1.Reflection.getPropertyType(name, descriptor);
        return {
            type: propertyType,
            descriptor: descriptor,
            substitute: null,
            name: name,
            source: source,
            destination: destination,
            contextName: contextName
        };
    }
    combineError(propertyName, nativeTypeName, types) {
        var type = types.filter(t => t !== 5 /* Any */)[0];
        var allTypes = {};
        allTypes[6 /* Field */] = 'Field';
        allTypes[2 /* Getter */] = 'Getter';
        allTypes[3 /* Setter */] = 'Setter';
        allTypes[1 /* Method */] = 'Method';
        allTypes[4 /* GetterSetter */] = 'GetterSetter';
        var typeName = allTypes[type];
        var message = ['Could not match proxy type and property type. Expected: "', nativeTypeName, '", Actual: "', typeName, '"'].join('');
        var error = new exceptions_1.ProxyError(message);
        error.data = { method: propertyName, expected: nativeTypeName, actual: typeName };
        return error;
    }
}
exports.Proxy = Proxy;
//# sourceMappingURL=proxy.js.map