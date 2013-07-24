"use strict";

import ConfigDefinitionsModule = require('../configuration/definitions');
import RegoDefinitionsModule = require('definitions');
import ContainerDefinitionsModule = require('../container/definitions');
import DefinitionsModule = require('../definitions');
import BaseRegistrationModule = require('registrationBase');
import MultiRegistrationsModule = require('../registration/moduleRegistration');
import DefaultsModule = require('../configuration/defaults');
import ExceptionsModule = require('../exceptions');
import Utils = require('../utils');

export class ConfigRegistration {

    private _scope : RegoDefinitionsModule.Scope;
    private _owner : RegoDefinitionsModule.Owner;
    private _config : ConfigDefinitionsModule.IConfig;

    public get scope() : RegoDefinitionsModule.Scope {
        return this._scope;
    }

    public set scope(value : RegoDefinitionsModule.Scope) {
        this._scope = value;
    }

    public get owner() : RegoDefinitionsModule.Owner {
        return this._owner;
    }

    public set owner(value : RegoDefinitionsModule.Owner) {
        this._owner = value;
    }


    public get registrations() : RegoDefinitionsModule.IRegistrationBase[] {

        var result = this.createComponentRegistrations(this._config.components);
        var moduleRegoes = this.createModuleRegistrations(this._config);

        return result.concat(moduleRegoes);
   }


    constructor(config : ConfigDefinitionsModule.IConfig) {
        this._config = config;
    }

    private createComponentRegistrations(components? : ConfigDefinitionsModule.IComponent[],
        serviceModule? : Object, resolverModule? : Object) : RegoDefinitionsModule.IRegistrationBase[] {

        if(!components) return [];

        var self = this;

        return components.map((item) => {

            return self.registerComponent(item, serviceModule, resolverModule);
        });
    }

    private createModuleRegistrations(config : ConfigDefinitionsModule.IConfig) : RegoDefinitionsModule.IRegistrationBase[] {

        var result : RegoDefinitionsModule.IRegistrationBase[] = [];

        if(!config.modules) return result;

        var self = this;

        config.modules.forEach((item) => {

            var regoes = self.createModule(item);

            result.push.apply(result, regoes);
        });

        return result;
    }

    private createModule(configModule : ConfigDefinitionsModule.IModule) : RegoDefinitionsModule.IRegistrationBase[] {
        var result : RegoDefinitionsModule.IRegistrationBase[] = [];

        if(configModule.components) {
            var componentRegos = this.createComponentRegistrations(configModule.components,
                                                                   configModule.serviceModule,
                                                                   configModule.resolverModule);
            result.push.apply(result, componentRegos);
        }

        if(configModule.serviceModule &&
           configModule.resolverModule &&
           configModule.forModule !== false) {

            var regoBase = new BaseRegistrationModule.RegistrationBase(configModule.serviceModule);
            var moduleRegistration = new MultiRegistrationsModule.ModuleRegistration(regoBase);

            var mRego = moduleRegistration.getAsModuleRegistration();
            var asResolver = mRego.as(configModule.resolverModule);

            if(configModule.within) {
                asResolver.within(configModule.within);
            } else {
                asResolver.within(this._scope);
            }

            if(configModule.ownedBy) {
                asResolver.ownedBy(configModule.ownedBy);
            } else {
                asResolver.ownedBy(this._owner);
            }

            if(configModule.forInstances) {

                var self = this;

                configModule.forInstances.forEach((forInstance) => {
                    var resolver = self.getComponent(forInstance.resolver, configModule.resolverModule);

                    var params = forInstance.parameters || [];
                    var factory = forInstance.factory || self.getInstantiation(resolver, params, configModule.resolverModule);

                    asResolver.for<any>(resolver, factory);

                });
            }

            var regoes = moduleRegistration.registrations;
            result.push.apply(result, regoes);

        }

        return result;
    }

    private registerComponent(component : ConfigDefinitionsModule.IComponent,
                              serviceModule? : Object, resolverModule? : Object) : RegoDefinitionsModule.IRegistrationBase
    {
        var service = this.getComponent(component.service, serviceModule);

        var result = new BaseRegistrationModule.RegistrationBase(service);

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

        result.scope = component.within !== undefined ? component.within : this._scope;
        result.owner = component.ownedBy !== undefined ? component.ownedBy : this._owner;

        if(component.initializeBy) {
            result.initializer = component.initializeBy;
        }

        return result;
    }

    private getComponent(instanceLocation : ConfigDefinitionsModule.IInstanceLocation,
                         moduleInstance? : Object) {

        if(!instanceLocation.name) throw new ExceptionsModule.ArgumentNullError('Missing component name');

        if(instanceLocation.instanceModule) {
            return instanceLocation.instanceModule[instanceLocation.name];
        }

        if(moduleInstance) {
            return moduleInstance[instanceLocation.name];
        }

        throw new ExceptionsModule.ConfigError('Unable to load component : ' + instanceLocation.name);
    }

    private getInstantiation(resolver : any,
                             parameters : ConfigDefinitionsModule.IInstantiationItem[],
                             moduleInstance? : Object) :
                             DefinitionsModule.IFactory<any> {

        return (c : ContainerDefinitionsModule.IContainer) => {
            var instances = parameters.map((item) => {

                if(item.instance) return item.instance;

                if(!item.location) throw new ExceptionsModule.ConfigError('Missing components location');

                var component = this.getComponent(item.location, moduleInstance);

                return item.isDependency ? c.resolve(component) : new component();
            });

            return Utils.construct(resolver, instances);
        };
    }
}