/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.4
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

export class Registration<T> implements Typeioc.IRegistration<T> {

    constructor(private _base : Typeioc.Internal.IRegistrationBase) {
        this.initializeBy = this.initializeBy.bind(this),
        this.dispose = this.dispose.bind(this),
        this.named = this.named.bind(this),
        this.name = this.name.bind(this),
        this.within = this.within.bind(this),
        this.ownedBy = this.ownedBy.bind(this),
        this.ownedInternally = this.ownedInternally.bind(this),
        this.ownedExternally = this.ownedExternally.bind(this),
        this.transient = this.transient.bind(this),
        this.singleton = this.singleton.bind(this),
        this.instancePerContainer = this.instancePerContainer.bind(this);
        this.lazy = this.lazy.bind(this);
    }

    public as(factory : Typeioc.IFactory<T>): Typeioc.IInitializedLazyDisposedNamedReusedOwned<T> {

        this._base.factory = factory;

        return {
            initializeBy : this.initializeBy,
            lazy: this.lazy,
            dispose : this.dispose,
            named : this.named,
            within : this.within,
            ownedBy : this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer 
        };
    }

    public asType(type: T, ...params : Array<any>): Typeioc.IInitializedLazyDisposedNamedReusedOwned<T> {

        this._base.factoryType = type;
        this._base.params = params;

        return {
            initializeBy : this.initializeBy,
            lazy: this.lazy,
            dispose : this.dispose,
            named : this.named,
            within : this.within,
            ownedBy : this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }

    public asSelf(...params : Array<any>): Typeioc.IInitializedLazyDisposedNamedReusedOwned<T> {
        return this.asType(this._base.service, ...params);
    }

    public asValue(value): Typeioc.IName {
        this._base.factoryValue = value;
        this._base.owner = Typeioc.Types.Owner.Externals;
        this._base.scope = Typeioc.Types.Scope.None;

        return {
            named: this.name
        };
    }

    private name(value : string) : void {
        this.named(value);
    }

    private named(value : string) : Typeioc.IReusedOwned {

        this._base.name = value;

        return {
            within : this.within,
            ownedBy : this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }

    private within(scope: Typeioc.Types.Scope) : Typeioc.IOwned {

        this._base.scope = scope;

        return {
            ownedBy : this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally
        };
    }

    private transient() : Typeioc.IOwned {
        return this.within(Typeioc.Types.Scope.None);
    }
    
    private singleton() : Typeioc.IOwned {
        return this.within(Typeioc.Types.Scope.Hierarchy);
    }
    
    private instancePerContainer() : Typeioc.IOwned {
        return this.within(Typeioc.Types.Scope.Container);
    }

    private ownedBy(owner : Typeioc.Types.Owner) : void {
        this._base.owner = owner;
    }

    private ownedInternally() {
        this.ownedBy(Typeioc.Types.Owner.Container);
    }

    private ownedExternally() {
        this.ownedBy(Typeioc.Types.Owner.Externals);
    }

    private initializeBy(action : Typeioc.IInitializer<T>) : Typeioc.ILazyNamedReusedOwnedDisposed<T> {

        this._base.initializer = action;

        return {
            lazy: this.lazy,
            dispose : this.dispose,
            named : this.named,
            within : this.within,
            ownedBy : this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }

    private dispose(action : Typeioc.IDisposer<T>) : Typeioc.INamedReusedOwned {
        this._base.disposer = action;

        return {
            named : this.named,
            within : this.within,
            ownedBy : this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }

    private lazy() : Typeioc.INamedReusedOwned {
        this._base.isLazy = true;

        return {
            named : this.named,
            within : this.within,
            ownedBy : this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer
        };
    }
}