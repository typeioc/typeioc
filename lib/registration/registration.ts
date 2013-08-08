/// <reference path="../t.d.ts/registration.d.ts" />

"use strict";

import ExceptionsModule = require('../exceptions');
import Defaults = require('../configuration/defaults');

export class Registration<T> implements Typeioc.IRegistration<T> {

    private _base : Typeioc.IRegistrationBase;

    constructor(baseRegistgration : Typeioc.IRegistrationBase) {
        this._base = baseRegistgration;
    }

    public as(factory: Typeioc.IFactory<T>) : Typeioc.IInitializedNamedReusedOwned {

        var self = this;
        self._base.factory = factory;

        return {
            initializeBy : self.initializeBy.bind(self),
            named : self.named.bind(self),
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }

    private named(value : string) : Typeioc.IReusedOwned {

        var self = this;
        self._base.name = value;

        return {
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
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

    private initializeBy(action : Typeioc.IInitializer<T>) : Typeioc.INamedReusedOwned {

        var self = this;
        self._base.initializer = action;

        return {
            named : self.named.bind(self),
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }
}