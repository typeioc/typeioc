"use strict";

import ContainerDefiitionsModule = require('container/definitions');
import DefinitionModule = require('../definitions');;
import RegoDefinitionsModule = require('definitions');
import Utils = require('../utils');;

export class RegistrationBase implements  RegoDefinitionsModule.IRegistrationBase {
    private _service : any = null;
    private _factory : DefinitionModule.IFactory<any> = null;
    private _name : string = null;
    private _scope : RegoDefinitionsModule.Scope;
    private _owner : RegoDefinitionsModule.Owner;
    private _initializer : RegoDefinitionsModule.IInitializer<any> = null;
    private _args : any[];
    private _container : ContainerDefiitionsModule.IContainer;
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

    public get scope() : RegoDefinitionsModule.Scope {
        return this._scope;
    }

    public set scope(value : RegoDefinitionsModule.Scope) {
        this._scope = value;
    }

    public get owner() : RegoDefinitionsModule.Owner {
        return this._owner;
    }

    public set owner(value : RegoDefinitionsModule.Owner) {
        this._owner = value;
    }

    public get initializer() : RegoDefinitionsModule.IInitializer<any> {
        return this._initializer;
    }

    public set initializer(value : RegoDefinitionsModule.IInitializer<any> ) {
        this._initializer = value;
    }

    public get args() : any[] {
        return this._args;
    }

    public set args(value : any[]) {
        this._args = value;
    }

    public get container() : ContainerDefiitionsModule.IContainer {
        return this._container;
    }

    public set container(value : ContainerDefiitionsModule.IContainer) {
        this._container = value;
    }

    public get instance() : any {
        return this._instance;
    }

    public set instance(value : any) {
        this._instance = value;
    }

    public get invoker() : RegoDefinitionsModule.IInvoker {
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

    public cloneFor(container: ContainerDefiitionsModule.IContainer) : RegoDefinitionsModule.IRegistrationBase {
        var result = new RegistrationBase(this._service);
        result.factory = this._factory;
        result.container = container;
        result.owner = this._owner;
        result.scope = this._scope;
        result.initializer = this._initializer;

        return result;
    }

    public get factory() : DefinitionModule.IFactory<any> {
        return this._factory;
    }

    public set factory(value : DefinitionModule.IFactory<any>){
        this._factory = value;
    }
}