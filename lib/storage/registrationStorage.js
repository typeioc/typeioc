/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2017 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v2.0.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class RegistrationStorage {
    constructor(storageService) {
        this.storageService = storageService;
        this._addStrategy = [];
        this._getStrategy = [];
        this._internalStorage = storageService.create();
        this._addStrategy[1 /* factoryType */] = this.addForTypeFactory.bind(this);
        this._addStrategy[0 /* factory */] = this.addForFactory.bind(this);
        this._addStrategy[2 /* factoryValue */] = this.addForValueFactory.bind(this);
        this._getStrategy[StorageType.TypeFactory] = this.getForTypeFactory.bind(this);
        this._getStrategy[StorageType.Factory] = this.getForFactory.bind(this);
        this._getStrategy[StorageType.ValueFactory] = this.getForValueFactory.bind(this);
    }
    addEntry(registration) {
        var strategy = this._addStrategy[registration.registrationType];
        strategy(registration);
    }
    getEntry(registration) {
        var storage = this._internalStorage.tryGet(registration.service);
        if (!storage)
            return undefined;
        return this._getStrategy[storage.type](registration, storage);
    }
    clear() {
        this._internalStorage.clear();
    }
    addForTypeFactory(registration) {
        var storage = this._internalStorage.register(registration.service, this.emptyTypeFactoryBucket);
        storage.type = StorageType.TypeFactory;
        if (!registration.name) {
            storage.typeFactory.noName = registration;
        }
        else {
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
    addForValueFactory(registration) {
        var storage = this._internalStorage.register(registration.service, this.emptyValueFactoryBucket);
        storage.type = StorageType.ValueFactory;
        if (!registration.name) {
            storage.valueFactory.noName = registration;
        }
        else {
            storage.valueFactory.names[registration.name] = registration;
        }
    }
    getForTypeFactory(registration, storage) {
        return !registration.name ? storage.typeFactory.noName :
            storage.typeFactory.names[registration.name];
    }
    getForFactory(registration, storage) {
        let argsCount = this.getArgumentsCount(registration);
        let name = storage.factory.names[registration.name];
        return registration.name ?
            (name ? name[argsCount] : undefined) :
            storage.factory.noName[argsCount];
    }
    getForValueFactory(registration, storage) {
        return !registration.name ? storage.valueFactory.noName :
            storage.valueFactory.names[registration.name];
    }
    getArgumentsCount(registration) {
        return registration.factory ?
            utils_1.Reflection.getFactoryArgsCount(registration.factory) :
            registration.args.length;
    }
    emptyTypeFactoryBucket() {
        return {
            typeFactory: {
                noName: null,
                names: {}
            },
            valueFactory: null,
            factory: null
        };
    }
    emptyValueFactoryBucket() {
        return {
            typeFactory: null,
            valueFactory: {
                noName: null,
                names: {}
            },
            factory: null
        };
    }
    emptyFactoryBucket() {
        return {
            typeFactory: null,
            valueFactory: null,
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
    StorageType[StorageType["ValueFactory"] = 2] = "ValueFactory";
})(StorageType || (StorageType = {}));
//# sourceMappingURL=registrationStorage.js.map