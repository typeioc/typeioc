/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/typeioc.addons.d.ts" />

'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');
import SubstituteStorageModule = require('./substituteStorage');
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

        Utils.checkNullArgument(subject, 'subject');

        var data : any = substitutes;

        if(data && !Utils.Reflection.isArray(data)) {
            data = [ substitutes ];
        }

        var storage = data ? this.transformSubstitutes(data) : null;

        var result : any;
        var argument : any = subject;

        if(Utils.Reflection.isPrototype(argument)) {

            result = this._proxy.byPrototype(argument, storage);

        }else if(Utils.Reflection.isObject(argument)) {

            result = this._proxy.byInstance(argument, storage);
        } else {

            throw new Exceptions.ArgumentError('subject', 'Subject should be a prototype function or an object');
        }

        return result;
    }

    private transformSubstitutes(substitutes : Array<ISubstituteInfo>) : IStorage {

        var storage = new SubstituteStorageModule.SubstituteStorage();

        return substitutes.reduce((storage, current) => {

                var substitute = this.createSubstitute(current);
                storage.add(substitute);
                return storage;
            },
            storage);
    }

    private createSubstitute(value : ISubstituteInfo) : ISubstitute {

        if(!value.wrapper) {
            var error = new Exceptions.ArgumentError('wrapper', 'Missing interceptor wrapper');
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