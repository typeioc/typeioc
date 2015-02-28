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
            var name = p;
            var substitute = substitutes.filter(function (item) {
                var method = item.method;
                if (Utils.Reflection.isFunction(method)) {
                    return source[name] === item.method;
                }
                return method === name;
            })[0];
            var decorator = new DecoratorModule.Decorator(name, source, destination, substitute, contextName);
            if (substitute) {
                this.checkProxyCompatibility(name, substitute.type, decorator.propertyType);
                decorator.wrap();
            }
            else {
                decorator.nonWrap();
            }
        }
    };
    Proxy.prototype.checkProxyCompatibility = function (propertyName, type, propertyType) {
        if (propertyType === 5 /* Field */) {
            var error = new Exceptions.ProxyError('Unable to create proxy for a field');
            error.data = { method: propertyName, type: type };
            throw error;
        }
        if ((type === 1 /* Method */ && propertyType !== 1 /* Method */) || (type === 2 /* Getter */ && propertyType !== 2 /* Getter */) || (type === 3 /* Setter */ && propertyType !== 3 /* Setter */) || (type === 4 /* GetterSetter */ && propertyType !== 4 /* FullProperty */)) {
            var error = new Exceptions.ProxyError('Could not match proxy type and property type');
            error.data = { method: propertyName, propertyType: propertyType, type: type };
            throw error;
        }
    };
    return Proxy;
})();
exports.Proxy = Proxy;
//# sourceMappingURL=proxy.js.map