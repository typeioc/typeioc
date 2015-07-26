/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');

export class Api<T> implements Typeioc.Internal.IContainerApi<T>{
    private _service: T;
    private _name:string;

    private _cache : Typeioc.Internal.IApiCache = {
        use: false,
        name: <string>undefined
    };

    private _dependencies : Array<Typeioc.IDynamicDependency> = [];
    private _attempt = false;
    private _args : Array<any> = [];

    public get serviceValue() : T {
        return this._service;
    }

    public get nameValue() : string {
        return this._name;
    }

    public get cacheValue() : Typeioc.Internal.IApiCache  {
        return this._cache;
    }

    public get dependenciesValue() : Array<Typeioc.IDynamicDependency>  {
        return this._dependencies;
    }

    public get isDependenciesResolvable() : boolean {
        return this._dependencies && this._dependencies.length > 0;
    }

    public get attemptValue() : boolean  {
        return this._attempt;
    }

    public get throwResolveError() : boolean {
        return !this.attemptValue;
    }

    public get argsValue() : Array<any> {
        return this._args;
    }

    constructor(private _container : Typeioc.Internal.IImportApi<T>) { }

    public service(value : any) : Typeioc.IResolveWith<T> {

        Utils.checkNullArgument(value, 'value');

        this._service = value;

        return {
            args: this.args.bind(this),
            attempt: this.attempt.bind(this),
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        }
    }

    private args(...args : Array<any>) : Typeioc.IResolveTryNamedDepCache<T> {
        this._args = args;

        return {
            attempt: this.attempt.bind(this),
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    }

    private attempt() : Typeioc.IResolveNamedDepCache<T>{
        this._attempt = true;

        return {
            name: this.name.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    }

    private name(value : string) : Typeioc.IResolveDepCache<T> {
        this._name = value;

        return {
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    }

    private dependencies(data : Typeioc.IDynamicDependency | Array<Typeioc.IDynamicDependency>) : Typeioc.IResolveDependencies<T>
    {
        var item : any = data;

        if(Array.isArray(item)) {
            this._dependencies.push.apply(this._dependencies, item);
        } else {
            this._dependencies.push(item);
        }

        return {
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    }

    private cache(name? : string) : Typeioc.IResolveReturn<T> {
        this._cache.use = true;
        this._cache.name = name;

        return {
            exec : this.exec.bind(this)
        };
    }

    private exec() : T {
        return this._container.execute(this);
    }
}