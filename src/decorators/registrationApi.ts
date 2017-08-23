/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

"use strict";

import { checkNullArgument } from '../utils';
import Decorators = Typeioc.Decorators;
import Types = Typeioc.Types;
import Internal = Typeioc.Internal;

export class RegistrationApi<T> implements Internal.IDecoratorRegistrationApi<T> {

    private _service: any;
    private _name: string;
    private _scope: Types.Scope;
    private _owner : Types.Owner;
    private _initializedBy : Typeioc.IInitializer<T>;
    private _disposedBy : Typeioc.IDisposer<T>;

    public get service() : any {
        return this._service;
    }

    public get name() : string {
        return this._name;
    }

    public get scope() : Types.Scope {
        return this._scope;
    }

    public get owner() : Types.Owner {
        return this._owner;
    }

    public get initializedBy() : Typeioc.IInitializer<T> {
        return this._initializedBy;
    }

    public get disposedBy() : Typeioc.IDisposer<T> {
        return this._disposedBy;
    }

    constructor(private _register : (api : Internal.IDecoratorRegistrationApi<T>) => ClassDecorator) {
        this.initializeBy = this.initializeBy.bind(this);
        this.dispose = this.dispose.bind(this);
        this.named = this.named.bind(this);
        this.within = this.within.bind(this);
        this.transient = this.transient.bind(this);
        this.singleton = this.singleton.bind(this);
        this.instancePerContainer =this.instancePerContainer.bind(this);
        this.ownedBy = this.ownedBy.bind(this);
        this.ownedInternally = this.ownedInternally.bind(this);
        this.ownedExternally = this.ownedExternally.bind(this);
        this.register = this.register.bind(this);
    }

    public provide(service: any) : Decorators.Register.IInitializedDisposedNamedReusedOwned<T> {

        checkNullArgument(service, 'service');

        const result = this.provideUndefined();

        this._service = service;

        return result;
    }

    public provideUndefined() : Decorators.Register.IInitializedDisposedNamedReusedOwned<T> {
        
        this._service = undefined;

        return {
            initializeBy : this.initializeBy,
            dispose : this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }

    private initializeBy(action : Typeioc.IInitializer<T>) : Decorators.Register.INamedReusedOwnedDisposed<T> {

        checkNullArgument(action, 'action');

        this._initializedBy = action;

        return {
            dispose : this.dispose,
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }

    private dispose(action : Typeioc.IDisposer<T>) : Decorators.Register.INamedReusedOwned {

        checkNullArgument(action, 'action');

        this._disposedBy = action;

        return {
            named: this.named,
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }

    private named(name: string) : Decorators.Register.IReusedOwned {

        checkNullArgument(name, 'name');

        this._name = name;

        return {
            within: this.within,
            transient: this.transient,
            singleton: this.singleton,
            instancePerContainer: this.instancePerContainer,
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }

    private within(scope: Types.Scope) : Decorators.Register.IOwned {

        checkNullArgument(scope, 'scope');

        this._scope = scope;

        return {
            ownedBy: this.ownedBy,
            ownedInternally: this.ownedInternally,
            ownedExternally: this.ownedExternally,
            register: this.register
        };
    }

    private transient() : Decorators.Register.IOwned {
        return this.within(Types.Scope.None);
    }

    private singleton() : Decorators.Register.IOwned {
        return this.within(Types.Scope.Hierarchy);
    }
    
    private instancePerContainer() : Decorators.Register.IOwned {
        return this.within(Types.Scope.Container);
    }
    
    private ownedBy(owner : Types.Owner) : Decorators.Register.IRegister {

        checkNullArgument(owner, 'owner');

        this._owner = owner;

        return {
            register: this.register
        };
    }

    private ownedInternally(): Decorators.Register.IRegister {
        return this.ownedBy(Types.Owner.Container);
    }
    
    private ownedExternally(): Decorators.Register.IRegister {
        return this.ownedBy(Types.Owner.Externals);
    }

    private register() : ClassDecorator {
        return this._register(this);
    }
}