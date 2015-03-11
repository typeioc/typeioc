/// <reference path="../../d.ts/typeioc.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var DecoratorModule = require('./decorator');
var Proxy = (function () {
    function Proxy() {
    }
    Proxy.prototype.fromPrototype = function (parent, substitutes) {
        Utils.checkNullArgument(parent, 'parent');
        substitutes = substitutes || [];
        function Proxy() {
            this._parent = Utils.Reflection.construct(parent, arguments);
        }
        this.decorate(parent.prototype, Proxy.prototype, substitutes, '_parent');
        this.decorate(parent, Proxy, substitutes);
        return Proxy;
    };
    Proxy.prototype.decorate = function (source, destination, substitutes, contextName) {
        for (var p in source) {
            var substitute = this.getSubstitute(p, source, substitutes);
            var decorator = new DecoratorModule.Decorator(p, source, destination, substitute, contextName);
            if (substitute) {
                this.checkProxyCompatibility(p, substitute, decorator.propertyType);
                decorator.wrap();
            }
            else {
                decorator.nonWrap();
            }
        }
    };
    Proxy.prototype.getSubstitute = function (name, source, substitutes) {
        return substitutes.filter(function (item) {
            var method = item.method;
            if (Utils.Reflection.isFunction(method)) {
                return source[name] === item.method;
            }
            return method === name;
        })[0];
    };
    Proxy.prototype.checkProxyCompatibility = function (propertyName, substitute, propertyType) {
        if (propertyType === 5 /* Field */)
            throw this.combineError('Unable to create proxy for a field', propertyName, substitute.type);
        if (Utils.Reflection.isFunction(substitute.wrapper)) {
            this.checkWrapperDelegate(propertyName, substitute, propertyType);
            return;
        }
        this.checkWrapperInstance(propertyName, substitute, propertyType);
    };
    Proxy.prototype.checkWrapperDelegate = function (propertyName, substitute, propertyType) {
        var type = substitute.type;
        if (type === 5 /* Any */)
            return;
        if ((propertyType === 1 /* Method */ && type !== 1 /* Method */) || (propertyType === 2 /* Getter */ && type !== 2 /* Getter */) || (propertyType === 3 /* Setter */ && type !== 3 /* Setter */) || (propertyType === 4 /* FullProperty */ && type !== 2 /* Getter */ && type !== 3 /* Setter */ && type !== 4 /* GetterSetter */)) {
            throw this.combineError('Could not match proxy type and property type', propertyName, type);
        }
    };
    Proxy.prototype.checkWrapperInstance = function (propertyName, substitute, propertyType) {
        var type = substitute.type;
        var wrapper = substitute.wrapper;
        if (!wrapper.getter && !wrapper.setter)
            throw this.combineError('Substitute wrapper instance should have at least one of (getter, setter)', propertyName, type);
        if (wrapper.getter && wrapper.setter) {
            if (type != 5 /* Any */ && type != 4 /* GetterSetter */) {
                throw this.combineError('When both getter and setter are specified, substitute type should be (undefined, Any or GetterSetter)', propertyName, type);
            }
        }
        if (wrapper.getter && !wrapper.setter) {
            if (type != 5 /* Any */ && type != 2 /* Getter */) {
                throw this.combineError('When getter is specified, substitute type should be (undefined, Any or Getter)', propertyName, type);
            }
        }
        if (!wrapper.getter && wrapper.setter) {
            if (type != 5 /* Any */ && type != 3 /* Setter */) {
                throw this.combineError('When setter is specified, substitute type should be (undefined, Any or Setter)', propertyName, type);
            }
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