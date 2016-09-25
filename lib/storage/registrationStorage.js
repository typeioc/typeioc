/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
/// <reference path="../../d.ts/typeioc.internal.d.ts" />
'use strict';
const utils_1 = require('../utils');
class RegistrationStorage {
    constructor(storageService) {
        this.storageService = storageService;
        this._addStrategy = [];
        this._getStrategy = [];
        this._internalStorage = storageService.create();
        this._addStrategy[1] = this.addForTypeFactory.bind(this);
        this._addStrategy[0] = this.addForFactory.bind(this);
        this._getStrategy[StorageType.TypeFactory] = this.getForTypeFactory.bind(this);
        this._getStrategy[StorageType.Factory] = this.getForFactory.bind(this);
    }
    addEntry(registration) {
        var strategy = this._addStrategy[registration.forInstantiation ? 1 : 0];
        strategy(registration);
    }
    getEntry(registration) {
        var storage = this._internalStorage.tryGet(registration.service);
        if (!storage)
            return undefined;
        return this._getStrategy[storage.type](registration, storage);
    }
    addForTypeFactory(registration) {
        var storage = this._internalStorage.register(registration.service, this.emptyTypeFactoryBucket);
        storage.type = StorageType.TypeFactory;
        storage.typeFactory.registration = registration;
        if (registration.name) {
            storage.typeFactory.names[registration.name] = registration;
        }
    }
    addForFactory(registration) {
        var storage = this._internalStorage.register(registration.service, this.emptyFactoryBucket);
        var argsCount = this.getArgumentsCount(registration);
        storage.type = StorageType.Factory;
        if (!registration.name) {
            storage.factory.noName[argsCount] = registration;
        }
        else {
            let bucket = storage.factory.names[registration.name] || {};
            bucket[argsCount] = registration;
            storage.factory.names[registration.name] = bucket;
        }
    }
    getForTypeFactory(registration, storage) {
        return !registration.name ? storage.typeFactory.registration :
            storage.typeFactory.names[registration.name];
    }
    getForFactory(registration, storage) {
        let argsCount = this.getArgumentsCount(registration);
        let name = storage.factory.names[registration.name];
        return registration.name ?
            (name ? name[argsCount] : undefined) :
            storage.factory.noName[argsCount];
    }
    getArgumentsCount(registration) {
        return registration.factory ?
            utils_1.Reflection.getFactoryArgsCount(registration.factory) :
            registration.args.length;
    }
    emptyTypeFactoryBucket() {
        return {
            typeFactory: {
                registration: null,
                names: {}
            },
            factory: null
        };
    }
    emptyFactoryBucket() {
        return {
            typeFactory: null,
            factory: {
                noName: {},
                names: {}
            }
        };
    }
}
exports.RegistrationStorage = RegistrationStorage;
var StorageType;
(function (StorageType) {
    StorageType[StorageType["Factory"] = 0] = "Factory";
    StorageType[StorageType["TypeFactory"] = 1] = "TypeFactory";
})(StorageType || (StorageType = {}));
//# sourceMappingURL=registrationStorage.js.map