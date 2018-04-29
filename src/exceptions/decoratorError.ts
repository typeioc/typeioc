
'use strict';

import ApplicationError from './applicationError';

export default class DecoratorError extends ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "DecoratorError";
    }
}