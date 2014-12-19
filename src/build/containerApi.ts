/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2014 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.6
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

export interface IImportApi {
    import<R>(api : Api<R>) : R;
}

export class Api<T> {
    private _service: any;
    private _name:string;

    private _cache = {
        use: false,
        name: <string>undefined
    };

    private _dependencies:Array<Typeioc.IDynamicDependency> = [];
    private _try = false;
    private _args:Array<any> = [];

    constructor(private _container : IImportApi) {

    }

    public service(value : any) : Typeioc.IResolveWith<T> {
        this._service = value;

        return {
            name: this.name.bind(this),
            args: this.args.bind(this),
            try: this.try.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        }
    }

    private name(value : string) : Typeioc.IResolveArgsTryDepCache<T> {
        this._name = value;

        return {
            args: this.args.bind(this),
            try: this.try.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    }

    private args(data : Array<any>) : Typeioc.IResolveTryDepCache<T> {
        this._args = data;

        return {
            try: this.try.bind(this),
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    }

    private try() : Typeioc.IResolveDepCache<T>{
        this._try = true;

        return {
            dependencies: this.dependencies.bind(this),
            cache: this.cache.bind(this),
            exec: this.exec.bind(this)
        };
    }

    private dependencies(data : Array<Typeioc.IDynamicDependency>) : Typeioc.IResolveCacheReturn<T>
    {
        this._dependencies = data;

        return {
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
        return this._container.import(this);
    }
}



