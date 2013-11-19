/// <reference path="../t.d.ts/node.d.ts" />
/// <reference path="../t.d.ts/registration.d.ts" />

"use strict";

import RegistrationModule = require('registrationBase');
import Utils = require('../utils');
import Defaults = require('../configuration/defaults');

var hashes = require('hashes');

export class ModuleRegistration implements Typeioc.IModuleRegistration{

    private _asModule : Object;
    private _base : Typeioc.IRegistrationBase;
    private _regoOptionsCollection : any;

    public get registrations() : Typeioc.IRegistrationBase[] {

        var self = this;
        var result : Typeioc.IRegistrationBase[] = [];

        var serviceModule = this._base.service;
        var asModule = this._asModule;

        Object.getOwnPropertyNames(asModule).forEach(function(asPrperty) {

            var asValue = asModule[asPrperty];

            if(!(asValue instanceof Function)) return;

            Object.getOwnPropertyNames(serviceModule).forEach(function(srProperty) {

                var srValue = serviceModule[srProperty];

                if(!(srValue instanceof Function)) return;

                if(Utils.isCompatible(asValue.prototype, srValue.prototype)) {
                    var rego = self.createRegistration({
                        service : srValue,
                        substitute : asValue});

                    result.push(rego);
                }
            });
        });

        return result;
    }

    constructor(baseRegistgration : Typeioc.IRegistrationBase ) {

        this._base = baseRegistgration;
        this._regoOptionsCollection = new hashes.HashTable();
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

    private within(scope: Defaults.Scope) : Typeioc.IOwned {

        var self = this;
        self._base.scope = scope;

        return {
            ownedBy : self.ownedBy.bind(self)
        };
    }

    private ownedBy(owner : Defaults.Owner) : void {
        this._base.owner = owner;
    }


    private for<R>(service: any, factory : Typeioc.IFactory<R>) : Typeioc.IModuleReusedOwned {

        var options = this.getRegoOptionsEntry(service);
        options.factory = factory;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    }

    private forArgs(service: any, ...args:any[]) : Typeioc.IModuleReusedOwned {

        var options = this.getRegoOptionsEntry(service);

        var factory = () => {
            return Utils.construct(service, args);
        };

        options.factory = factory;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    }

    private named(service: any, name : string) : Typeioc.IModuleReusedOwned {
        var options = this.getRegoOptionsEntry(service);
        options.name = name;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    }

    private createRegistration(data : {
        service : Function;
        substitute : Function}) : Typeioc.IRegistrationBase {

        var rego = new RegistrationModule.RegistrationBase(data.service);

        var options = this.getRegoOptionsEntry(data.substitute);

        rego.factory = options.factory ||
                       () => {
                             var k : any = data.substitute;
                             return  new k();
                       };
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
            for : self.for.bind(self),
            forArgs : self.forArgs.bind(self),
            named : self.named.bind(self)
        };
    }

    private getRegoOptionsEntry(service : any) : Typeioc.IModuleItemRegistrationOptions {
        return this._regoOptionsCollection.contains(service) ?
                this._regoOptionsCollection.get(service).value :
                { factory : null, name : null };
    }

    private addRegoOptionsEntry(service : any, options : Typeioc.IModuleItemRegistrationOptions) {
        this._regoOptionsCollection.add(service, options, true);
    }
}