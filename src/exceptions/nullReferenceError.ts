/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2015 Maxim Gherman
 * typeioc - Dependency injection container for node typescript
 * @version v1.3.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license (MIT) - https://github.com/maxgherman/TypeIOC/blob/master/LICENSE
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import BaseApplicationErrorModule = require('./applicationError');

export class NullReferenceError extends BaseApplicationErrorModule.ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = 'NullReferenceError';
    }
}


