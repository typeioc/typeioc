/// <reference path="../d.ts/typeioc.d.ts" />


'use strict';

import RegistrationModule = require('./registration');
import RegistrationBaseModule = require('./registrationBase');
import MultiRegistrationsModule = require('./moduleRegistration');
import ConfigRegistrationModule = require('./configRegistration');
import ContainerModule = require('./container');


export class ContainerBuilder implements Typeioc.IContainerBuilder{
    private registrations : Typeioc.IRegistrationBase[];
    private moduleRegistrations : Typeioc.IModuleRegistration[];

    public DefaultScope = Typeioc.Types.Scope.None;
    public DefaultOwner = Typeioc.Types.Owner.Container;

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
            dispose: container.dispose.bind(container)
        };
    }
}
