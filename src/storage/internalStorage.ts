/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/hashes.d.ts" />


'use strict';

import { StorageKeyNotFoundError } from '../exceptions';
import { HashTable } from 'hashes';
import Internal = Typeioc.Internal;

export class InternalStorage<K,T> implements Internal.IInternalStorage<K, T> {

    private _collection  : hashes.IHashTable<K, T>;

    constructor() {
        this._collection = new HashTable<K, T>();
    }

    public add(key : K, value : T) : void {
        this._collection.add(key, value, true)
    }

    public get(key : K) : T {

        if(!this.contains(key)) {
            var error = new StorageKeyNotFoundError();
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