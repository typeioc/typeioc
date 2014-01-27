/// <reference path="../d.ts/node.d.ts" />
/// <reference path="../d.ts/typeioc.d.ts" />

'use strict';

import Utils = require('./utils');
import Exceptions = require('./exceptions');

var hashes = require('hashes');



interface IIndex {
    [index: number]: any;
}


interface IIndexedCollection extends IIndex {
    [name: string]: any;
}

export class InternalStorage implements Typeioc.IInternalStorage {

    private _collection : any;

    constructor() {
        this._collection =  new hashes.HashTable();
    }

    public addEntry(registration : Typeioc.IRegistrationBase) : void {

        if(!this.contains(registration.service)) {
            var storage = this.emptyBucket;
            this.add(registration.service, storage);
        } else {
            storage = this.get(registration.service);
        }

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

    public getEntry(registration : Typeioc.IRegistrationBase) : Typeioc.IRegistrationBase {
        try {

            if(!this.contains(registration.service)) return null;

            var storage = this.get(registration.service);
            var argsCount = this.getArgumentsCount(registration);


            if(!registration.name) {
                return storage[argsCount]
            } else
            {
                var argsStorage = storage[registration.name];

                if(!argsStorage) return null;

                return argsStorage[argsCount];
            }

        } catch(error) {

            var resolutionError : any  = new Exceptions.ResolutionError('Error constructing service key');
            resolutionError.innerError = error;

            throw resolutionError;
        }
    }

    private getArgumentsCount(registration : Typeioc.IRegistrationBase) : number {
        return registration.factory ? Utils.getFactoryArgsCount(registration.factory) : registration.args.length;
    }

    private add(key : any, value : IIndexedCollection) : void {
        this._collection.add(key, value, true)
    }

    private get(key :any) : IIndexedCollection {
        return this._collection.get(key).value;
    }

    private contains (key : any) : boolean {
        return this._collection.contains(key);
    }

    private get emptyBucket() : IIndexedCollection {
        return {};
    }

    private get emptyArgsBucket() : IIndex {
        return {};
    }

}