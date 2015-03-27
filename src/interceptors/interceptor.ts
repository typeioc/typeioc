/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');
import Exceptions = require('../exceptions/index');

export class Interceptor {

    constructor(private _proxy : Typeioc.Internal.Interceptors.IProxy) { }

    public intercept(subject : Function, substitutes : Array<Typeioc.Interceptors.ISubstituteInfo>) {

        var storage = this.transformSubstitutes(substitutes);

        this._proxy.fromPrototype(subject, storage);
    }

    private transformSubstitutes(substitutes : Array<Typeioc.Interceptors.ISubstituteInfo>) : Typeioc.Internal.Interceptors.IStorage {

        return substitutes.reduce((storage, current) => {
                this.addToStorage(storage, current);
                return storage;
            },
            <Typeioc.Internal.Interceptors.IStorage>{
                known : {},
                unknown: {}
            });
    }

    private addToStorage(storage : Typeioc.Internal.Interceptors.IStorage,
                         value : Typeioc.Interceptors.ISubstituteInfo) {

        var substitute = this.createSubstitute(value);
        var key = value.method;

        if(!key) {

            this.addToTypedStorage(storage.unknown, substitute);
            return;
        }

        var item = storage.known[key];

        if(!item) {
            item = {};
            storage.known[key] = item;

        }

        this.addToTypedStorage(item, substitute);
    }

    private addToTypedStorage(
            storage : Typeioc.Internal.IIndexedCollection<Typeioc.Internal.Interceptors.IList>,
            substitute : Typeioc.Interceptors.ISubstitute) {
        var item = storage[substitute.type];

        if(!item) {
            item = {
                head : substitute,
                tail : substitute
            };

            storage[substitute.type] = item;
        } else {
            item.tail.next = substitute;
            item.tail = item.tail.next;
        }
    }

    private createSubstitute(value : Typeioc.Interceptors.ISubstituteInfo) : Typeioc.Interceptors.ISubstitute {

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