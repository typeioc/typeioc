
'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class ProxyError extends BaseApplicationErrorModule.ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "ProxyError";
    }
}
