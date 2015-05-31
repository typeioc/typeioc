/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../../d.ts/typeioc.internal.d.ts" />

'use strict';

export class Registration<T> implements Typeioc.IRegistration<T> {

    constructor(private _base : Typeioc.Internal.IRegistrationBase) {}

    public as(factory : Typeioc.IFactory<T>) : Typeioc.IInitializedDisposedNamedReusedOwned<T> {

        var self = this;
        self._base.factory = factory;

        return {
            initializeBy : self.initializeBy.bind(self),
            dispose : self.dispose.bind(self),
            named : self.named.bind(self),
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }

    public named(value : string) : Typeioc.IReusedOwned {

        var self = this;
        self._base.name = value;

        return {
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }

    public within(scope: Typeioc.Types.Scope) : Typeioc.IOwned {

        var self = this;
        self._base.scope = scope;

        return {
            ownedBy : self.ownedBy.bind(self)
        };
    }

    public ownedBy(owner : Typeioc.Types.Owner) : void {
        this._base.owner = owner;
    }

    public initializeBy(action : Typeioc.IInitializer<T>) : Typeioc.INamedReusedOwnedDisposed<T> {

        var self = this;
        self._base.initializer = action;

        return {
            dispose : self.dispose.bind(self),
            named : self.named.bind(self),
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }

    public dispose(action : Typeioc.IDisposer<T>) : Typeioc.INamedReusedOwned {
        var self = this;
        self._base.disposer = action;

        return {
            named : self.named.bind(self),
            within : self.within.bind(self),
            ownedBy : self.ownedBy.bind(self)
        };
    }
}