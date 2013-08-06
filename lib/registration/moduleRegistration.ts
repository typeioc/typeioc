
"use strict";

declare function require(path : string) : any;

import RegistrationModule = require('registrationBase');
import RegoDefinitionsModule = require('definitions');
import Utils = require('../utils');

var hashes = require('hashes');

export class ModuleRegistration implements RegoDefinitionsModule.IModuleRegistration{

    private _asModule : Object;
    private _base : RegoDefinitionsModule.IRegistrationBase;
    private _regoOptionsCollection : any;

    public get registrations() : RegoDefinitionsModule.IRegistrationBase[] {

        var self = this;
        var result : RegoDefinitionsModule.IRegistrationBase[] = [];

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

    constructor(baseRegistgration : RegoDefinitionsModule.IRegistrationBase ) {

        this._base = baseRegistgration;
        this._regoOptionsCollection = new hashes.HashTable();
    }

    public getAsModuleRegistration() : RegoDefinitionsModule.IAsModuleRegistration {
        var self = this;

        return {
            as : self.as.bind(self)
        };
    }


    private as(asModule : Object) : RegoDefinitionsModule.IModuleReusedOwned {
        this._asModule = asModule;

        return this.asModuleInitializedReusedOwned();
    }

    private within(scope: RegoDefinitionsModule.Scope) : RegoDefinitionsModule.IOwned {

        var self = this;
        self._base.scope = scope;

        return {
            ownedBy : self.ownedBy.bind(self)
        };
    }

    private ownedBy(owner : RegoDefinitionsModule.Owner) : void {
        this._base.owner = owner;
    }


    private for<R>(service: any, factory : RegoDefinitionsModule.IFactory<R>) : RegoDefinitionsModule.IModuleReusedOwned {

        var options = this.getRegoOptionsEntry(service);
        options.factory = factory;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    }

    private forArgs(service: any, ...args:any[]) : RegoDefinitionsModule.IModuleReusedOwned {

        var options = this.getRegoOptionsEntry(service);

        var factory = () => {
            return Utils.construct(service, args);
        };

        options.factory = factory;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    }

    private named(service: any, name : string) : RegoDefinitionsModule.IModuleReusedOwned {
        var options = this.getRegoOptionsEntry(service);
        options.name = name;

        this._regoOptionsCollection.add(service, options, true);

        return this.asModuleInitializedReusedOwned();
    }

    private createRegistration(data : {
        service : Function;
        substitute : Function}) : RegoDefinitionsModule.IRegistrationBase {

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

    private asModuleInitializedReusedOwned() : RegoDefinitionsModule.IModuleReusedOwned {
        var self = this;

        return {
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self),
            for : self.for.bind(self),
            forArgs : self.forArgs.bind(self),
            named : self.named.bind(self)
        };
    }


    private getRegoOptionsEntry(service : any) : RegoDefinitionsModule.IModuleItemRegistrationOptions {
        return this._regoOptionsCollection.contains(service) ?
                this._regoOptionsCollection.get(service).value :
                { factory : null, name : null };
    }

    private addRegoOptionsEntry(service : any, options : RegoDefinitionsModule.IModuleItemRegistrationOptions) {
        this._regoOptionsCollection.add(service, options, true);
    }
}