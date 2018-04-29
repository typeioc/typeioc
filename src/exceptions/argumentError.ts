'use strict';

import ApplicationError from './applicationError';

export default class ArgumentError extends ApplicationError {

    constructor (public argumentName : string, message?: string) {
        super(message);

        this.name = "ArgumentError";
    }
}
