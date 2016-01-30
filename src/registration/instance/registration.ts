/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../../d.ts/typeioc.internal.d.ts" />

'use strict';

export class Registration<T> implements Typeioc.IRegistration<T> {

    constructor(private _base : Typeioc.Internal.IRegistrationBase) {}

    public as(factory : Typeioc.IFactory<T>) : Typeioc.IInitializedDisposedNamedReusedOwned<T> {

        this._base.factory = factory;

        return {
            initializeBy : this.initializeBy.bind(this),
            dispose : this.dispose.bind(this),
            named : this.named.bind(this),
            within : this.within.bind(this),
            ownedBy : this.ownedBy.bind(this)
        };
    }

    public asType(type: T, ...params : Array<any>) : Typeioc.IInitializedDisposedNamedReusedOwned<T> {

        this._base.factoryType = type;
        this._base.params = params;

        return {
            initializeBy : this.initializeBy.bind(this),
            dispose : this.dispose.bind(this),
            named : this.named.bind(this),
            within : this.within.bind(this),
            ownedBy : this.ownedBy.bind(this)
        };
    }

    public named(value : string) : Typeioc.IReusedOwned {

        this._base.name = value;

        return {
            within : this.within.bind(this),
            ownedBy : this.ownedBy.bind(this)
        };
    }

    public within(scope: Typeioc.Types.Scope) : Typeioc.IOwned {

        this._base.scope = scope;

        return {
            ownedBy : this.ownedBy.bind(this)
        };
    }

    public ownedBy(owner : Typeioc.Types.Owner) : void {
        this._base.owner = owner;
    }

    public initializeBy(action : Typeioc.IInitializer<T>) : Typeioc.INamedReusedOwnedDisposed<T> {

        this._base.initializer = action;

        return {
            dispose : this.dispose.bind(this),
            named : this.named.bind(this),
            within : this.within.bind(this),
            ownedBy : this.ownedBy.bind(this)
        };
    }

    public dispose(action : Typeioc.IDisposer<T>) : Typeioc.INamedReusedOwned {
        this._base.disposer = action;

        return {
            named : this.named.bind(this),
            within : this.within.bind(this),
            ownedBy : this.ownedBy.bind(this)
        };
    }
}