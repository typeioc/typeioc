/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
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
                private _containerService : Typeioc.Internal.IContainerService) {
        this.registrations = [];
        this.moduleRegistrations = [];

        this._defaults = Types.Defaults;
    }

    public register<R>(service : any) : Typeioc.IRegistration<R> {

        var regoBase = this._registrationBaseService.create(service);
        var registration = this._instanceRegistrationService.create<R>(regoBase);

        regoBase.scope = this._defaults.scope;
        regoBase.owner = this._defaults.owner;

        this.registrations.push(regoBase);

        return registration;
    }

    public registerModule(serviceModule : Object) : Typeioc.IAsModuleRegistration {

        var regoBase = this._registrationBaseService.create(serviceModule);
        var moduleRegistration = this._moduleRegistrationService.create(regoBase);

        regoBase.scope = this._defaults.scope;
        regoBase.owner = this._defaults.owner;


        this.moduleRegistrations.push(moduleRegistration);

        return moduleRegistration.getAsModuleRegistration();
    }

    public registerConfig(config : Typeioc.IConfig) : void {
        var configRego = this._configRegistrationService.create();
        configRego.apply(config);
        configRego.scope = this._defaults.scope;
        configRego.owner = this._defaults.owner;

        this.registrations.push.apply(this.registrations, configRego.registrations);
    }

    public build() : Typeioc.IContainer {

        var regoes = this.registrations.slice(0);

        this.moduleRegistrations.forEach(item => {

            regoes.push.apply(regoes, item.registrations);
        });

        var container = this._containerService.create();
        container.add(regoes);

        return Utils.toPublicContainer(container);
    }
}