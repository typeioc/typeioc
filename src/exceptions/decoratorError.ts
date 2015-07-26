/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.9
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/


'use strict';

import ApplicationErrorModule = require('./applicationError');

export class DecoratorError extends ApplicationErrorModule.ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = "DecoratorError";
    }
}