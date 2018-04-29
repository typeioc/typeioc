'use strict';

import { Reflection } from '../utils';
import Internal = Typeioc.Internal;

export class RegistrationStorage implements Internal.IRegistrationStorage {

    private _internalStorage : Internal.IInternalStorage<any, IStore>;
    private _addStrategy : Array<(registration : Internal.IRegistrationBase) => void> = [];
    private _getStrategy : Array<(registration : Internal.IRegistrationBase, storage : IStore) => Internal.IRegistrationBase > = [];

    constructor(private storageService : Internal.IInlineInternalStorageService) {
        this._internalStorage = storageService.create<any, IStore>();

        this._addStrategy[Internal.RegistrationType.FactoryType] = this.addForFactoryType.bind(this);
        this._addStrategy[Internal.RegistrationType.Factory] = this.addForFactory.bind(this);
        this._addStrategy[Internal.RegistrationType.FactoryValue] = this.addForFactoryValue.bind(this);

        this._getStrategy[Internal.RegistrationType.FactoryType] = this.getForFactoryType.bind(this);
        this._getStrategy[Internal.RegistrationType.Factory] = this.getForFactory.bind(this);
        this._getStrategy[Internal.RegistrationType.FactoryValue] = this.getForFactoryValue.bind(this);
    }

    public addEntry(registration : Internal.IRegistrationBase) : void {

        var strategy = this._addStrategy[registration.registrationType];
        strategy(registration);
    }

    public getEntry(registration : Internal.IRegistrationBase) : Internal.IRegistrationBase {

        var storage = this._internalStorage.tryGet(registration.service);

        if(!storage) return undefined;

        return this._getStrategy[storage.type](registration, storage);
    }

    public clear() {
        this._internalStorage.clear();
    }

    private addForFactoryType(registration : Internal.IRegistrationBase) {

        const storage = this._internalStorage.register(registration.service, this.emptyTypeFactoryBucket);
        storage.type = Internal.RegistrationType.FactoryType;

        if(!registration.name) {
            storage.typeFactory.noName = registration;
        } else {
            storage.typeFactory.names[registration.name] = registration;
        }
    }

    private addForFactory(registration : Internal.IRegistrationBase) {

        const storage = this._internalStorage.register(registration.service, this.emptyFactoryBucket);
        storage.type = Internal.RegistrationType.Factory;

        const argsCount = this.getArgumentsCount(registration);

        if(!registration.name) {
            storage.factory.noName[argsCount] = registration;
        } else {
            let bucket = storage.factory.names[registration.name] || {};
            bucket[argsCount] = registration;
            storage.factory.names[registration.name] = bucket;
        }
    }

    private addForFactoryValue(registration : Internal.IRegistrationBase) {
        const storage = this._internalStorage.register(registration.service, this.emptyValueFactoryBucket);
        storage.type = Internal.RegistrationType.FactoryValue;

        if(!registration.name) {
            storage.valueFactory.noName = registration;
        } else {
            storage.valueFactory.names[registration.name] = registration;
        }
    }

    private getForFactoryType(registration : Internal.IRegistrationBase, storage : IStore) : Internal.IRegistrationBase {

        return !registration.name ? storage.typeFactory.noName :
            storage.typeFactory.names[registration.name];
    }

    private getForFactory(registration : Internal.IRegistrationBase, storage : IStore) : Internal.IRegistrationBase {

        let argsCount = this.getArgumentsCount(registration);
        let name = storage.factory.names[registration.name];

        return registration.name ?
            (name ? name[argsCount] : undefined) :
            storage.factory.noName[argsCount];
    }

    private getForFactoryValue(registration : Internal.IRegistrationBase, storage : IStore) : Internal.IRegistrationBase {

        return !registration.name ? storage.valueFactory.noName :
            storage.valueFactory.names[registration.name];
    }

    private getArgumentsCount(registration : Internal.IRegistrationBase) : number {
        
        return registration.factory ?
            Reflection.getFactoryArgsCount(registration.factory) :
            registration.args.length;
    }

    private emptyTypeFactoryBucket() : IStore {
        return <IStore>{
            typeFactory: {
                noName: null,
                names: {}
            },
            valueFactory: null,
            factory: null
        };
    }

    private emptyValueFactoryBucket() : IStore {
        return <IStore>{
            typeFactory: null,
            valueFactory: {
                noName: null,
                names: {}
            },
            factory: null
        };
    }

    private emptyFactoryBucket() : IStore {
        return <IStore>{
            typeFactory: null,
            valueFactory: null,
            factory: {
                noName: {},
                names: {}
            }
        };
    }
}

interface IStore {
    typeFactory : {
        noName : Internal.IRegistrationBase,
        names : Internal.IIndexedCollection<Internal.IRegistrationBase>
    },

    valueFactory: {
        noName : Internal.IRegistrationBase,
        names : Internal.IIndexedCollection<Internal.IRegistrationBase>
    },

    factory : {
        noName : Internal.IIndex<Internal.IRegistrationBase>,
        names : Internal.IIndexedCollection<Internal.IIndex<Internal.IRegistrationBase>>
    },

    type : Internal.RegistrationType
}