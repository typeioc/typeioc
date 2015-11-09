/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Types = require('../types/index');
import Utils = require('../utils/index');


export class ContainerBuilder implements Typeioc.IContainerBuilder {
    private registrations : Typeioc.Internal.IRegistrationBase[];
    private moduleRegistrations : Typeioc.Internal.IModuleRegistration[];
    private _defaults : Typeioc.IDefaults;

    constructor(private _configRegistrationService : Typeioc.Internal.IConfigRegistrationService,
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService,
                private _instanceRegistrationService : Typeioc.Internal.IInstanceRegistrationService,
                private _moduleRegistrationService : Typeioc.Internal.IModuleRegistrationService,
                private _internalContainerService : Typeioc.Internal.IInternalContainerService,
                private _containerService : Typeioc.Internal.IContainerService) {
        this.registrations = [];
        this.moduleRegistrations = [];

        this._defaults = Types.Defaults;
    }

    public register<R>(service : any) : Typeioc.IRegistration<R> {

        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create<R>(regoBase);

        setDefaults(regoBase, this._defaults);

        this.registrations.push(regoBase);

        return registration;
    }

    public registerModule(serviceModule : Object) : Typeioc.IAsModuleRegistration {

        var regoBase = this._registrationBaseService.create(serviceModule);
        var moduleRegistration = this._moduleRegistrationService.create(regoBase);

        setDefaults(regoBase, this._defaults);

        this.moduleRegistrations.push(moduleRegistration);

        return moduleRegistration.getAsModuleRegistration();
    }

    public registerConfig(config : Typeioc.IConfig) : void {
        var configRego = this._configRegistrationService.create();
        configRego.apply(config);

        setDefaults(configRego, this._defaults);

        this.registrations.push.apply(this.registrations, configRego.registrations);
    }

    public build() : Typeioc.IContainer {

        var regoes = this.registrations.slice(0);

        this.moduleRegistrations.forEach(item => {

            regoes.push.apply(regoes, item.registrations);
        });

        var internalContainer = this._internalContainerService.create();
        var container = this._containerService.create(this._internalContainerService, internalContainer);
        internalContainer.add(regoes);

        return {
            cache : container.cache,
            resolve : container.resolve.bind(container),
            tryResolve: container.tryResolve.bind(container),
            resolveNamed : container.resolveNamed.bind(container),
            tryResolveNamed : container.tryResolveNamed.bind(container),
            resolveWithDependencies : container.resolveWithDependencies.bind(container),
            resolveWith : container.resolveWith.bind(container),
            createChild : container.createChild.bind(container),
            dispose: container.dispose.bind(container)
        };
    }
}

function setDefaults(rego : Typeioc.Internal.IRegistrationBase | Typeioc.Internal.IConfigRegistration,
                     defaults: Typeioc.IDefaults) {

    rego.scope = defaults.scope;
    rego.owner = defaults.owner;
}