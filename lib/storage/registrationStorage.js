/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
var Utils = require('../utils/index');
var RegistrationStorage = (function () {
    function RegistrationStorage(storageService) {
        this.storageService = storageService;
        this._addStrategy = [];
        this._getStrategy = [];
        this._internalStorage = storageService.create();
        this._addStrategy[1] = this.addForTypeFactory.bind(this);
        this._addStrategy[0] = this.addForFactory.bind(this);
        this._getStrategy[StorageType.TypeFactory] = this.getForTypeFactory.bind(this);
        this._getStrategy[StorageType.Factory] = this.getForFactory.bind(this);
    }
    RegistrationStorage.prototype.addEntry = function (registration) {
        var strategy = this._addStrategy[registration.forInstantiation ? 1 : 0];
        strategy(registration);
    };
    RegistrationStorage.prototype.getEntry = function (registration) {
        var storage = this._internalStorage.tryGet(registration.service);
        if (!storage)
            return undefined;
        return this._getStrategy[storage.type](registration, storage);
    };
    RegistrationStorage.prototype.addForTypeFactory = function (registration) {
        var storage = this._internalStorage.register(registration.service, this.emptyTypeFactoryBucket);
        storage.type = StorageType.TypeFactory;
        storage.typeFactory.registration = registration;
        if (registration.name) {
            storage.typeFactory.names[registration.name] = registration;
        }
    };
    RegistrationStorage.prototype.addForFactory = function (registration) {
        var storage = this._internalStorage.register(registration.service, this.emptyFactoryBucket);
        var argsCount = this.getArgumentsCount(registration);
        storage.type = StorageType.Factory;
        if (!registration.name) {
            storage.factory.noName[argsCount] = registration;
        }
        else {
            var bucket = storage.factory.names[registration.name] || {};
            bucket[argsCount] = registration;
            storage.factory.names[registration.name] = bucket;
        }
    };
    RegistrationStorage.prototype.getForTypeFactory = function (registration, storage) {
        return !registration.name ? storage.typeFactory.registration :
            storage.typeFactory.names[registration.name];
    };
    RegistrationStorage.prototype.getForFactory = function (registration, storage) {
        var argsCount = this.getArgumentsCount(registration);
        var name = storage.factory.names[registration.name];
        return registration.name ?
            (name ? name[argsCount] : undefined) :
            storage.factory.noName[argsCount];
    };
    RegistrationStorage.prototype.getArgumentsCount = function (registration) {
        return registration.factory ?
            Utils.Reflection.getFactoryArgsCount(registration.factory) :
            registration.args.length;
    };
    RegistrationStorage.prototype.emptyTypeFactoryBucket = function () {
        return {
            typeFactory: {
                registration: null,
                names: {}
            },
            factory: null
        };
    };
    RegistrationStorage.prototype.emptyFactoryBucket = function () {
        return {
            typeFactory: null,
            factory: {
                noName: {},
                names: {}
            }
        };
    };
    return RegistrationStorage;
})();
exports.RegistrationStorage = RegistrationStorage;
var StorageType;
(function (StorageType) {
    StorageType[StorageType["Factory"] = 0] = "Factory";
    StorageType[StorageType["TypeFactory"] = 1] = "TypeFactory";
})(StorageType || (StorageType = {}));
//# sourceMappingURL=registrationStorage.js.map