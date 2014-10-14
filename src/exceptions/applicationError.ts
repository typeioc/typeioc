'use strict';

import BaseErrorModule = require('./baseError');

export class ApplicationError extends BaseErrorModule.BaseError {

    constructor (public message?: string) {
        super(message);

        this.name = "ApplicationError";
    }
}
