'use strict';


import ApplicationError from './applicationError';

export default class StorageKeyNotFoundError extends ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "StorageKeyNotFound";
    }
}
