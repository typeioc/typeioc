'use strict';

import BaseApplicationErrorModule = require('./applicationError');


export class ResolutionError extends BaseApplicationErrorModule.ApplicationError {
    public name = "ResolutionError";

    constructor (public message?: string) {
        super(message);
    }
}


