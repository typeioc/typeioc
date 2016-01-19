/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');
import Internal = Typeioc.Internal;

export class RegistrationStorage implements Internal.IRegistrationStorage {

    private _internalStorage : Internal.IInternalStorage<any, IStore>;
    private _addStrategy : Array<(registration : Internal.IRegistrationBase) => void> = [];
    private _getStrategy : Array<(registration : Internal.IRegistrationBase, storage : IStore) => Internal.IRegistrationBase > = [];

    constructor(private storageService : Internal.IInlineInternalStorageService) {
        this._internalStorage = storageService.create<any, IStore>();

        this._addStrategy[1] = this.addForTypeFactory.bind(this);
        this._addStrategy[0] = this.addForFactory.bind(this);

        this._getStrategy[StorageType.TypeFactory] = this.getForTypeFactory.bind(this);
        this._getStrategy[StorageType.Factory] = this.getForFactory.bind(this);
    }

    public addEntry(registration : Internal.IRegistrationBase) : void {

        var strategy = this._addStrategy[registration.forInstantiation ? 1 : 0];

        strategy(registration);
    }

    public getEntry(registration : Internal.IRegistrationBase) : Internal.IRegistrationBase {

        var storage = this._internalStorage.tryGet(registration.service);

        if(!storage) return undefined;

        return this._getStrategy[storage.type](registration, storage);
    }

    private addForTypeFactory(registration : Internal.IRegistrationBase) {

        var storage = this._internalStorage.register(registration.service, this.emptyTypeFactoryBucket);

        storage.type = StorageType.TypeFactory;
        storage.typeFactory.registration = registration;

        if(registration.name) {
            storage.typeFactory.names[registration.name] = registration;
        }
    }

    private addForFactory(registration : Internal.IRegistrationBase) {

        var storage = this._internalStorage.register(registration.service, this.emptyFactoryBucket);

        var argsCount = this.getArgumentsCount(registration);

        storage.type = StorageType.Factory;

        if(!registration.name) {
            storage.factory.noName[argsCount] = registration;
        } else {
            let bucket = storage.factory.names[registration.name] || {};
            bucket[argsCount] = registration;
            storage.factory.names[registration.name] = bucket;
        }
    }

    private getForTypeFactory(registration : Internal.IRegistrationBase, storage : IStore) : Internal.IRegistrationBase {

        return !registration.name ? storage.typeFactory.registration :
            storage.typeFactory.names[registration.name];
    }

    private getForFactory(registration : Internal.IRegistrationBase, storage : IStore) : Internal.IRegistrationBase {

        let argsCount = this.getArgumentsCount(registration);
        let name = storage.factory.names[registration.name];

        return registration.name ?
            (name ? name[argsCount] : undefined) :
            storage.factory.noName[argsCount];
    }

    private getArgumentsCount(registration : Internal.IRegistrationBase) : number {
        
        return registration.factory ?
            Utils.Reflection.getFactoryArgsCount(registration.factory) :
            registration.args.length;
    }

    private emptyTypeFactoryBucket() : IStore {
        return <IStore>{
            typeFactory: {
                registration: null,
                names: {}
            },
            factory: null
        };
    }

    private emptyFactoryBucket() : IStore {
        return <IStore>{
            typeFactory: null,
            factory: {
                noName: {},
                names: {}
            }
        };
    }
}

interface IStore {
    typeFactory : {
        registration : Internal.IRegistrationBase,
        names : Internal.IIndexedCollection<Internal.IRegistrationBase>
    },

    factory : {
        noName : Internal.IIndex<Internal.IRegistrationBase>,
        names : Internal.IIndexedCollection<Internal.IIndex<Internal.IRegistrationBase>>
    },

    type : StorageType
}

enum StorageType {
    Factory,
    TypeFactory
}