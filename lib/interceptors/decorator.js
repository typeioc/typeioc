/// <reference path="../../d.ts/typeioc.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Decorator = (function () {
    function Decorator(_name, _source, _destination, _substitute, _contextName) {
        this._name = _name;
        this._source = _source;
        this._destination = _destination;
        this._substitute = _substitute;
        this._contextName = _contextName;
        this._descriptor = Object.getOwnPropertyDescriptor(_source, _name);
        this._type = Utils.Reflection.getPropertyType(_name, _source, this._descriptor);
    }
    Object.defineProperty(Decorator.prototype, "propertyType", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Decorator.prototype.wrap = function () {
        var strategyStore = this.defineWrapStrategies();
        var strategy = strategyStore[this._type];
        strategy();
    };
    Decorator.prototype.nonWrap = function () {
        var strategyStore = this.defineNonWrapStrategies();
        var strategy = strategyStore[this._type];
        strategy();
    };
    Decorator.prototype.defineNonWrapStrategies = function () {
        var result = {};
        var self = this;
        result[1 /* Method */] = function () {
            var value = self._source[self._name];
            self._destination[self._name] = function () {
                var args = Array.prototype.slice.call(arguments, 0);
                var delegate = self._contextName ? value.bind(this[self._contextName]) : value.bind(self._source);
                return delegate.apply(this, args);
            };
        };
        result[2 /* Getter */] = function () {
            Object.defineProperty(self._destination, self._name, {
                get: self.defineGetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable
            });
        };
        result[3 /* Setter */] = function () {
            Object.defineProperty(self._destination, self._name, {
                set: self.defineSetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable
            });
        };
        result[4 /* FullProperty */] = function () {
            Object.defineProperty(self._destination, self._name, {
                get: self.defineGetter(),
                set: self.defineSetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable
            });
        };
        result[5 /* Field */] = result[4 /* FullProperty */];
        return result;
    };
    Decorator.prototype.defineWrapStrategies = function () {
        var _this = this;
        var result = {};
        var self = this;
        result[1 /* Method */] = function () {
            var value = self._source[self._name];
            self._destination[self._name] = function () {
                var args = Array.prototype.slice.call(arguments, 0);
                var delegate = self._contextName ? value.bind(this[self._contextName]) : value.bind(self._source);
                return self.createCallChainFromList(args, delegate, this);
            };
        };
        result[2 /* Getter */] = function () {
            Object.defineProperty(self._destination, self._name, {
                get: self.defineWrapGetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable,
                value: self._descriptor.value,
                writable: self._descriptor.writable
            });
        };
        result[3 /* Setter */] = function () {
            Object.defineProperty(self._destination, self._name, {
                set: self.defineWrapSetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable,
                value: self._descriptor.value,
                writable: self._descriptor.writable
            });
        };
        result[4 /* FullProperty */] = function () {
            Object.defineProperty(self._destination, self._name, {
                get: self.defineWrapGetter(),
                set: self.defineWrapSetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable,
                value: self._descriptor.value,
                writable: self._descriptor.writable
            });
        };
        result[5 /* Field */] = function () {
            self._destination[self._name] = self._contextName ? _this[self._contextName][name] : self._source[name];
        };
        return result;
    };
    Decorator.prototype.defineWrapSetter = function () {
        var self = this;
        return function (value) {
            var delegate = self.defineGetter();
            return self.createCallChainFromList([value], delegate, this);
        };
    };
    Decorator.prototype.defineWrapGetter = function () {
        var self = this;
        return function () {
            var delegate = self.defineGetter();
            return self.createCallChainFromList([], delegate, this);
        };
    };
    Decorator.prototype.defineGetter = function () {
        var self = this;
        return function () {
            return self._contextName ? this[self._contextName][self._name] : self._source[self._name];
        };
    };
    Decorator.prototype.defineSetter = function () {
        var self = this;
        return function (argValue) {
            if (self._contextName) {
                this[self._contextName][self._name] = argValue;
            }
            else {
                self._source[self._name] = argValue;
            }
        };
    };
    Decorator.prototype.createCallChainFromList = function (args, delegate, wrapperContext) {
        var callInfo = this.createCallInfo(args, delegate);
        this.createNextInChain(callInfo, delegate, wrapperContext, this._substitute.next);
        return this._substitute.wrapper.call(wrapperContext, callInfo);
    };
    Decorator.prototype.createNextInChain = function (parent, delegate, wrapperContext, parentSubstitute) {
        var _this = this;
        if (!parentSubstitute)
            return undefined;
        parent.next = function () {
            var callInfo = _this.createCallInfo(parent.args, delegate);
            _this.createNextInChain(callInfo, delegate, wrapperContext, parentSubstitute.next);
            return parentSubstitute.wrapper.call(wrapperContext, callInfo);
        };
    };
    Decorator.prototype.createCallInfo = function (args, delegate) {
        var getter = delegate;
        var setter = delegate;
        return {
            name: this._name,
            args: args,
            type: this._substitute.type,
            invoke: delegate,
            get: this._substitute.type === 2 /* Getter */ ? getter : null,
            set: this._substitute.type === 3 /* Setter */ ? setter : null
        };
    };
    return Decorator;
})();
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map