'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class ArgumentError extends BaseApplicationErrorModule.ApplicationError {

    constructor (public argumentName : string, message?: string) {
        super(message);

        this.name = "ArgumentError";
    }
}
