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
const exceptions_1 = require("../../exceptions");
const utils_1 = require("../../utils");
class ConfigRegistration {
    constructor(_registrationBaseService, _moduleRegistrationService) {
        this._registrationBaseService = _registrationBaseService;
        this._moduleRegistrationService = _moduleRegistrationService;
    }
    get scope() {
        return this._scope;
    }
    set scope(value) {
        this._scope = value;
    }
    get owner() {
        return this._owner;
    }
    set owner(value) {
        this._owner = value;
    }
    get registrations() {
        var result = this.createComponentRegistrations(this._config.components);
        var moduleRegoes = this.createModuleRegistrations(this._config);
        return result.concat(moduleRegoes);
    }
    apply(config) {
        utils_1.checkNullArgument(config, 'config');
        this._config = config;
    }
    createComponentRegistrations(components, serviceModule, resolverModule) {
        if (!components)
            return [];
        var self = this;
        return components.map((item) => {
            return self.registerComponent(item, serviceModule, resolverModule);
        });
    }
    createModuleRegistrations(config) {
        var result = [];
        if (!config.modules)
            return result;
        var self = this;
        config.modules.forEach((item) => {
            var regoes = self.createModule(item);
            result.push.apply(result, regoes);
        });
        return result;
    }
    createModule(configModule) {
        var result = [];
        if (configModule.components) {
            var componentRegos = this.createComponentRegistrations(configModule.components, configModule.serviceModule, configModule.resolverModule);
            result.push.apply(result, componentRegos);
        }
        if (configModule.serviceModule &&
            configModule.resolverModule &&
            configModule.forModule !== false) {
            var regoBase = this._registrationBaseService.create(configModule.serviceModule);
            var moduleRegistration = this._moduleRegistrationService.create(regoBase);
            var mRego = moduleRegistration.getAsModuleRegistration();
            var asResolver = mRego.as(configModule.resolverModule);
            if (configModule.within) {
                asResolver.within(configModule.within);
            }
            else {
                asResolver.within(this.scope);
            }
            if (configModule.ownedBy) {
                asResolver.ownedBy(configModule.ownedBy);
            }
            else {
                asResolver.ownedBy(this.owner);
            }
            if (configModule.forInstances) {
                var self = this;
                configModule.forInstances.forEach((forInstance) => {
                    var resolver = self.getComponent(forInstance.resolver, configModule.resolverModule);
                    var params = forInstance.parameters || [];
                    var factory = forInstance.factory || self.getInstantiation(resolver, params, configModule.resolverModule);
                    asResolver.forService(resolver, factory);
                });
            }
            var regoes = moduleRegistration.registrations;
            result.push.apply(result, regoes);
        }
        return result;
    }
    registerComponent(component, serviceModule, resolverModule) {
        var service = this.getComponent(component.service, serviceModule);
        var result = this._registrationBaseService.create(service);
        if (component.named) {
            result.name = component.named;
        }
        var params = component.parameters || [];
        if (component.factory) {
            result.factory = component.factory;
        }
        else {
            var resolver = this.getComponent(component.resolver, resolverModule);
            result.factory = this.getInstantiation(resolver, params, resolverModule);
        }
        result.scope = component.within || this.scope;
        result.owner = component.ownedBy || this.owner;
        if (component.initializeBy) {
            result.initializer = component.initializeBy;
        }
        if (component.disposer) {
            result.disposer = component.disposer;
        }
        return result;
    }
    getComponent(instanceLocation, moduleInstance) {
        if (!instanceLocation.name) {
            var exception = new exceptions_1.ConfigurationError('Missing component name');
            exception.data = instanceLocation;
            throw exception;
        }
        var result;
        if (instanceLocation.instanceModule) {
            result = instanceLocation.instanceModule[instanceLocation.name];
            if (!result)
                throw new exceptions_1.ConfigurationError('Component not found within instance location : ' + instanceLocation.name);
            return result;
        }
        if (moduleInstance) {
            result = moduleInstance[instanceLocation.name];
            if (!result)
                throw new exceptions_1.ConfigurationError('Component not found within module instance : ' + instanceLocation.name);
            return result;
        }
        throw new exceptions_1.ConfigurationError('Unable to load component : ' + instanceLocation.name);
    }
    getInstantiation(resolver, parameters, moduleInstance) {
        return (c) => {
            var instances = parameters.map((item) => {
                if (item.instance)
                    return item.instance;
                if (!item.location)
                    throw new exceptions_1.ConfigurationError('Missing components location');
                var component = this.getComponent(item.location, moduleInstance);
                return item.isDependency === true ? c.resolve(component) : new component();
            });
            return utils_1.Reflection.construct(resolver, instances);
        };
    }
}
exports.ConfigRegistration = ConfigRegistration;
//# sourceMappingURL=configRegistration.js.map