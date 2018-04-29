'use strict';

import ApplicationError from './applicationError';

export default class ResolutionError extends ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "ResolutionError";
    }
}


