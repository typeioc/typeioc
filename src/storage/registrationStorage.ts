/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');


export class RegistrationStorage implements Typeioc.Internal.IRegistrationStorage {

    constructor(private _internalStorage : Typeioc.Internal.IInternalStorage<any, Typeioc.Internal.IIndexedCollection<any>>) {
    }

    public addEntry(registration : Typeioc.Internal.IRegistrationBase) : void {

        var storage = this._internalStorage.register(registration.service, this.emptyBucket);

        var argsCount = this.getArgumentsCount(registration);

        if(!registration.name) {
            storage[argsCount] = registration;
        } else {
            var argsStorage = storage[registration.name];
            if(!argsStorage) {
                argsStorage = this.emptyArgsBucket;
                storage[registration.name] = argsStorage;
            }

            argsStorage[argsCount] = registration;
        }
    }

    public getEntry(registration : Typeioc.Internal.IRegistrationBase) : Typeioc.Internal.IRegistrationBase {

        var storage = this._internalStorage.tryGet(registration.service);

        if(!storage) return undefined;

        var argsCount = this.getArgumentsCount(registration);

        if(!registration.name) {
            return storage[argsCount]
        }
        var argsStorage = storage[registration.name];

        if(!argsStorage) return null;

        return argsStorage[argsCount];
    }

    private getArgumentsCount(registration : Typeioc.Internal.IRegistrationBase) : number {
        return registration.factory ? Utils.Reflection.getFactoryArgsCount(registration.factory) : registration.args.length;
    }

    private emptyBucket() : Typeioc.Internal.IIndexedCollection<any> {
        return {};
    }

    private get emptyArgsBucket() : Typeioc.Internal.IIndex<any> {
        return {};
    }

}