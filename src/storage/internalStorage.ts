/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Exceptions = require('../exceptions/index');
var hashes = require('hashes');

interface IHashTable<K, T> {
    add(key : K, value : T, override : boolean) : void;
    get(key : K) : { value : T};
    contains(key : K) : boolean;
}


export class InternalStorage<K,T> implements Typeioc.Internal.IInternalStorage<K, T> {

    private _collection  : IHashTable<K, T>;

    constructor() {
        this._collection = new hashes.HashTable();
    }

    public add(key : K, value : T) : void {
        this._collection.add(key, value, true)
    }

    public get(key : K) : T {

        if(!this.contains(key)) {
            var error = new Exceptions.StorageKeyNotFoundError();
            error.data = {key : key};
            throw error;
        }

        return this._collection.get(key).value;
    }

    public tryGet(key : K) : T {
        return this.contains(key) ? this._collection.get(key).value : undefined;
    }

    public register(key: K, defaultValue: () => T) : T {
        if(!this.contains(key)) {
            var result = defaultValue();
            this.add(key, result);
        } else {
            result = this.get(key);
        }

        return result;
    }

    public contains (key : K) : boolean {
        return this._collection.contains(key);
    }
}