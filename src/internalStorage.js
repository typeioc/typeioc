/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/typeioc.d.ts" />
'use strict';
var Utils = require('./utils');
var Exceptions = require('./exceptions');

var hashes = require('hashes');

var InternalStorage = (function () {
    function InternalStorage() {
        this._collection = new hashes.HashTable();
    }
    InternalStorage.prototype.addEntry = function (registration) {
        if (!this.contains(registration.service)) {
            var storage = this.emptyBucket;
            this.add(registration.service, storage);
        } else {
            storage = this.get(registration.service);
        }

        var argsCount = this.getArgumentsCount(registration);

        if (!registration.name) {
            storage[argsCount] = registration;
        } else {
            var argsStorage = storage[registration.name];
            if (!argsStorage) {
                argsStorage = this.emptyArgsBucket;
                storage[registration.name] = argsStorage;
            }

            argsStorage[argsCount] = registration;
        }
    };

    InternalStorage.prototype.getEntry = function (registration) {
        try  {
            if (!this.contains(registration.service))
                return null;

            var storage = this.get(registration.service);
            var argsCount = this.getArgumentsCount(registration);

            if (!registration.name) {
                return storage[argsCount];
            } else {
                var argsStorage = storage[registration.name];

                if (!argsStorage)
                    return null;

                return argsStorage[argsCount];
            }
        } catch (error) {
            var resolutionError = new Exceptions.ResolutionError('Error constructing service key');
            resolutionError.innerError = error;

            throw resolutionError;
        }
    };

    InternalStorage.prototype.getArgumentsCount = function (registration) {
        return registration.factory ? Utils.getFactoryArgsCount(registration.factory) : registration.args.length;
    };

    InternalStorage.prototype.add = function (key, value) {
        this._collection.add(key, value, true);
    };

    InternalStorage.prototype.get = function (key) {
        return this._collection.get(key).value;
    };

    InternalStorage.prototype.contains = function (key) {
        return this._collection.contains(key);
    };

    Object.defineProperty(InternalStorage.prototype, "emptyBucket", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(InternalStorage.prototype, "emptyArgsBucket", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    return InternalStorage;
})();
exports.InternalStorage = InternalStorage;
