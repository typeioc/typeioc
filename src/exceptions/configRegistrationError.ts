'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class ConfigRegistrationError extends BaseApplicationErrorModule.ApplicationError {

    constructor (public message?: string) {
        super(message);

        this.name = "ConfigError";
    }
}


