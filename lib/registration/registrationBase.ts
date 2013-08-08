/// <reference path="../t.d.ts/enums.d.ts" />
/// <reference path="../t.d.ts/container.d.ts" />
/// <reference path="../t.d.ts/registration.d.ts" />

"use strict";


import Utils = require('../utils');
import Defaults = require('../configuration/defaults');

export class RegistrationBase implements  Typeioc.IRegistrationBase {
    private _service : any = null;
    private _factory : Typeioc.IFactory<any> = null;
    private _name : string = null;
    private _scope : Defaults.Scope;
    private _owner : Defaults.Owner;
    private _initializer : Typeioc.IInitializer<any> = null;
    private _args : any[];
    private _container : Typeioc.IContainer;
    private _instance: any = null;

    public get name() : string {
        return this._name;
    }

    public set name(value : string) {
        this._name = value;
    }

    public get service() : any {
        return this._service;
    }

    public get scope() : Defaults.Scope {
        return this._scope;
    }

    public set scope(value : Defaults.Scope) {
        this._scope = value;
    }

    public get owner() : Defaults.Owner {
        return this._owner;
    }

    public set owner(value : Defaults.Owner) {
        this._owner = value;
    }

    public get initializer() : Typeioc.IInitializer<any> {
        return this._initializer;
    }

    public set initializer(value : Typeioc.IInitializer<any> ) {
        this._initializer = value;
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

    public get invoker() : Typeioc.IInvoker {
        var self = this;
        return () => {
            self.args.splice(0, 0, self.container);
            return self.factory.apply(self.factory, self.args);
        };
    }

    constructor(service: any) {
        this._service = service;
        this.args = [];
    }

    public toNamedKey() : string {

        var argsCount = this._factory ? Utils.getFactoryArgsCount(this._factory) : this._args.length;

        return [this._name || "_", ":", argsCount .toString()].join(" ");
    }

    public cloneFor(container: Typeioc.IContainer) : Typeioc.IRegistrationBase {
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
}