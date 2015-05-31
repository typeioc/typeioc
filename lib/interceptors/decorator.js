/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/typeioc.addons.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Decorator = (function () {
    function Decorator() {
        this._wrapStrategies = this.defineWrapStrategies();
        this._nonWrapStrategies = this.defineNonWrapStrategies();
    }
    Decorator.prototype.wrap = function (strategyInfo) {
        strategyInfo = this.copyStrategy(strategyInfo);
        var strategyStore = strategyInfo.substitute ? this.defineWrapStrategies() : this.defineNonWrapStrategies();
        var strategy = strategyStore[strategyInfo.type];
        strategy(strategyInfo);
    };
    Decorator.prototype.defineNonWrapStrategies = function () {
        var result = {};
        var self = this;
        result[1 /* Method */] = function (strategyInfo) {
            var value = strategyInfo.source[strategyInfo.name];
            strategyInfo.destination[strategyInfo.name] = function () {
                var args = Array.prototype.slice.call(arguments, 0);
                return value.apply(this, args);
            };
        };
        result[2 /* Getter */] = function (strategyInfo) {
            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: self.defineGetter(strategyInfo),
                configurable: strategyInfo.descriptor.configurable,
                enumerable: strategyInfo.descriptor.enumerable
            });
        };
        result[3 /* Setter */] = function (strategyInfo) {
            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                set: self.defineSetter(strategyInfo),
                configurable: strategyInfo.descriptor.configurable,
                enumerable: strategyInfo.descriptor.enumerable
            });
        };
        result[4 /* FullProperty */] = function (strategyInfo) {
            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: self.defineGetter(strategyInfo),
                set: self.defineSetter(strategyInfo),
                configurable: strategyInfo.descriptor.configurable,
                enumerable: strategyInfo.descriptor.enumerable
            });
        };
        result[5 /* Field */] = result[4 /* FullProperty */];
        return result;
    };
    Decorator.prototype.defineWrapStrategies = function () {
        var result = {};
        var self = this;
        result[1 /* Method */] = function (strategyInfo) {
            var value = strategyInfo.source[strategyInfo.name];
            strategyInfo.destination[strategyInfo.name] = function () {
                var destination = this;
                var args = Array.prototype.slice.call(arguments, 0);
                var delegate = function (args) {
                    if (!args || !Utils.Reflection.isArray(args)) {
                        args = [args];
                    }
                    return value.apply(destination, args);
                };
                return self.createCallChainFromList({
                    args: Utils.createImmutable(args),
                    delegate: delegate,
                    wrapperContext: destination,
                    strategyInfo: strategyInfo
                });
            };
        };
        result[2 /* Getter */] = function (strategyInfo) {
            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: self.defineWrapGetter(strategyInfo),
                configurable: true,
                enumerable: strategyInfo.descriptor.enumerable
            });
        };
        result[3 /* Setter */] = function (strategyInfo) {
            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                set: self.defineWrapSetter(strategyInfo),
                configurable: true,
                enumerable: strategyInfo.descriptor.enumerable
            });
        };
        result[4 /* FullProperty */] = function (strategyInfo) {
            var getter = strategyInfo.substitute.type === 5 /* Any */ ||
                strategyInfo.substitute.type === 4 /* GetterSetter */ ||
                strategyInfo.substitute.type === 2 /* Getter */ ||
                strategyInfo.substitute.type === 6 /* Field */ ?
                self.defineWrapGetter(strategyInfo) : self.defineGetter(strategyInfo);
            var setter = strategyInfo.substitute.type === 5 /* Any */ ||
                strategyInfo.substitute.type === 4 /* GetterSetter */ ||
                strategyInfo.substitute.type === 3 /* Setter */ ||
                strategyInfo.substitute.type === 6 /* Field */ ?
                self.defineWrapSetter(strategyInfo) : self.defineSetter(strategyInfo);
            Object.defineProperty(strategyInfo.destination, strategyInfo.name, {
                get: getter,
                set: setter,
                configurable: true,
                enumerable: strategyInfo.descriptor.enumerable
            });
        };
        result[5 /* Field */] = result[4 /* FullProperty */];
        return result;
    };
    Decorator.prototype.defineWrapSetter = function (strategyInfo) {
        var self = this;
        return function (value) {
            var destination = this;
            var delegate = self.defineSetter(strategyInfo).bind(this);
            return self.createCallChainFromList({
                args: Utils.createImmutable([value]),
                delegate: delegate,
                wrapperContext: destination,
                callType: 3 /* Setter */,
                strategyInfo: strategyInfo
            });
        };
    };
    Decorator.prototype.defineWrapGetter = function (strategyInfo) {
        var self = this;
        return function () {
            var destination = this;
            var delegate = self.defineGetter(strategyInfo).bind(this);
            return self.createCallChainFromList({
                args: Utils.createImmutable([]),
                delegate: delegate,
                wrapperContext: destination,
                callType: 2 /* Getter */,
                strategyInfo: strategyInfo
            });
        };
    };
    Decorator.prototype.defineGetter = function (strategyInfo) {
        var self = this;
        return function () {
            return strategyInfo.contextName ? this[strategyInfo.contextName][strategyInfo.name]
                : strategyInfo.source[strategyInfo.name];
        };
    };
    Decorator.prototype.defineSetter = function (strategyInfo) {
        var self = this;
        return function (argValue) {
            if (strategyInfo.contextName) {
                this[strategyInfo.contextName][strategyInfo.name] = argValue;
            }
            else {
                strategyInfo.source[strategyInfo.name] = argValue;
            }
        };
    };
    Decorator.prototype.createCallChainFromList = function (info) {
        var mainCallInfo = this.createCallInfo(info);
        this.createCallAction(mainCallInfo, info.strategyInfo.substitute.next, info);
        return info.strategyInfo.substitute.wrapper.call(info.wrapperContext, mainCallInfo);
    };
    Decorator.prototype.createCallAction = function (callInfo, substitute, info) {
        if (!substitute)
            return;
        var self = this;
        var childCallInfo = this.createCallInfo(info);
        callInfo.next = function (result) {
            childCallInfo.result = result;
            self.createCallAction(childCallInfo, substitute.next, info);
            return substitute.wrapper.call(info.wrapperContext, childCallInfo);
        };
    };
    Decorator.prototype.createCallInfo = function (info) {
        var getter = info.delegate;
        var setter = info.delegate;
        return {
            name: info.strategyInfo.name,
            args: info.args.value,
            type: info.callType || info.strategyInfo.substitute.type,
            invoke: info.delegate,
            get: info.callType === 2 /* Getter */ ? getter : null,
            set: info.callType === 3 /* Setter */ ? setter : null
        };
    };
    Decorator.prototype.copyStrategy = function (strategyInfo) {
        return {
            type: strategyInfo.type,
            descriptor: strategyInfo.descriptor,
            substitute: strategyInfo.substitute,
            name: strategyInfo.name,
            source: strategyInfo.source,
            destination: strategyInfo.destination,
            contextName: strategyInfo.contextName
        };
    };
    return Decorator;
})();
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map