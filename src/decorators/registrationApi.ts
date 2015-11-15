/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path="../../d.ts/typeioc.internal.d.ts" />

'use strinct';

import Utils = require('../utils/index');
import Decorators = Typeioc.Decorators;
import Types = Typeioc.Types;
import Internal = Typeioc.Internal;

export class RegistrationApi<T> implements Internal.IDecoratorRegistrationApi<T> {

    private _service: any;
    private _builder: Typeioc.IContainerBuilder;
    private _name: string;
    private _scope: Types.Scope;
    private _owner : Types.Owner;
    private _initializedBy : Typeioc.IInitializer<T>;

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

    public get builder() : Typeioc.IContainerBuilder {
        return this._builder;
    }

    constructor(private _register : (api : Internal.IDecoratorRegistrationApi<T>) => Decorators.Register.IDecoratorRegisterResult) { }

    public provide(service: any) : Decorators.Register.IInitializedNamedReusedOwned<T> {

        Utils.checkNullArgument(service, 'service');

        this._service = service;

        return {
            initializeBy : this.initializeBy.bind(this),
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    }

    public initializeBy(action : Typeioc.IInitializer<T>) : Decorators.Register.INamedReusedOwned {

        this._initializedBy = action;

        return {
            named: this.named.bind(this),
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    }

    public named(name: string) : Decorators.Register.IReusedOwned {

        Utils.checkNullArgument(name, 'name');

        this._name = name;

        return {
            within: this.within.bind(this),
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    }

    public within(scope: Types.Scope) : Decorators.Register.IOwned {

        Utils.checkNullArgument(scope, 'scope');

        this._scope = scope;

        return {
            ownedBy: this.ownedBy.bind(this),
            register: this.register.bind(this),
        };
    }

    public ownedBy(owner : Types.Owner) : Decorators.Register.IRegister {

        Utils.checkNullArgument(owner, 'owner');

        this._owner = owner;

        return {
            register: this.register.bind(this),
        };
    }

    public register(builder? : Typeioc.IContainerBuilder) : Decorators.Register.IDecoratorRegisterResult {

        this._builder = builder;

        return this._register(this);
    }
}