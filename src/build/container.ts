/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');


export class Container implements Typeioc.IContainer {

    constructor(private _container : Typeioc.Internal.IContainer) { }

    public get cache() : any {
        return this._container.cache;
    }

    public createChild() : Typeioc.IContainer {

        return new Container(<Typeioc.Internal.IContainer>this._container.createChild());
    }

    public dispose() : void {
        this._container.dispose();
    }

    public resolve<R>(service: R, ...args:any[]) : R {

        Utils.checkNullArgument(service, 'service');

        args = Utils.concat([service], args);

        return this._container.resolve.apply(this._container, args);
    }

    public tryResolve<R>(service: R, ...args:any[]) : R {

        Utils.checkNullArgument(service, 'service');

        args = Utils.concat([service], args);

        return this._container.tryResolve.apply(this._container, args);
    }

    public resolveNamed<R>(service: R, name : string, ...args:any[]) : R {

        Utils.checkNullArgument(service, 'service');

        args = Utils.concat([service, name], args);

        return this._container.resolveNamed.apply(this._container, args);
    }

    public tryResolveNamed<R>(service: R, name : string, ...args:any[]) : R {

        Utils.checkNullArgument(service, 'service');

        args = Utils.concat([service, name], args);

        return this._container.tryResolveNamed.apply(this._container, args);
    }

    public resolveWithDependencies<R>(service: R, dependencies : Typeioc.IDynamicDependency[]) : R {

        Utils.checkNullArgument(service, 'service');

        if(!dependencies || dependencies.length <= 0)
            throw new Exceptions.ResolutionError('No dependencies provided');

        return this._container.resolveWithDependencies<R>(service, dependencies);
    }

    public resolveWith<R>(service : any) : Typeioc.IResolveWith<R> {

        Utils.checkNullArgument(service, 'service');

        return this._container.resolveWith<R>(service);
    }
}