/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../../d.ts/typeioc.internal.d.ts" />

'use strict';

export class RegistrationBase implements Typeioc.Internal.IRegistrationBase {
    private _factory : Typeioc.IFactory<any> = null;
    private _name : string = null;
    private _scope : Typeioc.Types.Scope;
    private _owner : Typeioc.Types.Owner;
    private _initializer : Typeioc.IInitializer<any> = null;
    private _disposer : Typeioc.IDisposer<any> = null;
    private _args : any[];
    private _container : Typeioc.IContainer;
    private _instance: any = null;
    private _forInstantiation : boolean = false;

    public get name() : string {
        return this._name;
    }

    public set name(value : string) {
        this._name = value;
    }

    public get service() : any {
        return this._service;
    }

    public get scope() : Typeioc.Types.Scope {
        return this._scope;
    }

    public set scope(value : Typeioc.Types.Scope) {
        this._scope = value;
    }

    public get owner() : Typeioc.Types.Owner {
        return this._owner;
    }

    public set owner(value : Typeioc.Types.Owner) {
        this._owner = value;
    }

    public get initializer() : Typeioc.IInitializer<any> {
        return this._initializer;
    }

    public set initializer(value : Typeioc.IInitializer<any> ) {
        this._initializer = value;
    }

    public get disposer() : Typeioc.IDisposer<any> {
        return this._disposer;
    }

    public set disposer(value : Typeioc.IDisposer<any> ) {
        this._disposer = value;
    }

    public get args() : any[] {
        return this._args;
    }

    public set args(value : any[]) {
        this._args = value;
    }

    public get container() : Typeioc.IContainer {
        return this._container;
    }

    public set container(value : Typeioc.IContainer) {
        this._container = value;
    }

    public get instance() : any {
        return this._instance;
    }

    public set instance(value : any) {
        this._instance = value;
    }

    public get forInstantiation() : boolean {
        return this._forInstantiation;
    }

    public set forInstantiation(value : boolean) {
        this._forInstantiation = value;
    }

    constructor(private _service: any) {
        this.args = [];
    }

    public cloneFor(container: Typeioc.IContainer) : Typeioc.Internal.IRegistrationBase {
        var result = new RegistrationBase(this._service);
        result.factory = this._factory;
        result.container = container;
        result.owner = this._owner;
        result.scope = this._scope;
        result.initializer = this._initializer;

        return result;
    }

    public get factory() : Typeioc.IFactory<any> {
        return this._factory;
    }

    public set factory(value : Typeioc.IFactory<any>){
        this._factory = value;
    }

    public invoke() : any {

        var args = [this.container].concat(this.args.slice(0));
        return this.factory.apply(this.factory, args);
    }
}