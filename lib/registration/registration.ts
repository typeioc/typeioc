"use strict";

import RegoDefinitionsModule = require('definitions');
import ExceptionsModule = require('../exceptions');

export class Registration<T> implements RegoDefinitionsModule.IRegistration<T> {

    private _base : RegoDefinitionsModule.IRegistrationBase;

    constructor(baseRegistgration : RegoDefinitionsModule.IRegistrationBase) {
        this._base = baseRegistgration;
    }

    public as(factory: RegoDefinitionsModule.IFactory<T>) : RegoDefinitionsModule.IInitializedNamedReusedOwned {

        var self = this;
        self._base.factory = factory;

        return {
            initializeBy : self.initializeBy.bind(self),
            named : self.named.bind(self),
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }

    private named(value : string) : RegoDefinitionsModule.IReusedOwned {

        var self = this;
        self._base.name = value;

        return {
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
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

    private initializeBy(action : RegoDefinitionsModule.IInitializer<T>) : RegoDefinitionsModule.INamedReusedOwned {

        var self = this;
        self._base.initializer = action;

        return {
            named : self.named.bind(self),
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }

}