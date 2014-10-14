'use strict';

import BaseApplicationErrorModule = require('./applicationError');


export class ResolutionError extends BaseApplicationErrorModule.ApplicationError {

    constructor (public message?: string) {
        super(message);

        this.name = "ResolutionError";
    }
}


