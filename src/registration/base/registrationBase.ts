/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import { ApplicationError } from '../../exceptions';
import Internal = Typeioc.Internal;

export class RegistrationBase implements Internal.IRegistrationBase {
    private _factory : Typeioc.IFactory<any> = null;
    private _factoryType : any = null;
    private _factoryValue: any = null;
    private _name : string = null;
    private _scope : Typeioc.Types.Scope;
    private _owner : Typeioc.Types.Owner;
    private _initializer : Typeioc.IInitializer<any> = null;
    private _disposer : Typeioc.IDisposer<any> = null;
    private _args : any[];
    private _params : any[];
    private _container : Typeioc.IContainer;
    private _instance: any = null;
    private _dependenciesValue : Array<Typeioc.IDynamicDependency> = [];
    private _registrationType : Internal.RegistrationType;

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

    public get params() : any[] {
        return this._params;
    }

    public set params(value : any[]) {
        this._params = value;
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

    public get registrationType() : Internal.RegistrationType {
        if(!this._registrationType) {
            throw new ApplicationError('Unknown registration type');
        }
        
        return this._registrationType;
    }

    public get dependenciesValue() : Array<Typeioc.IDynamicDependency> {
        return this._dependenciesValue;
    }

    public set dependenciesValue(value: Array<Typeioc.IDynamicDependency>) {
        this._dependenciesValue = value || [];
    }
    public get factory() : Typeioc.IFactory<any> {
        return this._factory;
    }

    public set factory(value : Typeioc.IFactory<any>) {
        this._factory = value;
        this._registrationType = Internal.RegistrationType.Factory;
    }

    public get factoryType() : any {
        return this._factoryType;
    }

    public set factoryType(value : any) {
        this._factoryType = value;
        this._registrationType = Internal.RegistrationType.FactoryType;
    }

    public get factoryValue() : any {
        return this._factoryValue;
    }

    public set factoryValue(value) {
        this._factoryValue = value;
        this._registrationType = Internal.RegistrationType.FactoryValue;
    }

    constructor(private _service: any) {
        this.args = [];
        this.params = [];
    }

    public cloneFor(container: Typeioc.IContainer) : Internal.IRegistrationBase {
        var result = this.clone();
        result.container = container;
        return result;
    }

    public clone() : Internal.IRegistrationBase {
        var result = new RegistrationBase(this._service);
        result._factory = this._factory;
        result._factoryType = this._factoryType;
        result._factoryValue = this._factoryValue;
        result._registrationType = this._registrationType;
        result.owner = this._owner;
        result.scope = this._scope;
        result.initializer = this._initializer;
        result.params = this._params;
        result.dependenciesValue = this._dependenciesValue;

        return result;
    }

    public copyDependency(dependency: Typeioc.IDynamicDependency) {
        this.name = dependency.named;
        this.initializer = dependency.initializer;
        
        if(dependency.factory) {
            this.factory = dependency.factory;
        } else
        if(dependency.factoryType) {
            this.factoryType = dependency.factoryType;
        } else
        if('factoryValue' in dependency) {
            this.factoryValue = dependency.factoryValue;
        }
    }

    public checkRegistrationType() {
        /// throws exception when no type
        const regoType = this.registrationType;
    }
}