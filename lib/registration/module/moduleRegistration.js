/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../../d.ts/typeioc.internal.d.ts" />
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
class ModuleRegistration {
    constructor(_base, _internalStorage, _registrationBaseService) {
        this._base = _base;
        this._internalStorage = _internalStorage;
        this._registrationBaseService = _registrationBaseService;
    }
    get registrations() {
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
                if (utils_1.Reflection.isCompatible(asValue.prototype, srValue.prototype)) {
                    var rego = self.createRegistration({
                        service: srValue,
                        substitute: asValue
                    });
                    result.push(rego);
                }
            });
        });
        return result;
    }
    getAsModuleRegistration() {
        var self = this;
        return {
            as: self.as.bind(self)
        };
    }
    as(asModule) {
        this._asModule = asModule;
        return this.asModuleInitializedReusedOwned();
    }
    within(scope) {
        var self = this;
        self._base.scope = scope;
        return {
            ownedBy: self.ownedBy.bind(self),
            ownedInternally: this.ownedInternally.bind(this),
            ownedExternally: this.ownedExternally.bind(this)
        };
    }
    ownedBy(owner) {
        this._base.owner = owner;
    }
    ownedInternally() {
        this.ownedBy(1 /* Container */);
    }
    ownedExternally() {
        this.ownedBy(2 /* Externals */);
    }
    forService(service, factory) {
        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = factory;
        return this.asModuleInitializedReusedOwned();
    }
    forArgs(service, ...args) {
        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = () => utils_1.Reflection.construct(service, args);
        return this.asModuleInitializedReusedOwned();
    }
    named(service, name) {
        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.name = name;
        return this.asModuleInitializedReusedOwned();
    }
    createRegistration(data) {
        var rego = this._registrationBaseService.create(data.service);
        var options = this._internalStorage.register(data.substitute, this.emptyRegoOptionsEntry);
        var factory = () => {
            var k = data.substitute;
            return new k();
        };
        rego.factory = options.factory || factory;
        rego.name = options.name;
        rego.scope = this._base.scope;
        rego.owner = this._base.owner;
        return rego;
    }
    asModuleInitializedReusedOwned() {
        var self = this;
        return {
            within: self.within.bind(self),
            ownedBy: self.ownedBy.bind(self),
            forService: self.forService.bind(self),
            forArgs: self.forArgs.bind(self),
            named: self.named.bind(self),
            ownedInternally: self.ownedInternally.bind(self),
            ownedExternally: self.ownedExternally.bind(self)
        };
    }
    emptyRegoOptionsEntry() {
        return {
            factory: null,
            name: null
        };
    }
}
exports.ModuleRegistration = ModuleRegistration;
//# sourceMappingURL=moduleRegistration.js.map