
'use strict';

import ApplicationError from './applicationError';

export default class ProxyError extends ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "ProxyError";
    }
}
