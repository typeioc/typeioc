/*---------------------------------------------------------------------------------------------------
 * Copyright (c) 2016 Maxim Gherman
 * typeioc - Dependency injection container for node typescript / javascript
 * @version v1.4.0
 * @link https://github.com/maxgherman/TypeIOC
 * @license MIT
 * --------------------------------------------------------------------------------------------------*/

'use strict';

import ApplicationError from './applicationError';

export default class NullReferenceError extends ApplicationError {

    constructor (message?: string) {
        super(message);

        this.name = 'NullReferenceError';
    }
}


