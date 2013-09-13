/// <reference path="t.d.ts/container.d.ts" />
/// <reference path="t.d.ts/registration.d.ts" />
/// <reference path="t.d.ts/configuration.d.ts" />
"use strict";

import RegistrationModule = require('registration/registration');
import RegistrationBaseModule = require('registration/registrationBase');
import MultiRegistrationsModule = require('registration/moduleRegistration');
import ConfigRegistrationModule = require('registration/configRegistration');
import ContainerModule = require('container/container');
import DefaultsModule = require('configuration/defaults');


 export class ContainerBuilder {
     private registrations : Typeioc.IRegistrationBase[];
     private moduleRegistrations : Typeioc.IModuleRegistration[];

     public DefaultScope : DefaultsModule.Scope = DefaultsModule.Defaults.Scope;
     public DefaultOwner : DefaultsModule.Owner = DefaultsModule.Defaults.Owner;

    constructor() {
        this.registrations = [];
        this.moduleRegistrations = [];
    }


    public register<R>(service : any) : Typeioc.IRegistration<R> {

        var regoBase = new RegistrationBaseModule.RegistrationBase(service);

        var registration = new RegistrationModule.Registration<R>(regoBase);
        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.registrations.push(regoBase);

        return registration;
    }

    public registerModule(serviceModule : Object) : Typeioc.IAsModuleRegistration {

        var regoBase = new RegistrationBaseModule.RegistrationBase(serviceModule);
        var moduleRegistration = new MultiRegistrationsModule.ModuleRegistration(regoBase);

        regoBase.scope = this.DefaultScope;
        regoBase.owner = this.DefaultOwner;

        this.moduleRegistrations.push(moduleRegistration);

        return moduleRegistration.getAsModuleRegistration();
   }

    public registerConfig(config : Typeioc.IConfig) : void {
        var configRego = new ConfigRegistrationModule.ConfigRegistration(config);
        configRego.scope = this.DefaultScope;
        configRego.owner = this.DefaultOwner;

        var regoes = configRego.registrations;

        this.registrations.push.apply(this.registrations, regoes);
    }

    public build() : Typeioc.IContainer {

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
    public static get Scope() : DefaultsModule.Scope {
        return DefaultsModule.Scope;
    }

    public static get Owner() : DefaultsModule.Owner {
        return DefaultsModule.Owner;
    }
}

export interface IConfig extends Typeioc.IConfig {}

export interface IContainer extends Typeioc.IContainer {}