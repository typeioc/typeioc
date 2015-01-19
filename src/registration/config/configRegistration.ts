/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Exceptions = require('../../exceptions/index');
import Utils = require('../../utils/index');

export class ConfigRegistration implements Typeioc.Internal.IConfigRegistration {

    private _config : Typeioc.IConfig;
    private _scope : Typeioc.Types.Scope;
    private _owner : Typeioc.Types.Owner;

    public get scope() : Typeioc.Types.Scope {
        return this._scope;
    }

    public set scope(value : Typeioc.Types.Scope) {
        this._scope = value;
    }

    public get owner() : Typeioc.Types.Owner {
        return this._owner;
    }

    public set owner(value : Typeioc.Types.Owner) {
        this._owner = value;
    }

    public get registrations() : Typeioc.Internal.IRegistrationBase[] {

        var result = this.createComponentRegistrations(this._config.components);
        var moduleRegoes = this.createModuleRegistrations(this._config);

        return result.concat(moduleRegoes);
    }

    constructor(
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                private _moduleRegistrationService : Typeioc.Internal.IModuleRegistrationService) {
    }

    public apply(config : Typeioc.IConfig) {

        if(!config)
            throw new Exceptions.ArgumentNullError("config");

        this._config = config;
    }

    private createComponentRegistrations(components? : Typeioc.IComponent[],
                                         serviceModule? : Object, resolverModule? : Object) : Typeioc.Internal.IRegistrationBase[] {

        if(!components) return [];

        var self = this;

        return components.map((item) => {

            return self.registerComponent(item, serviceModule, resolverModule);
        });
    }

    private createModuleRegistrations(config : Typeioc.IConfig) : Typeioc.Internal.IRegistrationBase[] {

        var result : Typeioc.Internal.IRegistrationBase[] = [];

        if(!config.modules) return result;

        var self = this;

        config.modules.forEach((item) => {

            var regoes = self.createModule(item);

            result.push.apply(result, regoes);
        });

        return result;
    }

    private createModule(configModule : Typeioc.IModule) : Typeioc.Internal.IRegistrationBase[] {
        var result : Typeioc.Internal.IRegistrationBase[] = [];

        if(configModule.components) {
            var componentRegos = this.createComponentRegistrations(configModule.components,
                configModule.serviceModule,
                configModule.resolverModule);
            result.push.apply(result, componentRegos);
        }

        if(configModule.serviceModule &&
            configModule.resolverModule &&
            configModule.forModule !== false) {

            var regoBase = this._registrationBaseService.create(configModule.serviceModule);
            var moduleRegistration = this._moduleRegistrationService.create(regoBase);

            var mRego = moduleRegistration.getAsModuleRegistration();
            var asResolver = mRego.as(configModule.resolverModule);

            if(configModule.within) {
                asResolver.within(configModule.within);
            } else {
                asResolver.within(this.scope);
            }

            if(configModule.ownedBy) {
                asResolver.ownedBy(configModule.ownedBy);
            } else {
                asResolver.ownedBy(this.owner);
            }

            if(configModule.forInstances) {

                var self = this;

                configModule.forInstances.forEach((forInstance) => {
                    var resolver = self.getComponent(forInstance.resolver, configModule.resolverModule);

                    var params = forInstance.parameters || [];
                    var factory = forInstance.factory || self.getInstantiation(resolver, params, configModule.resolverModule);

                    asResolver.forService<any>(resolver, factory);
                });
            }

            var regoes = moduleRegistration.registrations;
            result.push.apply(result, regoes);
        }

        return result;
    }

    private registerComponent(component : Typeioc.IComponent,
                              serviceModule? : Object, resolverModule? : Object) : Typeioc.Internal.IRegistrationBase
    {
        var service = this.getComponent(component.service, serviceModule);

        var result = this._registrationBaseService.create(service);

        if(component.named) {
            result.name = component.named;
        }

        var params = component.parameters || [];

        if(component.factory) {
            result.factory = component.factory;
        } else {
            var resolver = this.getComponent(component.resolver, resolverModule);
            result.factory = this.getInstantiation(resolver, params, resolverModule);
        }

        result.scope = component.within || this.scope;
        result.owner = component.ownedBy || this.owner;

        if(component.initializeBy) {
            result.initializer = component.initializeBy;
        }

        if(component.disposer) {
            result.disposer = component.disposer;
        }

        return result;
    }

    private getComponent(instanceLocation : Typeioc.IInstanceLocation,
                         moduleInstance? : Object) {

        if(!instanceLocation.name) {
            var exception = new Exceptions.ConfigurationError('Missing component name');
            exception.innerError = new Exceptions.ArgumentNullError('name');
            exception.data = instanceLocation;

            throw exception;
        }

        var result;

        if(instanceLocation.instanceModule) {

            result = instanceLocation.instanceModule[instanceLocation.name];

            if(!result) throw new Exceptions.ConfigurationError('Component not found within instance location : ' + instanceLocation.name);

            return result;
        }

        if(moduleInstance) {

            result = moduleInstance[instanceLocation.name];

            if(!result) throw new Exceptions.ConfigurationError('Component not found within module instance : ' + instanceLocation.name);

            return result;
        }

        throw new Exceptions.ConfigurationError('Unable to load component : ' + instanceLocation.name);
    }

    private getInstantiation(resolver : any,
                             parameters : Typeioc.IInstantiationItem[],
                             moduleInstance? : Object) :
        Typeioc.IFactory<any> {

        return (c : Typeioc.IContainer) => {
            var instances = parameters.map((item) => {

                if(item.instance) return item.instance;

                if(!item.location) throw new Exceptions.ConfigurationError('Missing components location');

                var component = this.getComponent(item.location, moduleInstance);

                return item.isDependency === true ? c.resolve(component) : new component();
            });

            return Utils.construct(resolver, instances);
        };
    }
}