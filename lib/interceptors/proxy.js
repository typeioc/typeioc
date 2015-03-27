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
        //substitutes = substitutes || [];
        function Proxy() {
            this._parent = Utils.Reflection.construct(parent, arguments);
            for (var p in this._parent) {
                if ((p in this) == false) {
                    this[p] = this._parent[p];
                }
            }
        }
        //this.decorate(parent.prototype, Proxy.prototype, substitutes, '_parent');
        //
        //this.decorate(parent, Proxy, substitutes);
        return Proxy;
    };
    Proxy.prototype.decorate = function (source, destination, substitutes, contextName) {
        for (var p in source) {
            var substitute = this.getSubstitute(p, source, substitutes);
            var decorator = new DecoratorModule.Decorator(p, source, destination, contextName);
            if (substitute) {
                this.checkProxyCompatibility(p, substitute, decorator.propertyType);
                decorator.substitute = substitute;
            }
            decorator.wrap();
        }
    };
    Proxy.prototype.getSubstitute = function (name, source, substitutes) {
        return substitutes.filter(function (item) {
            return item.method === name;
        })[0];
    };
    Proxy.prototype.checkProxyCompatibility = function (propertyName, substitute, propertyType) {
        var type = substitute.type;
        if (type === 5 /* Any */)
            return;
        if ((propertyType === 1 /* Method */ && type !== 1 /* Method */) || (propertyType === 2 /* Getter */ && type !== 2 /* Getter */) || (propertyType === 3 /* Setter */ && type !== 3 /* Setter */) || (propertyType === 4 /* FullProperty */ && type !== 2 /* Getter */ && type !== 3 /* Setter */ && type !== 4 /* GetterSetter */)) {
            throw this.combineError('Could not match proxy type and property type', propertyName, type);
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