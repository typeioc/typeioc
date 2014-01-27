/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/typeioc.d.ts" />
'use strict';
var RegistrationModule = require('./registrationBase');
var Utils = require('./utils');

var hashes = require('hashes');

var ModuleRegistration = (function () {
    function ModuleRegistration(baseRegistgration) {
        this._base = baseRegistgration;
        this._regoOptionsCollection = new hashes.HashTable();
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

                    if (Utils.isCompatible(asValue.prototype, srValue.prototype)) {
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

    ModuleRegistration.prototype.for = function (service, factory) {
        var options = this.getRegoOptionsEntry(service);
        options.factory = factory;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    };

    ModuleRegistration.prototype.forArgs = function (service) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        var options = this.getRegoOptionsEntry(service);

        var factory = function () {
            return Utils.construct(service, args);
        };

        options.factory = factory;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    };

    ModuleRegistration.prototype.named = function (service, name) {
        var options = this.getRegoOptionsEntry(service);
        options.name = name;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    };

    ModuleRegistration.prototype.createRegistration = function (data) {
        var rego = new RegistrationModule.RegistrationBase(data.service);

        var options = this.getRegoOptionsEntry(data.substitute);

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
            for: self.for.bind(self),
            forArgs: self.forArgs.bind(self),
            named: self.named.bind(self)
        };
    };

    ModuleRegistration.prototype.getRegoOptionsEntry = function (service) {
        return this._regoOptionsCollection.contains(service) ? this._regoOptionsCollection.get(service).value : { factory: null, name: null };
    };

    ModuleRegistration.prototype.addRegoOptionsEntry = function (service, options) {
        this._regoOptionsCollection.add(service, options, true);
    };
    return ModuleRegistration;
})();
exports.ModuleRegistration = ModuleRegistration;
