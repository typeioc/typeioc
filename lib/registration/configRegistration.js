/// <reference path="../t.d.ts/enums.d.ts" />
/// <reference path="../t.d.ts/container.d.ts" />
/// <reference path="../t.d.ts/registration.d.ts" />
/// <reference path="../t.d.ts/configuration.d.ts" />
"use strict";

var BaseRegistrationModule = require("./registrationBase");
var MultiRegistrationsModule = require("./moduleRegistration");
var ExceptionsModule = require('../exceptions');
var Utils = require('../utils');


var ConfigRegistration = (function () {
    function ConfigRegistration(config) {
        this._config = config;
    }
    Object.defineProperty(ConfigRegistration.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        set: function (value) {
            this._scope = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(ConfigRegistration.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        set: function (value) {
            this._owner = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(ConfigRegistration.prototype, "registrations", {
        get: function () {
            var result = this.createComponentRegistrations(this._config.components);
            var moduleRegoes = this.createModuleRegistrations(this._config);

            return result.concat(moduleRegoes);
        },
        enumerable: true,
        configurable: true
    });

    ConfigRegistration.prototype.createComponentRegistrations = function (components, serviceModule, resolverModule) {
        if (!components)
            return [];

        var self = this;

        return components.map(function (item) {
            return self.registerComponent(item, serviceModule, resolverModule);
        });
    };

    ConfigRegistration.prototype.createModuleRegistrations = function (config) {
        var result = [];

        if (!config.modules)
            return result;

        var self = this;

        config.modules.forEach(function (item) {
            var regoes = self.createModule(item);

            result.push.apply(result, regoes);
        });

        return result;
    };

    ConfigRegistration.prototype.createModule = function (configModule) {
        var result = [];

        if (configModule.components) {
            var componentRegos = this.createComponentRegistrations(configModule.components, configModule.serviceModule, configModule.resolverModule);
            result.push.apply(result, componentRegos);
        }

        if (configModule.serviceModule && configModule.resolverModule && configModule.forModule !== false) {
            var regoBase = new BaseRegistrationModule.RegistrationBase(configModule.serviceModule);
            var moduleRegistration = new MultiRegistrationsModule.ModuleRegistration(regoBase);

            var mRego = moduleRegistration.getAsModuleRegistration();
            var asResolver = mRego.as(configModule.resolverModule);

            if (configModule.within) {
                asResolver.within(configModule.within);
            } else {
                asResolver.within(this._scope);
            }

            if (configModule.ownedBy) {
                asResolver.ownedBy(configModule.ownedBy);
            } else {
                asResolver.ownedBy(this._owner);
            }

            if (configModule.forInstances) {
                var self = this;

                configModule.forInstances.forEach(function (forInstance) {
                    var resolver = self.getComponent(forInstance.resolver, configModule.resolverModule);

                    var params = forInstance.parameters || [];
                    var factory = forInstance.factory || self.getInstantiation(resolver, params, configModule.resolverModule);

                    asResolver.for(resolver, factory);
                });
            }

            var regoes = moduleRegistration.registrations;
            result.push.apply(result, regoes);
        }

        return result;
    };

    ConfigRegistration.prototype.registerComponent = function (component, serviceModule, resolverModule) {
        var service = this.getComponent(component.service, serviceModule);

        var result = new BaseRegistrationModule.RegistrationBase(service);

        if (component.named) {
            result.name = component.named;
        }

        var params = component.parameters || [];

        if (component.factory) {
            result.factory = component.factory;
        } else {
            var resolver = this.getComponent(component.resolver, resolverModule);
            result.factory = this.getInstantiation(resolver, params, resolverModule);
        }

        result.scope = component.within !== undefined ? component.within : this._scope;
        result.owner = component.ownedBy !== undefined ? component.ownedBy : this._owner;

        if (component.initializeBy) {
            result.initializer = component.initializeBy;
        }

        return result;
    };

    ConfigRegistration.prototype.getComponent = function (instanceLocation, moduleInstance) {
        if (!instanceLocation.name)
            throw new ExceptionsModule.ArgumentNullError('Missing component name');

        if (instanceLocation.instanceModule) {
            return instanceLocation.instanceModule[instanceLocation.name];
        }

        if (moduleInstance) {
            return moduleInstance[instanceLocation.name];
        }

        throw new ExceptionsModule.ConfigError('Unable to load component : ' + instanceLocation.name);
    };

    ConfigRegistration.prototype.getInstantiation = function (resolver, parameters, moduleInstance) {
        var _this = this;
        return function (c) {
            var instances = parameters.map(function (item) {
                if (item.instance)
                    return item.instance;

                if (!item.location)
                    throw new ExceptionsModule.ConfigError('Missing components location');

                var component = _this.getComponent(item.location, moduleInstance);

                return item.isDependency ? c.resolve(component) : new component();
            });

            return Utils.construct(resolver, instances);
        };
    };
    return ConfigRegistration;
})();
exports.ConfigRegistration = ConfigRegistration;

//# sourceMappingURL=configRegistration.js.map
