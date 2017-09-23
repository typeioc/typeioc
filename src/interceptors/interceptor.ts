/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.1.1
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import { Reflection, checkNullArgument } from '../utils';
import { ArgumentError } from '../exceptions';
import { SubstituteStorage } from './substituteStorage';
import IStorage = Typeioc.Internal.Interceptors.IStorage;
import IProxy = Typeioc.Internal.Interceptors.IProxy;
import ISubstituteInfo = Addons.Interceptors.ISubstituteInfo;
import ISubstitute = Addons.Interceptors.ISubstitute;


export class Interceptor implements Addons.Interceptors.IInterceptor {

    constructor(private _proxy : IProxy) { }

    public interceptPrototype<R extends Function>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R {
        const storage = this.convertParams(subject, substitutes);
        return this._proxy.byPrototype(subject, storage) as R;
    }

    public interceptInstance<R extends Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R {
        const storage = this.convertParams(subject, substitutes);
        return this._proxy.byInstance(subject, storage) as R;
    }

    public intercept<R extends (Function | Object)>(subject: R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R {
        const storage = this.convertParams(subject, substitutes);
        return this.convertToIntercept(subject, storage);
    }

    public withSubstitute(substitute: ISubstituteInfo): Addons.Interceptors.IWithSubstituteResult {
        checkNullArgument(substitute.method, 'method');

        const storage = new SubstituteStorage();

        const interceptInstance = <R>(subject): R => {
            return this._proxy.byInstance(subject, storage) as R;
        };

        const interceptPrototype = <R extends Function>(subject): R => {
            return this._proxy.byPrototype(subject, storage) as R;
        };

        const intercept = <R extends (Function | Object)>(subject): R => {
            return this.convertToIntercept(subject, storage);
        };

        return this.with(
            interceptInstance,
            interceptPrototype,
            intercept,
            storage,
            substitute);
    }

    private with(
        interceptInstance: <R extends Object>(subject: R) => R,
        interceptPrototype: <R extends Function>(subject) => R,
        intercept: <R extends (Function | Object)>(subject: R) => R,
        storage : IStorage,
        substitute: ISubstituteInfo) {
        
        checkNullArgument(substitute.method, 'method');

        storage.add(this.createSubstitute(substitute));
        
        return {
            withSubstitute: this.with.bind(
                this, interceptInstance, interceptPrototype, intercept, storage),
            interceptInstance,
            interceptPrototype,
            intercept
        };
    }

    private convertParams<R extends (Function | Object)>(
        subject: R,
        substitutes? : ISubstituteInfo | Array<ISubstituteInfo>): IStorage {
        
        checkNullArgument(subject, 'subject');
    
        var data : any = substitutes;

        if(data && !Reflection.isArray(data)) {
            data = [ substitutes ];
        }

        return data ? this.transformSubstitutes(data) : null;
    }

    private convertToIntercept(subject: any, storage: IStorage) : any {
        var result : any;
        var argument : any = subject;

        if(Reflection.isPrototype(argument)) {

            result = this._proxy.byPrototype(argument, storage);

        } else if(Reflection.isObject(argument)) {

            result = this._proxy.byInstance(argument, storage);
        } else {
            throw new ArgumentError('subject', 'Subject should be a prototype function or an object');
        }

        return result;
    }

    private transformSubstitutes(substitutes : Array<ISubstituteInfo>) : IStorage {

        const storage = new SubstituteStorage();

        return substitutes.reduce((storage, current) => {
            const substitute = this.createSubstitute(current);
            storage.add(substitute);
            return storage;
        },
        storage);
}

    private createSubstitute(value : ISubstituteInfo) : ISubstitute {

        if(!value.wrapper) {
            var error = new ArgumentError('wrapper', 'Missing interceptor wrapper');
            error.data = value;
            throw error;
        }

        return {
            method : value.method,
            type : value.type || Addons.Interceptors.CallInfoType.Any,
            wrapper : value.wrapper,
            next : null
        };
    }
}