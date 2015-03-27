/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Decorator = (function () {
    function Decorator(_name, _source, _destination, _contextName) {
        this._name = _name;
        this._source = _source;
        this._destination = _destination;
        this._contextName = _contextName;
        this._descriptor = Utils.Reflection.getPropertyDescriptor(_source, _name);
        this._type = Utils.Reflection.getPropertyType(_name, _source, this._descriptor);
    }
    Object.defineProperty(Decorator.prototype, "propertyType", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Decorator.prototype, "substitute", {
        set: function (value) {
            this._substitute = value;
        },
        enumerable: true,
        configurable: true
    });
    Decorator.prototype.wrap = function () {
        var strategyStore = this._substitute ? this.defineWrapStrategies() : this.defineNonWrapStrategies();
        var strategy = strategyStore[this._type];
        strategy();
    };
    Decorator.prototype.defineNonWrapStrategies = function () {
        if (this._nonWrapStrategies)
            return this._nonWrapStrategies;
        var result = (this._nonWrapStrategies = {});
        var self = this;
        result[1 /* Method */] = function () {
            var value = self._source[self._name];
            self._destination[self._name] = function () {
                var args = Array.prototype.slice.call(arguments, 0);
                return value.apply(this, args);
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
        if (this._wrapStrategies)
            return this._wrapStrategies;
        var result = (this._wrapStrategies = {});
        var self = this;
        result[1 /* Method */] = function () {
            var value = self._source[self._name];
            self._destination[self._name] = function () {
                var destination = this;
                var args = Array.prototype.slice.call(arguments, 0);
                var delegate = function (args) { return value.apply(destination, args); };
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
            var getter = self._substitute.type === 5 /* Any */ || self._substitute.type === 4 /* GetterSetter */ || self._substitute.type === 2 /* Getter */ || self._substitute.type === 6 /* Field */ ? self.defineWrapGetter() : self.defineGetter();
            var setter = self._substitute.type === 5 /* Any */ || self._substitute.type === 4 /* GetterSetter */ || self._substitute.type === 3 /* Setter */ || self._substitute.type === 6 /* Field */ ? self.defineWrapSetter() : self.defineSetter();
            Object.defineProperty(self._destination, self._name, {
                get: getter,
                set: setter,
                configurable: self._descriptor.configurable,
                enumerable: self._descriptor.enumerable
            });
        };
        result[5 /* Field */] = result[4 /* FullProperty */];
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
        this.createCallAction(mainCallInfo, args, delegate, wrapperContext, this._substitute.next, callType);
        return this._substitute.wrapper.call(wrapperContext, mainCallInfo);
    };
    Decorator.prototype.createCallAction = function (callInfo, args, delegate, wrapperContext, substitute, callType) {
        if (!substitute)
            return;
        var self = this;
        var childCallInfo = this.createCallInfo(args.value, delegate, callType);
        callInfo.next = function (result) {
            childCallInfo.result = result;
            self.createCallAction(callInfo, args, delegate, wrapperContext, substitute.next, callType);
            return substitute.wrapper.call(wrapperContext, childCallInfo);
        };
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