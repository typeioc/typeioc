'use strict';

import BaseError from './baseError';

export default class ApplicationError extends BaseError {

    constructor (message?: string) {
        super(message);

        this.name = "ApplicationError";
    }
}
