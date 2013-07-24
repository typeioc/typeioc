"use strict";

import DefinitionsModule = require('definitions');
import RegoDefinitionsModule = require('registration/definitions');
import ConfigDefinitions = require('configuration/definitions');
import ContainerDefinitionsModule = require('container/definitions');
import RegistrationModule = require('registration/registration');
import RegistrationBaseModule = require('registration/registrationBase');
import MultiRegistrationsModule = require('registration/moduleRegistration');
import ConfigRegistrationModule = require('registration/configRegistration');
import ContainerModule = require('container/container');
import DefaultsModule = require('configuration/defaults');


 export class ContainerBuilder {
     private registrations : RegoDefinitionsModule.IRegistrationBase[];
     private moduleRegistrations : RegoDefinitionsModule.IModuleRegistration[];

     public DefaultScope : RegoDefinitionsModule.Scope = DefaultsModule.Defaults.Scope;
     public DefaultOwner : RegoDefinitionsModule.Owner = DefaultsModule.Defaults.Owner;

    constructor() {
        this.registrations = [];
        this.moduleRegistrations = [];
    }


    public register<R>(service : any) : RegoDefinitionsModule.IRegistration<R> {

        var regoBase = new RegistrationBaseModule.RegistrationBase(service);

        var registration = new RegistrationModule.Registration<R>(regoBase);
        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.registrations.push(regoBase);

        return registration;
    }

    public registerModule(serviceModule : Object) : RegoDefinitionsModule.IAsModuleRegistration {

        var regoBase = new RegistrationBaseModule.RegistrationBase(serviceModule);
        var moduleRegistration = new MultiRegistrationsModule.ModuleRegistration(regoBase);

        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.moduleRegistrations.push(moduleRegistration);

        return moduleRegistration.getAsModuleRegistration();
   }

    public registerConfig(config : ConfigDefinitions.IConfig) : void {
        var configRego = new ConfigRegistrationModule.ConfigRegistration(config);
        configRego.scope = this.DefaultScope;
        configRego.owner = this.DefaultOwner;

        var regoes = configRego.registrations;

        this.registrations.push.apply(this.registrations, regoes);
    }

    public build() : ContainerDefinitionsModule.IContainer {

        var regoes = this.registrations;
        this.registrations = [];

        this.moduleRegistrations.forEach(function(item) {

            regoes.push.apply(regoes, item.registrations);
        });

        var container = new ContainerModule.Container(regoes);

        return {
            resolve : container.resolve.bind(container),
            tryResolve: container.tryResolve.bind(container),
            resolveNamed : container.resolveNamed.bind(container),
            tryResolveNamed : container.tryResolveNamed.bind(container),
            createChild : container.createChild.bind(container),
            dispose: container.dispose.bind(container),
        };
    }
 }


export class Constants {
    public static Scope = RegoDefinitionsModule.Scope;
    public static Owner = RegoDefinitionsModule.Owner;
}

export interface IConfig extends ConfigDefinitions.IConfig {}

export interface IContainer extends ContainerDefinitionsModule.IContainer {}