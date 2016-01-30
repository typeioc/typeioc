/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class ArgumentError extends BaseApplicationErrorModule.ApplicationError {

    constructor (public argumentName : string, message?: string) {
        super(message);

        this.name = "ArgumentError";
    }
}
