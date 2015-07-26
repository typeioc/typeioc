/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/node.d.ts" />
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Exceptions = require('../exceptions/index');
var hashes = require('hashes');
var InternalStorage = (function () {
    function InternalStorage() {
        this._collection = new hashes.HashTable();
    }
    InternalStorage.prototype.add = function (key, value) {
        this._collection.add(key, value, true);
    };
    InternalStorage.prototype.get = function (key) {
        if (!this.contains(key)) {
            var error = new Exceptions.StorageKeyNotFoundError();
            error.data = { key: key };
            throw error;
        }
        return this._collection.get(key).value;
    };
    InternalStorage.prototype.tryGet = function (key) {
        return this.contains(key) ? this._collection.get(key).value : undefined;
    };
    InternalStorage.prototype.register = function (key, defaultValue) {
        if (!this.contains(key)) {
            var result = defaultValue();
            this.add(key, result);
        }
        else {
            result = this.get(key);
        }
        return result;
    };
    InternalStorage.prototype.contains = function (key) {
        return this._collection.contains(key);
    };
    return InternalStorage;
})();
exports.InternalStorage = InternalStorage;
//# sourceMappingURL=internalStorage.js.map