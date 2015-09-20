/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../../utils/index');

export class ModuleRegistration implements Typeioc.Internal.IModuleRegistration{

    private _asModule : Object;

    public get registrations() : Typeioc.Internal.IRegistrationBase[] {

        var self = this;
        var result : Typeioc.Internal.IRegistrationBase[] = [];

        var serviceModule = this._base.service;
        var asModule = this._asModule;

        Object.getOwnPropertyNames(asModule).forEach(function(asPrperty) {

            var asValue = asModule[asPrperty];

            if(!(asValue instanceof Function)) return;

            Object.getOwnPropertyNames(serviceModule).forEach(function(srProperty) {

                var srValue = serviceModule[srProperty];

                if(!(srValue instanceof Function)) return;

                if(Utils.Reflection.isCompatible(asValue.prototype, srValue.prototype)) {
                    var rego = self.createRegistration({
                        service : srValue,
                        substitute : asValue});

                    result.push(rego);
                }
            });
        });

        return result;
    }

    constructor(private _base : Typeioc.Internal.IRegistrationBase,
                private _internalStorage : Typeioc.Internal.IInternalStorage<any, Typeioc.Internal.IModuleItemRegistrationOptions>,
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService) {
    }

    public getAsModuleRegistration() : Typeioc.IAsModuleRegistration {
        var self = this;

        return {
            as : self.as.bind(self)
        };
    }

    private as(asModule : Object) : Typeioc.IModuleReusedOwned {
        this._asModule = asModule;

        return this.asModuleInitializedReusedOwned();
    }

    private within(scope: Typeioc.Types.Scope) : Typeioc.IOwned {

        var self = this;
        self._base.scope = scope;

        return {
            ownedBy : self.ownedBy.bind(self)
        };
    }

    private ownedBy(owner : Typeioc.Types.Owner) : void {
        this._base.owner = owner;
    }

    private forService<R>(service: any, factory : Typeioc.IFactory<R>) : Typeioc.IModuleReusedOwned {

        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = factory;

        return this.asModuleInitializedReusedOwned();
    }

    private forArgs(service: any, ...args:any[]) : Typeioc.IModuleReusedOwned {

        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = () =>  Utils.Reflection.construct(service, args);

        return this.asModuleInitializedReusedOwned();
    }

    private named(service: any, name : string) : Typeioc.IModuleReusedOwned {
        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.name = name;

        return this.asModuleInitializedReusedOwned();
    }

    private createRegistration(data : {
        service : Function;
        substitute : Function}) : Typeioc.Internal.IRegistrationBase {

        var rego = this._registrationBaseService.create(data.service);
        var options = this._internalStorage.register(data.substitute, this.emptyRegoOptionsEntry);

        var factory = () => {
            var k : any = data.substitute;
            return  new k();
        };

        rego.factory = options.factory || factory;
        rego.name = options.name;
        rego.scope = this._base.scope;
        rego.owner = this._base.owner;

        return rego;
    }

    private asModuleInitializedReusedOwned() : Typeioc.IModuleReusedOwned {
        var self = this;

        return {
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self),
            forService : self.forService.bind(self),
            forArgs : self.forArgs.bind(self),
            named : self.named.bind(self)
        };
    }

    private emptyRegoOptionsEntry() : Typeioc.Internal.IModuleItemRegistrationOptions {
        return {
            factory : null,
            name : null
        };
    }
}