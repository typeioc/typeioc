/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
/// <reference path="../../d.ts/hashes.d.ts" />
'use strict';
const exceptions_1 = require('../exceptions');
const hashes_1 = require('hashes');
class InternalStorage {
    constructor() {
        this._collection = new hashes_1.HashTable();
    }
    add(key, value) {
        this._collection.add(key, value, true);
    }
    get(key) {
        if (!this.contains(key)) {
            var error = new exceptions_1.StorageKeyNotFoundError();
            error.data = { key: key };
            throw error;
        }
        return this._collection.get(key).value;
    }
    tryGet(key) {
        return this.contains(key) ? this._collection.get(key).value : undefined;
    }
    register(key, defaultValue) {
        if (!this.contains(key)) {
            var result = defaultValue();
            this.add(key, result);
        }
        else {
            result = this.get(key);
        }
        return result;
    }
    contains(key) {
        return this._collection.contains(key);
    }
}
exports.InternalStorage = InternalStorage;
//# sourceMappingURL=internalStorage.js.map