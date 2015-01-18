/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.7
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

/// <reference path="../../d.ts/typeioc.internal.d.ts" />

'use strict';

import Utils = require('../utils/index');


export class RegistrationStorage<T> implements Typeioc.Internal.IRegistrationStorage<T> {

    constructor(private _internalStorage : Typeioc.Internal.IInternalStorage<any, Typeioc.Internal.IIndexedCollection>) {
    }

    public addEntry(registration : Typeioc.Internal.IRegistrationBase, entry : () => T) : void {

        var storage = this._internalStorage.register(registration.service, this.emptyBucket);

        var argsCount = this.getArgumentsCount(registration);

        if(!registration.name) {
            storage[argsCount] = entry();
        } else {
            var argsStorage = storage[registration.name];
            if(!argsStorage) {
                argsStorage = this.emptyArgsBucket;
                storage[registration.name] = argsStorage;
            }

            argsStorage[argsCount] = entry();
        }
    }

    public getEntry(registration : Typeioc.Internal.IRegistrationBase) : T {

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
        return registration.factory ? Utils.getFactoryArgsCount(registration.factory) : registration.args.length;
    }

    private emptyBucket() : Typeioc.Internal.IIndexedCollection {
        return {};
    }

    private get emptyArgsBucket() : Typeioc.Internal.IIndex {
        return {};
    }

}