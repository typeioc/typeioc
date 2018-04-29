'use strict';

import ArgumentError from './argumentError';

export default class ArgumentNullError extends ArgumentError {

    constructor (argumentName, message?: string) {
        super(argumentName, message);

        this.name = "ArgumentNullError";
    }
}


