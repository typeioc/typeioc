'use strict';

import ApplicationError from './applicationError';

export default class CircularDependencyError extends ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "CircularDependencyError";
    }
}


