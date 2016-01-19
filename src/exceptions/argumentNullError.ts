/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseArgumentErrorModule = require('./argumentError');

export class ArgumentNullError extends BaseArgumentErrorModule.ArgumentError {

    constructor (argumentName, message?: string) {
        super(argumentName, message);

        this.name = "ArgumentNullError";
    }
}


