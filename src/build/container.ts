/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import { checkNullArgument, concat} from '../utils';
import { ResolutionError } from '../exceptions';


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
    
    public async disposeAsync() : Promise<void> {
        
         return new Promise<void>(resolve => {
           this._container.dispose();
           resolve();
        });
    }

    public resolve<R>(service: R, ...args:any[]) : R {

        checkNullArgument(service, 'service');

        args = concat([service], args);

        return this._container.resolve.apply(this._container, args);
    }
    
    public async resolveAsync<R>(service: any, ...args:any[]) : Promise<R> {
        
        return new Promise<R>(resolve => {
           resolve(this.resolve<R>(service, ...args));
        });
    }

    public tryResolve<R>(service: R, ...args:any[]) : R {

        checkNullArgument(service, 'service');

        args = concat([service], args);

        return this._container.tryResolve.apply(this._container, args);
    }
    
    public async tryResolveAsync<R>(service: any, ...args:any[]) : Promise<R> {
        
        return new Promise<R>(resolve => {
           resolve(this.tryResolve<R>(service, ...args));
        });
    }

    public resolveNamed<R>(service: R, name : string, ...args:any[]) : R {

        checkNullArgument(service, 'service');

        args = concat([service, name], args);

        return this._container.resolveNamed.apply(this._container, args);
    }
    
    public async resolveNamedAsync<R>(service: any, name : string, ...args:any[]) : Promise<R> {
        
        return new Promise<R>(resolve => {
           resolve(this.resolveNamed<R>(service, name, ...args));
        });
    }

    public tryResolveNamed<R>(service: R, name : string, ...args:any[]) : R {

        checkNullArgument(service, 'service');

        args = concat([service, name], args);

        return this._container.tryResolveNamed.apply(this._container, args);
    }
    
    public async tryResolveNamedAsync<R>(service: any, name : string, ...args:any[]) : Promise<R> {
        
        return new Promise<R>(resolve => {
           resolve(this.tryResolveNamed<R>(service, name, ...args));
        });
    }

    public resolveWithDependencies<R>(service: R, dependencies : Typeioc.IDynamicDependency[]) : R {

        checkNullArgument(service, 'service');

        if(!dependencies || dependencies.length <= 0)
            throw new ResolutionError('No dependencies provided');

        return this._container.resolveWithDependencies<R>(service, dependencies);
    }
    
    public async resolveWithDependenciesAsync<R>(service: any, dependencies : Typeioc.IDynamicDependency[]) : Promise<R> {
        
        return new Promise<R>(resolve => {
           resolve(this.resolveWithDependencies<R>(service, dependencies));
        });
    }

    public resolveWith<R>(service : any) : Typeioc.IResolveWith<R> {

        checkNullArgument(service, 'service');

        return this._container.resolveWith<R>(service);
    }
}