/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var Types = require('../types/index');
var Decorator = (function () {
    function Decorator(_builder, _decoratorRegistrationApiSerice) {
        this._builder = _builder;
        this._decoratorRegistrationApiSerice = _decoratorRegistrationApiSerice;
    }
    Decorator.prototype.build = function () {
        return this._builder.build();
    };
    Decorator.prototype.provide = function (service) {
        var _this = this;
        var register = function (api) {
            return function (target) {
                if (!Utils.Reflection.isPrototype(target)) {
                    var error = new Exceptions.DecoratorError("Decorator target not supported, not a prototype");
                    error.data = { target: target };
                    throw error;
                }
                var containerBuilder = api.builder || _this._builder;
                var registration = containerBuilder
                    .register(service)
                    .asType(target);
                var initializer = api.initializedBy;
                if (initializer)
                    registration.initializeBy(initializer);
                var disposer = api.disposedBy;
                if (disposer)
                    registration.dispose(disposer);
                var name = api.name;
                if (name)
                    registration.named(name);
                var scope = api.scope || Types.Defaults.Scope;
                registration.within(scope);
                var owner = api.owner || Types.Defaults.Owner;
                registration.ownedBy(owner);
                return target;
            };
        };
        var api = this._decoratorRegistrationApiSerice.createRegistration(register);
        return api.provide(service);
    };
    Decorator.prototype.by = function (service) {
        var resolve = function (api) {
            return function (target, key, index) {
                var key = Utils.Reflection.ReflectionKey;
                var bucket = target[key];
                if (!bucket)
                    bucket = target[key] = {};
                bucket[index] = {
                    service: api.service,
                    args: api.args,
                    attempt: api.attempt,
                    name: api.name,
                    cache: api.cache,
                    container: api.container
                };
            };
        };
        var api = this._decoratorRegistrationApiSerice.createResolution(resolve);
        return api.by(service);
    };
    Decorator.prototype.resolveValue = function (value) {
        return function (target, key, index) {
            var key = Utils.Reflection.ReflectionKey;
            var bucket = target[key];
            if (!bucket)
                bucket = target[key] = {};
            bucket.args[index] = {
                value: value
            };
        };
    };
    return Decorator;
})();
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map