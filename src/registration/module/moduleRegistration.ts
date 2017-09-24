/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.3
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import { Reflection } from '../../utils';

export class ModuleRegistration implements Typeioc.Internal.IModuleRegistration{

    private _asModule : Object;

    constructor(private _base : Typeioc.Internal.IRegistrationBase,
                private _internalStorage : Typeioc.Internal.IInternalStorage<any, Typeioc.Internal.IModuleItemRegistrationOptions>,
                private _registrationBaseService : Typeioc.Internal.IRegistrationBaseService) {
    }
    
    public get registrations() : Typeioc.Internal.IRegistrationBase[] {

        var result : Typeioc.Internal.IRegistrationBase[] = [];
        var serviceModule = this._base.service;
        var asModule = this._asModule;

        const moduleValues = Object.getOwnPropertyNames(asModule)
            .map(key => asModule[key])
            .filter(value => value instanceof Function);

        const serviceModuleValues = Object.getOwnPropertyNames(serviceModule)
            .map(key => serviceModule[key])
            .filter(value => value instanceof Function);

        moduleValues.forEach(asValue => {
            serviceModuleValues.forEach(srValue => {
                if(Reflection.isCompatible(asValue.prototype, srValue.prototype)) {
                    var rego = this.createRegistration({
                        service : srValue,
                        substitute : asValue});

                    result.push(rego);
                }
            });
        });

        return result;
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
            ownedBy : self.ownedBy.bind(self),
            ownedInternally: this.ownedInternally.bind(this),
            ownedExternally: this.ownedExternally.bind(this)
        };
    }

    public transient() : Typeioc.IOwned {
        return this.within(Typeioc.Types.Scope.None);
    }
    
    public singleton() : Typeioc.IOwned {
        return this.within(Typeioc.Types.Scope.Hierarchy);
    }
    
    public instancePerContainer() : Typeioc.IOwned {
        return this.within(Typeioc.Types.Scope.Container);
    }

    private ownedBy(owner : Typeioc.Types.Owner) : void {
        this._base.owner = owner;
    }

    private ownedInternally() {
        this.ownedBy(Typeioc.Types.Owner.Container)
    }

    private ownedExternally() {
        this.ownedBy(Typeioc.Types.Owner.Externals);
    }

    private forService<R>(service: any, factory : Typeioc.IFactory<R>) : Typeioc.IModuleReusedOwned {

        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = factory;

        return this.asModuleInitializedReusedOwned();
    }

    private forArgs(service: any, ...args:any[]) : Typeioc.IModuleReusedOwned {

        var options = this._internalStorage.register(service, this.emptyRegoOptionsEntry);
        options.factory = () =>  Reflection.construct(service, args);

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
            named : self.named.bind(self),
            ownedInternally: self.ownedInternally.bind(self),
            ownedExternally: self.ownedExternally.bind(self),
            transient: self.transient.bind(self),
            singleton: self.singleton.bind(this),
            instancePerContainer: self.instancePerContainer.bind(self) 
        };
    }

    private emptyRegoOptionsEntry() : Typeioc.Internal.IModuleItemRegistrationOptions {
        return {
            factory : null,
            name : null
        };
    }
}