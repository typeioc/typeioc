'use strict';

import BaseErrorModule = require('./baseError');


export class ApplicationError extends BaseErrorModule.BaseError {
    public name = "ApplicationError";

    constructor (public message?: string) {
        super(message);
    }
}
