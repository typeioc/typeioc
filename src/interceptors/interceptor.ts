/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');
import SubstituteStorageModule = require('./substituteStorage');
import IStorage = Typeioc.Internal.Interceptors.IStorage;
import IProxy = Typeioc.Internal.Interceptors.IProxy;
import ISubstituteInfo = Typeioc.Interceptors.ISubstituteInfo;
import ISubstitute = Typeioc.Interceptors.ISubstitute;

export class Interceptor implements Typeioc.Interceptors.IInterceptor {

    private _storage : IStorage;

    constructor(private _proxy : IProxy) {
        this._storage = new SubstituteStorageModule.SubstituteStorage();
    }

    public intercept(subject : Function | Object, substitutes? : Array<ISubstituteInfo>) : Function | Object {

        Utils.checkNullArgument(subject, 'subject');

        var storage = substitutes ? this.transformSubstitutes(substitutes) : null;

        if(Utils.Reflection.isPrototype(subject)) {
            return this._proxy.byPrototype(<Function>subject, storage);
        }

        if(Utils.Reflection.isObject(subject)) {
            return this._proxy.byInstance(subject, storage);
        }

        throw new Exceptions.ArgumentError('subject', 'Subject should be a prototype function or an object');
    }

    private transformSubstitutes(substitutes : Array<ISubstituteInfo>) : IStorage {

        return substitutes.reduce((storage, current) => {

                var substitute = this.createSubstitute(current);
                this._storage.add(substitute);
                return this._storage;
            },
            this._storage);
    }

    private createSubstitute(value : ISubstituteInfo) : ISubstitute {

        if(!value.wrapper) {
            var error = new Exceptions.ArgumentError('wrapper', 'Missing interceptor wrapper');
            error.data = value;
            throw error;
        }

        return {
            method : value.method,
            type : value.type || Typeioc.Interceptors.CallInfoType.Any,
            wrapper : value.wrapper,
            next : null
        };
    }
}