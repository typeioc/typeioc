'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class ArgumentNullError extends BaseApplicationErrorModule.ApplicationError {

    constructor (public message?: string) {
        super(message);

        this.name = "ArgumentNullError";
    }
}


