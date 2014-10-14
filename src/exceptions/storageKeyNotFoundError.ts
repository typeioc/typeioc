'use strict';


import BaseApplicationErrorModule = require('./applicationError');

export class StorageKeyNotFoundError extends BaseApplicationErrorModule.ApplicationError{

    constructor (public message?: string) {
        super(message);

        this.name = "StorageKeyNotFound";
    }
}
