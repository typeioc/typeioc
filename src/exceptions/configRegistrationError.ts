'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class ConfigRegistrationError extends BaseApplicationErrorModule.ApplicationError {
    public name = "ConfigError";

    constructor (public message?: string) {
        super(message);
    }
}


