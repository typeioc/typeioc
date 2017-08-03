/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
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

        return this.intercept(subject, substitutes);
    }

    public interceptInstance<R extends Object>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R {

        return this.intercept(subject, substitutes);
    }

    public intercept<R extends (Function | Object)>(subject : R, substitutes? : ISubstituteInfo | Array<ISubstituteInfo>) : R {

        checkNullArgument(subject, 'subject');

        var data : any = substitutes;

        if(data && !Reflection.isArray(data)) {
            data = [ substitutes ];
        }

        var storage = data ? this.transformSubstitutes(data) : null;

        var result : any;
        var argument : any = subject;

        if(Reflection.isPrototype(argument)) {

            result = this._proxy.byPrototype(argument, storage);

        }else if(Reflection.isObject(argument)) {

            result = this._proxy.byInstance(argument, storage);
        } else {

            throw new ArgumentError('subject', 'Subject should be a prototype function or an object');
        }

        return result;
    }

    private transformSubstitutes(substitutes : Array<ISubstituteInfo>) : IStorage {

        var storage = new SubstituteStorage();

        return substitutes.reduce((storage, current) => {

                var substitute = this.createSubstitute(current);
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