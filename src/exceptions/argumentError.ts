/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license () - 
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class ArgumentError extends BaseApplicationErrorModule.ApplicationError {

    constructor (public argumentName : string, message?: string) {
        super(message);

        this.name = "ArgumentError";
    }
}
