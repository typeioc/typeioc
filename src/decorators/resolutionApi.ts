/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

///<reference path="../../d.ts/typeioc.internal.d.ts" />

'use strinct';

import Internal = Typeioc.Internal;
import Resolve = Typeioc.Decorators.Resolve;

export class ResolutionApi implements Internal.IDecoratorResolutionApi {
    private _container : Typeioc.IContainer;
    private _name : string;
    private _attempt : boolean;
    private _service: any;
    private _args: Array<any> = [];

    private _cache : Internal.IApiCache = {
        use: false,
        name: <string>undefined
    };

    public get container() : Typeioc.IContainer {
        return this._container;
    }

    public get service() : any {
        return this._service;
    }

    public get args() : Array<any> {
        return this._args;
    }

    public get name() : string {
        return this._name;
    }

    public get attempt() : boolean{
        return this._attempt;
    }

    public get cache() : Internal.IApiCache {
        return this._cache;
    }

    constructor(private _resolve : (api : Internal.IDecoratorResolutionApi ) => Resolve.IDecoratorResolutionResult) { }

    public by(service? : any) : Resolve.IArgsTryNamedCache {

        this._service = service;

        return {
            args: this.argsAction.bind(this),
            attempt : this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }

    private argsAction(...value: Array<any>) : Resolve.ITryNamedCache {
        this._args = value;

        return {
            attempt : this.attemptAction.bind(this),
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }

    private attemptAction() : Resolve.INamedCache {

        this._attempt = true;

        return {
            name: this.nameAction.bind(this),
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }

    private nameAction(value : string) : Resolve.ICache {

        this._name = value;

        return {
            cache: this.cacheAction.bind(this),
            resolve: this.resolveAction.bind(this)
        };
    }

    private cacheAction(name? : string) : Resolve.IResolve {
        this._cache = {
            use: true,
            name: name
        };

        return this.resolveAction.bind(this)
    }

    private resolveAction(container?: Typeioc.IContainer) : Resolve.IDecoratorResolutionResult {
        this._container = container;

        return this._resolve(this);
    }
}