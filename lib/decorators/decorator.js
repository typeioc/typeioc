/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
///<reference path="../../d.ts/typeioc.d.ts" />
///<reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var Exceptions = require('../exceptions/index');
var Types = require('../types/index');
var Decorator = (function () {
    function Decorator(_builderService, _internalContainerService, _decoratorRegistrationApiService, _internalStorageService) {
        this._builderService = _builderService;
        this._internalContainerService = _internalContainerService;
        this._decoratorRegistrationApiService = _decoratorRegistrationApiService;
        this._internalStorageService = _internalStorageService;
        this._internalStorage = this._internalStorageService.create();
        _internalContainerService.resolutionDetails = this._internalStorage;
        this._builder = _builderService.create(_internalContainerService);
    }
    Decorator.prototype.build = function () {
        return this._builder.build();
    };
    Decorator.prototype.provide = function (service) {
        var _this = this;
        var register = function (api) { return function (target) {
            if (!Utils.Reflection.isPrototype(target)) {
                var error = new Exceptions.DecoratorError("Decorator target not supported, not a prototype");
                error.data = { target: target };
                throw error;
            }
            var registration = _this._builder
                .register(api.service)
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
        }; };
        var api = this._decoratorRegistrationApiService.createRegistration(register);
        return api.provide(service);
    };
    Decorator.prototype.by = function (service) {
        var _this = this;
        var resolve = function (api) { return function (target, key, index) {
            if (!api.service) {
                var dependencies = Utils.Reflection.getMetadata(Reflect, target);
                api.service = dependencies[index];
            }
            var bucket = _this._internalStorage.register(target, function () { return {}; });
            bucket[index] = {
                service: api.service,
                args: api.args,
                attempt: api.attempt,
                name: api.name,
                cache: api.cache
            };
        }; };
        var api = this._decoratorRegistrationApiService.createResolution(resolve);
        return api.by(service);
    };
    Decorator.prototype.resolveValue = function (value) {
        var _this = this;
        return function (target, key, index) {
            var bucket = _this._internalStorage.register(target, function () { return {}; });
            bucket[index] = {
                value: value
            };
        };
    };
    return Decorator;
})();
exports.Decorator = Decorator;
//# sourceMappingURL=decorator.js.map