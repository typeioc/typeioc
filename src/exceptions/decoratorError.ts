/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/


'use strict';

import ApplicationErrorModule = require('./applicationError');

export class DecoratorError extends ApplicationErrorModule.ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "DecoratorError";
    }
}