/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseErrorModule = require('./baseError');

export class ApplicationError extends BaseErrorModule.BaseError {

    constructor (public message?: string) {
        super(message);

        this.name = "ApplicationError";
    }
}
