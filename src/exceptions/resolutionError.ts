/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseApplicationErrorModule = require('./applicationError');


export class ResolutionError extends BaseApplicationErrorModule.ApplicationError {

    constructor (public message?: string) {
        super(message);

        this.name = "ResolutionError";
    }
}


