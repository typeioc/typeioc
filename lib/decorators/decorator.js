/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () -
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var Decorator = (function () {
    function Decorator(_builder) {
        this._builder = _builder;
    }
    Decorator.prototype.build = function () {
        return this._builder.build();
    };
    Decorator.prototype.register = function (service, builder) {
        var _this = this;
        return function (target) {
            if (!Utils.Reflection.isPrototype(target)) {
                var error = new Exceptions.DecoratorError("Decorator target not supported, not a prototype");
                error.data = { target: target };
                throw error;
            }
            var factory = function () { return target; };
            var containerBuilder = builder || _this._builder;
            var registration = containerBuilder.register(service);
            registration.as(factory);
            //this.addRegistrationOptions(registration, options);
            return target;
        };
    };
    Decorator.prototype.addRegistrationOptions = function (registration, options) {
        if (!options)
            return;
        Object.keys(options).forEach(function (item) {
            var option = options[item];
            registration[item](options[item]);
        });
    };
    Decorator.prototype.resolve = function () {
        var key = 'typeioc';
        return function (target, key, index) {
            var params = Utils.Reflection.getParamNames(target);
            var bucket = target[key];
            if (!bucket) {
                bucket = target[key] = {
                    args: []
                };
            }
            bucket.args[index] = { name: params[index] };
        };
    };
    return Decorator;
})();
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map