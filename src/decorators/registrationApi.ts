/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path="../../d.ts/typeioc.internal.d.ts" />

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

    constructor(private _register : (api : Internal.IDecoratorRegistrationApi<T>) => ClassDecorator)
    { }

    public provide(service: any) : Decorators.Register.IInitializedDisposedNamedReusedOwned<T> {

        checkNullArgument(service, 'service');

        this._service = service;

        return {
            initializeBy : this.initializeBy.bind(this),
            dispose : this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }

    private initializeBy(action : Typeioc.IInitializer<T>) : Decorators.Register.INamedReusedOwnedDisposed<T> {

        checkNullArgument(action, 'action');

        this._initializedBy = action;

        return {
            dispose : this.dispose.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }

    private dispose(action : Typeioc.IDisposer<T>) : Decorators.Register.INamedReusedOwned {

        checkNullArgument(action, 'action');

        this._disposedBy = action;

        return {
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }

    private named(name: string) : Decorators.Register.IReusedOwned {

        checkNullArgument(name, 'name');

        this._name = name;

        return {
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }

    private within(scope: Types.Scope) : Decorators.Register.IOwned {

        checkNullArgument(scope, 'scope');

        this._scope = scope;

        return {
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this)
        };
    }

    private ownedBy(owner : Types.Owner) : Decorators.Register.IRegister {

        checkNullArgument(owner, 'owner');

        this._owner = owner;

        return {
            register: this.register.bind(this)
        };
    }

    private register() : ClassDecorator {

        return this._register(this);
    }
}