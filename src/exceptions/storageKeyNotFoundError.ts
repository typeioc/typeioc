'use strict';


import BaseApplicationErrorModule = require('./applicationError');

export class StorageKeyNotFoundError extends BaseApplicationErrorModule.ApplicationError{
    public name = "StorageKeyNotFound";

    constructor (public message?: string) {
        super(message);
    }
}
