/// <reference path="../../d.ts/typeioc.internal.d.ts" />
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
                var _this = this;
                var args = Array.prototype.slice.call(arguments, 0);
                var delegate = function (args) { return self._contextName ? value.apply(_this[self._contextName], args) : value.apply(self._source, args); };
                return self.createCallChainFromList(Utils.createImmutable(args), delegate, this);
            };
        };
        result[2 /* Getter */] = function () {
            Object.defineProperty(self._destination, self._name, {
                get: self.defineWrapGetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable
            });
        };
        result[3 /* Setter */] = function () {
            Object.defineProperty(self._destination, self._name, {
                set: self.defineWrapSetter(),
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable
            });
        };
        result[4 /* FullProperty */] = function () {
            var getter = self._substitute.type === 5 /* Any */ || self._substitute.type === 4 /* GetterSetter */ || self._substitute.type === 2 /* Getter */ ? self.defineWrapGetter() : self.defineGetter();
            var setter = self._substitute.type === 5 /* Any */ || self._substitute.type === 4 /* GetterSetter */ || self._substitute.type === 3 /* Setter */ ? self.defineWrapSetter() : self.defineSetter();
            Object.defineProperty(self._destination, self._name, {
                get: getter,
                set: setter,
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable
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
            var delegate = self.defineSetter().bind(this);
            return self.createCallChainFromList(Utils.createImmutable([value]), delegate, this, 3 /* Setter */);
        };
    };
    Decorator.prototype.defineWrapGetter = function () {
        var self = this;
        return function () {
            var delegate = self.defineGetter().bind(this);
            return self.createCallChainFromList(Utils.createImmutable([]), delegate, this, 2 /* Getter */);
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
    Decorator.prototype.createCallChainFromList = function (args, delegate, wrapperContext, callType) {
        var mainCallInfo = this.createCallInfo(args.value, delegate, callType);
        var currentCallInfo = mainCallInfo;
        var nextWrapper = this._substitute.next;
        while (nextWrapper) {
            var childCallInfo = this.createCallInfo(args.value, delegate, callType);
            var wrapper = nextWrapper.wrapper;
            currentCallInfo.next = function (result) {
                childCallInfo.result = result;
                return wrapper.call(wrapperContext, childCallInfo);
            };
            currentCallInfo = childCallInfo;
            nextWrapper = nextWrapper.next;
        }
        return this._substitute.wrapper.call(wrapperContext, mainCallInfo);
    };
    Decorator.prototype.createCallInfo = function (args, delegate, callType) {
        var getter = delegate;
        var setter = delegate;
        return {
            name: this._name,
            args: args,
            type: callType || this._substitute.type,
            invoke: delegate,
            get: callType === 2 /* Getter */ ? getter : null,
            set: callType === 3 /* Setter */ ? setter : null
        };
    };
    return Decorator;
})();
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map