/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../../utils/index');
var ModuleRegistration = (function () {
    function ModuleRegistration(_base, _internalStorage, _registrationBaseService) {
        this._base = _base;
        this._internalStorage = _internalStorage;
        this._registrationBaseService = _registrationBaseService;
    }
    Object.defineProperty(ModuleRegistration.prototype, "registrations", {
        get: function () {
            var self = this;
            var result = [];
            var serviceModule = this._base.service;
            var asModule = this._asModule;
            Object.getOwnPropertyNames(asModule).forEach(function (asPrperty) {
                var asValue = asModule[asPrperty];
                if (!(asValue instanceof Function))
                    return;
                Object.getOwnPropertyNames(serviceModule).forEach(function (srProperty) {
                    var srValue = serviceModule[srProperty];
                    if (!(srValue instanceof Function))
                        return;
                    if (Utils.Reflection.isCompatible(asValue.prototype, srValue.prototype)) {
                        var rego = self.createRegistration({
                            service: srValue,
                            substitute: asValue });
                        result.push(rego);
                    }
                });
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    ModuleRegistration.prototype.getAsModuleRegistration = function () {
        var self = this;
        return {
            as: self.as.bind(self)
        };
    };
    ModuleRegistration.prototype.as = function (asModule) {
        this._asModule = asModule;
        return this.asModuleInitializedReusedOwned();
    };
    ModuleRegistration.prototype.within = function (scope) {
        var self = this;
        self._base.scope = scope;
        return {
            ownedBy: self.ownedBy.bind(self)
        };
    };
    ModuleRegistration.prototype.ownedBy = function (owner) {
        this._base.owner = owner;
    };
    ModuleRegistration.prototype.forService = function (service, factory) {
        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = factory;
        return this.asModuleInitializedReusedOwned();
    };
    ModuleRegistration.prototype.forArgs = function (service) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = function () { return Utils.Reflection.construct(service, args); };
        return this.asModuleInitializedReusedOwned();
    };
    ModuleRegistration.prototype.named = function (service, name) {
        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.name = name;
        return this.asModuleInitializedReusedOwned();
    };
    ModuleRegistration.prototype.createRegistration = function (data) {
        var rego = this._registrationBaseService.create(data.service);
        var options = this._internalStorage.register(data.substitute, this.emptyRegoOptionsEntry);
        var factory = function () {
            var k = data.substitute;
            return new k();
        };
        rego.factory = options.factory || factory;
        rego.name = options.name;
        rego.scope = this._base.scope;
        rego.owner = this._base.owner;
        return rego;
    };
    ModuleRegistration.prototype.asModuleInitializedReusedOwned = function () {
        var self = this;
        return {
            within: self.within.bind(self),
            ownedBy: self.ownedBy.bind(self),
            forService: self.forService.bind(self),
            forArgs: self.forArgs.bind(self),
            named: self.named.bind(self)
        };
    };
    ModuleRegistration.prototype.emptyRegoOptionsEntry = function () {
        return {
            factory: null,
            name: null
        };
    };
    return ModuleRegistration;
})();
exports.ModuleRegistration = ModuleRegistration;
//# sourceMappingURL=moduleRegistration.js.map