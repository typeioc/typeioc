/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.2.8
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseErrorModule = require('./baseError');

export class ApplicationError extends BaseErrorModule.BaseError {

    constructor (public message?: string) {
        super(message);

        this.name = "ApplicationError";
    }
}
