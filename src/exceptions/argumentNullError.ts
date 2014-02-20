'use strict';

import BaseApplicationErrorModule = require('./applicationError');


export class ArgumentNullError extends BaseApplicationErrorModule.ApplicationError {
    public name = "ArgumentNullError";

    constructor (public message?: string) {
        super(message);
    }
}


